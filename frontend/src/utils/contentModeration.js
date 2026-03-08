// Content moderation utility for analyzing user input
// This can be integrated with AI services for content analysis

export const analyzeContent = async (text) => {
  try {
    // For now, return a basic analysis
    // In a real implementation, this would call an AI service
    const analysis = {
      isHarmful: false,
      severity: 'low',
      categories: [],
      confidence: 0,
      method: 'basic'
    };

    // Basic keyword detection (can be enhanced)
    const harmfulKeywords = ['spam', 'abuse', 'hate', 'violence'];
    const foundKeywords = harmfulKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    );

    if (foundKeywords.length > 0) {
      analysis.isHarmful = true;
      analysis.severity = foundKeywords.length > 2 ? 'severe' : 'moderate';
      analysis.categories = foundKeywords;
      analysis.confidence = 0.7;
    }

    return analysis;
  } catch (error) {
    console.error('Content analysis error:', error);
    return {
      isHarmful: false,
      severity: 'low',
      categories: [],
      confidence: 0,
      method: 'basic'
    };
  }
};
