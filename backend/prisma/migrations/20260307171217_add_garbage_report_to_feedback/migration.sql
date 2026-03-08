-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Feedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "citizenId" INTEGER NOT NULL,
    "adminId" INTEGER,
    "workerId" INTEGER,
    "garbageReportId" INTEGER,
    "adminReply" TEXT,
    "adminNotes" TEXT,
    "replied" BOOLEAN NOT NULL DEFAULT false,
    "aiAnalysis" TEXT,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "flaggedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Feedback_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Feedback_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Feedback_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Feedback_garbageReportId_fkey" FOREIGN KEY ("garbageReportId") REFERENCES "GarbageReport" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Feedback" ("adminId", "adminNotes", "adminReply", "category", "citizenId", "createdAt", "description", "id", "priority", "replied", "status", "title", "type", "updatedAt") SELECT "adminId", "adminNotes", "adminReply", "category", "citizenId", "createdAt", "description", "id", "priority", "replied", "status", "title", "type", "updatedAt" FROM "Feedback";
DROP TABLE "Feedback";
ALTER TABLE "new_Feedback" RENAME TO "Feedback";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
