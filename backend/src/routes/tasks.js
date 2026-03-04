const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const NotificationService = require('../services/notificationService');
// const AIAssignmentService = require('../services/aiAssignmentService');

const router = express.Router();
const prisma = new PrismaClient();

// Status transition validation for tasks
const VALID_TASK_TRANSITIONS = {
  'ASSIGNED': ['ACCEPTED', 'UNABLE'],
  'ACCEPTED': ['IN_PROGRESS', 'UNABLE'],
  'IN_PROGRESS': ['COMPLETED', 'UNABLE'],
  'COMPLETED': [],
  'UNABLE': []
};

// Helper function to add status history entry
const addStatusHistory = (currentHistory, newStatus, note = '') => {
  const history = currentHistory ? JSON.parse(currentHistory) : [];
  history.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: note || `Status changed to ${newStatus}`
  });
  return JSON.stringify(history);
};

// Worker: Get assigned tasks
router.get('/', authenticateToken, authorizeRoles('Worker'), async (req, res) => {
  try {
    const worker = await prisma.worker.findUnique({
      where: { userId: req.user.id },
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker profile not found' });
    }

    const tasks = await prisma.task.findMany({
      where: { workerId: worker.id },
      include: {
        garbageReport: {
          include: {
            citizen: { select: { name: true } },
          },
        },
      },
      orderBy: { scheduledTime: 'asc' },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Worker: Mark task as collected or update status
router.put('/:id/collect', authenticateToken, authorizeRoles('Worker'), async (req, res) => {
  try {
    const { id } = req.params;
    const { action, unableReason } = req.body; // 'accept', 'start', 'complete', 'unable'

    if (!['accept', 'start', 'complete', 'unable'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const worker = await prisma.worker.findUnique({
      where: { userId: req.user.id },
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker profile not found' });
    }

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: { 
        worker: true,
        garbageReport: true
      },
    });

    if (!task || task.workerId !== worker.id) {
      return res.status(404).json({ error: 'Task not found or not assigned to you' });
    }

    let newStatus;
    let note;
    let updateData = {};

    switch (action) {
      case 'accept':
        newStatus = 'ACCEPTED';
        note = 'Task accepted by worker';
        updateData.status = newStatus;
        updateData.statusHistory = addStatusHistory(task.statusHistory, newStatus, note);
        updateData.acceptedAt = new Date();
        
        // Update garbage report status to IN_PROGRESS when worker accepts
        if (task.garbageReport) {
          await prisma.garbageReport.update({
            where: { id: task.garbageReport.id },
            data: {
              status: 'IN_PROGRESS',
              statusHistory: addStatusHistory(
                task.garbageReport.statusHistory,
                'IN_PROGRESS',
                `Task accepted by worker ${req.user.name}`
              )
            }
          });

          // Notify citizen that worker has accepted the task
          await NotificationService.createNotification(
            task.garbageReport.citizenId,
            'Worker Assigned to Your Request',
            `${req.user.name} has accepted your garbage collection request and will be starting soon.`,
            'SUCCESS',
            'TASK',
            task.id
          );
        }
        break;
      
      case 'start':
        newStatus = 'IN_PROGRESS';
        note = 'Collection started by worker';
        updateData.status = newStatus;
        updateData.statusHistory = addStatusHistory(task.statusHistory, newStatus, note);
        
        // Update garbage report status to IN_PROGRESS when worker starts
        if (task.garbageReport) {
          await prisma.garbageReport.update({
            where: { id: task.garbageReport.id },
            data: {
              status: 'IN_PROGRESS',
              statusHistory: addStatusHistory(
                task.garbageReport.statusHistory,
                'IN_PROGRESS',
                `Collection started by ${req.user.name}`
              )
            }
          });

          // Notify citizen that worker has started the collection
          await NotificationService.createNotification(
            task.garbageReport.citizenId,
            'Collection in Progress',
            `${req.user.name} has started collecting your garbage. The task will be completed soon.`,
            'INFO',
            'TASK',
            task.id
          );
        }
        break;
      
      case 'complete':
        newStatus = 'COMPLETED';
        note = 'Collection completed by worker';
        updateData.status = newStatus;
        updateData.statusHistory = addStatusHistory(task.statusHistory, newStatus, note);
        updateData.completedAt = new Date();
        
        // Also update the garbage report status
        if (task.garbageReport) {
          await prisma.garbageReport.update({
            where: { id: task.garbageReport.id },
            data: {
              status: 'COMPLETED',
              statusHistory: addStatusHistory(
                task.garbageReport.statusHistory,
                'COMPLETED',
                `Collection completed by ${req.user.name}`
              )
            }
          });

          // Notify citizen that the task is completed
          await NotificationService.createNotification(
            task.garbageReport.citizenId,
            'Garbage Collection Completed',
            `${req.user.name} has successfully completed your garbage collection request. Thank you for using our service!`,
            'SUCCESS',
            'TASK',
            task.id
          );
        }
        break;

      case 'unable':
        newStatus = 'UNABLE';
        note = unableReason || 'Worker unable to complete task';
        updateData.status = newStatus;
        updateData.statusHistory = addStatusHistory(task.statusHistory, newStatus, note);
        updateData.unableReason = unableReason;
        
        // Update garbage report back to WORK_BEING_REASSIGNED for reassignment
        if (task.garbageReport) {
          await prisma.garbageReport.update({
            where: { id: task.garbageReport.id },
            data: {
              status: 'WORK_BEING_REASSIGNED',
              assignedWorkerId: null, // Remove worker assignment
              statusHistory: addStatusHistory(
                task.garbageReport.statusHistory,
                'WORK_BEING_REASSIGNED',
                `Task marked as unable by ${req.user.name}: ${unableReason}`
              )
            }
          });

          // Send notifications to admins
          const adminIds = await prisma.user.findMany({
            where: { role: 'Admin' },
            select: { id: true }
          }).then(admins => admins.map(a => a.id));

          await NotificationService.notifyWorkerUnable(
            adminIds, 
            task.id, 
            req.user.name, 
            unableReason
          );

          // Notify customer about reassignment needed
          await NotificationService.createNotification(
            task.garbageReport.citizenId,
            'Work Being Re-Assigned',
            `The worker was unable to complete your request due to: ${unableReason}. We are assigning a new worker to handle your request.`,
            'WARNING',
            'TASK',
            task.id
          );
        }
        break;
    }

    // Validate status transition
    const validTransitions = VALID_TASK_TRANSITIONS[task.status] || [];
    if (!validTransitions.includes(newStatus)) {
      return res.status(400).json({ 
        error: `Invalid status transition from ${task.status} to ${newStatus}` 
      });
    }

    await prisma.task.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({ message: `Task ${action}d successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

module.exports = router;

// Admin: Get UNABLE tasks for reassignment
router.get('/unable', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const unableTasks = await prisma.task.findMany({
      where: { status: 'UNABLE' },
      include: {
        worker: {
          include: {
            user: { select: { name: true, email: true } }
          }
        },
        garbageReport: {
          include: {
            citizen: { select: { name: true, email: true } }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(unableTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch unable tasks' });
  }
});

// Admin: Reassign UNABLE task to new worker
router.put('/:id/reassign', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { workerId } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: { garbageReport: true }
    });

    if (!task || task.status !== 'UNABLE') {
      return res.status(404).json({ error: 'Unable task not found' });
    }

    // Get new worker info
    const newWorker = await prisma.worker.findUnique({
      where: { id: parseInt(workerId) },
      include: { user: true }
    });

    if (!newWorker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Update task with new worker and reset status
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        workerId: parseInt(workerId),
        status: 'ASSIGNED',
        statusHistory: addStatusHistory(
          task.statusHistory,
          'ASSIGNED',
          `Task reassigned by admin to ${newWorker.user.name}`
        ),
        unableReason: null
      },
      include: {
        worker: {
          include: {
            user: { select: { name: true, email: true } }
          }
        },
        garbageReport: {
          include: {
            citizen: { select: { name: true, email: true } }
          }
        }
      }
    });

    // Update garbage report with new worker assignment
    await prisma.garbageReport.update({
      where: { id: task.garbageReport.id },
      data: {
        assignedWorkerId: parseInt(workerId),
        status: 'ASSIGNED',
        statusHistory: addStatusHistory(
          task.garbageReport.statusHistory,
          'ASSIGNED',
          `Task reassigned to ${newWorker.user.name}`
        )
      }
    });

    // Notify new worker
    await NotificationService.notifyTaskAssigned(
      newWorker.userId,
      task.id,
      task.garbageReport.id
    );

    // Notify customer about reassignment
    await NotificationService.createNotification(
      task.garbageReport.citizenId,
      'Task Reassigned',
      `Your garbage report task has been reassigned to ${newWorker.user.name}`,
      'SUCCESS',
      'TASK',
      task.id
    );

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reassign task' });
  }
});