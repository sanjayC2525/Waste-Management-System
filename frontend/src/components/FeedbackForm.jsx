import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const FeedbackForm = ({ onSubmit, onCancel, workers = [], showTypeSelector = false }) => {
  const [formData, setFormData] = useState({
    type: showTypeSelector ? 'FEEDBACK' : 'COMPLAINT',
    title: '',
    description: '',
    category: 'GENERAL',
    priority: 'MEDIUM',
    workerId: '',
  });
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // Simple AI analysis that won't break the component
  const analyzeContent = (text) => {
    console.log('🤖 Analyzing content:', text);
    
    if (!text || text.trim().length === 0) {
      console.log('🤖 No content to analyze');
      return null;
    }

    const lowerText = text.toLowerCase();
    
    // Simple word-based analysis (safe, no external dependencies)
    const harmfulWords = {
      threat: ['kill', 'harm', 'hurt', 'destroy', 'damage', 'break', 'murder', 'death', 'die'],
      profanity: ['damn', 'hell', 'crap', 'stupid', 'idiot', 'fuck', 'shit', 'bitch', 'ass', 'asshole', 'bastard', 'dick', 'pussy', 'cunt', 'whore', 'slut'],
      harassment: ['hate', 'disgusting', 'pathetic', 'worthless', 'loser', 'ugly', 'fat', 'stupid'],
      violence: ['punch', 'hit', 'fight', 'attack', 'violent', 'beat', 'kick', 'slap']
    };

    const foundCategories = [];
    let totalMatches = 0;

    Object.entries(harmfulWords).forEach(([category, words]) => {
      const matches = words.filter(word => lowerText.includes(word)).length;
      if (matches > 0) {
        foundCategories.push(category);
        totalMatches += matches;
        console.log(`🤖 Found ${category}: ${matches} matches`);
      }
    });

    // Angry pattern detection
    const angryPatterns = [
      /\b(very|extremely|really)\s+(angry|mad|furious|pissed)\b/i,
      /\b(worst|terrible|awful|horrible)\b/i,
      /\b(hate|despise|loathe)\b/i,
      /[!]{3,}/
    ];

    const angryMatches = angryPatterns.filter(pattern => pattern.test(text)).length;
    if (angryMatches > 0) {
      foundCategories.push('anger');
      totalMatches += angryMatches;
      console.log(`🤖 Found anger: ${angryMatches} matches`);
    }

    if (foundCategories.length === 0) {
      console.log('🤖 No harmful content detected');
      return null;
    }

    const isHarmful = foundCategories.length > 0;
    const confidence = Math.min(totalMatches * 0.3, 0.9);
    
    let severity = 'mild';
    if (foundCategories.includes('threat') || foundCategories.includes('violence')) {
      severity = 'severe';
    } else if (foundCategories.includes('harassment') || 
               (foundCategories.includes('profanity') && totalMatches >= 2) ||
               (lowerText.includes('fuck') || lowerText.includes('cunt') || lowerText.includes('bitch'))) {
      severity = 'moderate';
    }

    const analysis = {
      isHarmful,
      confidence,
      categories: foundCategories,
      severity,
      method: 'simple'
    };

    console.log('🤖 Analysis result:', analysis);
    return analysis;
  };

  // Analyze content when form data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fullText = `${formData.title} ${formData.description}`;
      const analysis = analyzeContent(fullText);
      console.log('🤖 Setting AI analysis state:', analysis);
      setAiAnalysis(analysis);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData.title, formData.description]);

  const getCategoryOptions = () => {
    if (formData.type === 'ISSUE') {
      return [
        { value: 'GENERAL', label: 'General' },
        { value: 'REPORT_REJECTED', label: 'Report Rejected' },
        { value: 'WORKER_CONDUCT', label: 'Worker Conduct' },
        { value: 'SYSTEM_ERROR', label: 'System Error' },
        { value: 'OTHER', label: 'Other' },
        { value: 'COLLECTION', label: 'Collection Issue' }
      ];
    } else {
      return [
        { value: 'GENERAL', label: 'General' },
        { value: 'SERVICE', label: 'Service Quality' },
        { value: 'WORKER', label: 'Worker Conduct' },
        { value: 'SYSTEM', label: 'System Issue' },
        { value: 'COLLECTION', label: 'Collection Issue' },
        { value: 'OTHER', label: 'Other' }
      ];
    }
  };

  useEffect(() => {
    const validCategories = getCategoryOptions().map(opt => opt.value);
    if (!validCategories.includes(formData.category)) {
      setFormData(prev => ({ ...prev, category: 'GENERAL' }));
    }
  }, [formData.type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    // Check if current analysis indicates content should be blocked
    if (aiAnalysis && aiAnalysis.severity === 'severe') {
      toast.error('Content contains inappropriate language and cannot be submitted');
      return;
    }

    setLoading(true);
    try {
      // Include AI analysis in the submission data
      const submissionData = {
        ...formData,
        aiAnalysis: aiAnalysis ? {
          isHarmful: aiAnalysis.isHarmful,
          severity: aiAnalysis.severity,
          categories: aiAnalysis.categories,
          confidence: aiAnalysis.confidence,
          method: aiAnalysis.method
        } : null
      };
      
      console.log('Submitting feedback with AI analysis:', submissionData);
      await onSubmit(submissionData);
      // Success toast handled by parent component
      setFormData({
        type: showTypeSelector ? 'FEEDBACK' : 'COMPLAINT',
        title: '',
        description: '',
        category: 'GENERAL',
        priority: 'MEDIUM',
        workerId: '',
      });
      setAiAnalysis(null);
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to submit feedback. Please try again.';
      toast.error(`Submission failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-surface rounded-lg p-6 shadow-soft">
      <h3 className="text-lg font-semibold mb-4 text-text-primary">
        {showTypeSelector ? 'Submit Issue or Feedback' : 'Submit Feedback'}
      </h3>
      
      {/* AI Warning Display */}
      {aiAnalysis && aiAnalysis.isHarmful && (
        <div className={`mb-4 p-3 rounded-lg border ${
          aiAnalysis.severity === 'severe' ? 'border-red-500 bg-red-50 text-red-800' :
          aiAnalysis.severity === 'moderate' ? 'border-orange-500 bg-orange-50 text-orange-800' :
          'border-yellow-500 bg-yellow-50 text-yellow-800'
        }`}>
          <div className="flex items-start space-x-2">
            <span className="text-lg">
              {aiAnalysis.severity === 'severe' ? '🚨' : '⚠️'}
            </span>
            <div className="flex-1">
              <p className="font-medium">
                {aiAnalysis.severity === 'severe' && 'Content contains inappropriate language and cannot be submitted'}
                {aiAnalysis.severity === 'moderate' && 'Content contains concerning language and will be reviewed by admin'}
                {aiAnalysis.severity === 'mild' && 'Content contains some strong language'}
              </p>
              <p className="text-sm opacity-75 mt-1">
                Detected: {aiAnalysis.categories.join(', ')} 
                {aiAnalysis.confidence > 0 && ` (${Math.round(aiAnalysis.confidence * 100)}% confidence)`}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {showTypeSelector && (
          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
            >
              <option value="FEEDBACK">Feedback</option>
              <option value="COMPLAINT">Complaint</option>
              <option value="SUGGESTION">Suggestion</option>
              <option value="ISSUE">Issue</option>
              <option value="COMPLIMENT">Compliment</option>
            </select>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
            >
              {getCategoryOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-text-primary">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-text-primary">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your feedback in detail"
            rows={4}
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary resize-none"
            required
          />
        </div>
        {workers.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary">Related Worker (Optional)</label>
            <select
              name="workerId"
              value={formData.workerId}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
            >
              <option value="">Select a worker...</option>
              {workers.map(worker => (
                <option key={worker.id} value={worker.id}>
                  {worker.name} ({worker.email})
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-surfaceLight hover:bg-surface text-text-primary font-medium rounded-md transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || (aiAnalysis && aiAnalysis.severity === 'severe')}
            className="px-4 py-2 bg-status-success hover:bg-status-success/90 text-white font-medium rounded-md transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
