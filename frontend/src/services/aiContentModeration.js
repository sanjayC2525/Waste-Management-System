// AI Content Moderation Service
// Isolated module that won't affect existing functionality

class AIContentModeration {
  constructor() {
    this.model = null;
    this.isLoaded = false;
    this.isLoading = false;
    this.fallbackEnabled = true;
  }

  // Initialize AI model when website loads
  async initialize() {
    if (this.isLoaded || this.isLoading) return;
    
    this.isLoading = true;
    console.log('🤖 Loading AI Content Moderation...');
    
    try {
      // Try to load TensorFlow.js toxicity model
      const toxicity = await import('@tensorflow-models/toxicity');
      this.model = await toxicity.load(0.7); // 70% confidence threshold
      this.isLoaded = true;
      console.log('✅ AI Content Moderation loaded successfully');
    } catch (error) {
      console.warn('⚠️ AI model failed to load, using fallback:', error.message);
      this.fallbackEnabled = true;
    } finally {
      this.isLoading = false;
    }
  }

  // Analyze content for harmful material
  async analyzeContent(text) {
    if (!text || text.trim().length === 0) {
      return {
        isHarmful: false,
        confidence: 0,
        categories: [],
        severity: 'safe',
        method: 'empty'
      };
    }

    // If AI model is loaded, use it
    if (this.isLoaded && this.model) {
      try {
        const predictions = await this.model.classify(text);
        return this.processAIPredictions(predictions);
      } catch (error) {
        console.warn('AI analysis failed, using fallback:', error);
        return this.fallbackAnalysis(text);
      }
    }

    // Use fallback analysis
    return this.fallbackAnalysis(text);
  }

  // Process AI model predictions
  processAIPredictions(predictions) {
    const harmfulCategories = predictions.filter(p => p.results[0].probabilities[1] > 0.7);
    const isHarmful = harmfulCategories.length > 0;
    
    return {
      isHarmful,
      confidence: isHarmful ? Math.max(...harmfulCategories.map(c => c.results[0].probabilities[1])) : 0,
      categories: harmfulCategories.map(c => c.label),
      severity: this.calculateSeverity(harmfulCategories),
      method: 'ai'
    };
  }

  // Fallback analysis using pattern matching
  fallbackAnalysis(text) {
    const lowerText = text.toLowerCase();
    
    // Harmful word categories
    const harmfulWords = {
      threat: ['kill', 'harm', 'hurt', 'destroy', 'damage', 'break'],
      profanity: ['damn', 'hell', 'crap', 'stupid', 'idiot'],
      harassment: ['hate', 'disgusting', 'pathetic', 'worthless'],
      violence: ['punch', 'hit', 'fight', 'attack', 'violent']
    };

    const foundCategories = [];
    let totalMatches = 0;

    Object.entries(harmfulWords).forEach(([category, words]) => {
      const matches = words.filter(word => lowerText.includes(word)).length;
      if (matches > 0) {
        foundCategories.push(category);
        totalMatches += matches;
      }
    });

    // Angry/angry pattern detection
    const angryPatterns = [
      /\b(very|extremely|really)\s+(angry|mad|furious|pissed)\b/i,
      /\b(worst|terrible|awful|horrible)\b/i,
      /\b(hate|despise|loathe)\b/i,
      /[!]{3,}/ // Multiple exclamation marks
    ];

    const angryMatches = angryPatterns.filter(pattern => pattern.test(text)).length;
    if (angryMatches > 0) {
      foundCategories.push('anger');
      totalMatches += angryMatches;
    }

    const isHarmful = foundCategories.length > 0;
    const confidence = Math.min(totalMatches * 0.3, 0.9); // Max 90% confidence

    return {
      isHarmful,
      confidence,
      categories: foundCategories,
      severity: this.calculateSeverity(foundCategories),
      method: 'fallback'
    };
  }

  // Calculate severity level
  calculateSeverity(categories) {
    if (categories.length === 0) return 'safe';
    if (categories.includes('threat') || categories.includes('violence')) return 'severe';
    if (categories.includes('harassment') || categories.includes('anger')) return 'moderate';
    return 'mild';
  }

  // Get warning message for user
  getWarningMessage(analysis) {
    const messages = {
      safe: '',
      mild: '⚠️ Your feedback contains some strong language. Please consider rephrasing.',
      moderate: '⚠️ Your feedback contains concerning language. It will be reviewed by admin.',
      severe: '🚨 Your feedback contains inappropriate content. It will be reviewed and may be removed.'
    };

    return messages[analysis.severity] || '';
  }

  // Check if content should be blocked
  shouldBlockContent(analysis) {
    return analysis.severity === 'severe';
  }

  // Check if content should be flagged for admin review
  shouldFlagForReview(analysis) {
    return analysis.isHarmful && analysis.confidence > 0.5;
  }
}

// Create singleton instance
const aiModeration = new AIContentModeration();

// Auto-initialize when page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    aiModeration.initialize();
  });
}

export default aiModeration;
