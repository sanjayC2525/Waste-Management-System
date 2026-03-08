import React, { useState, useEffect } from 'react';
import aiModeration from '../services/aiContentModeration';

const ContentWarning = ({ 
  content, 
  onContentChange, 
  showWarning = true, 
  onSubmit,
  children 
}) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetailedWarning, setShowDetailedWarning] = useState(false);

  // Analyze content when it changes
  useEffect(() => {
    if (!content || content.trim().length === 0) {
      setAnalysis(null);
      return;
    }

    const analyzeContent = async () => {
      setIsAnalyzing(true);
      try {
        const result = await aiModeration.analyzeContent(content);
        setAnalysis(result);
      } catch (error) {
        console.error('Content analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const timeoutId = setTimeout(analyzeContent, 500); // Debounce analysis
    return () => clearTimeout(timeoutId);
  }, [content]);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(analysis);
    }
  };

  const getWarningColor = () => {
    if (!analysis) return '';
    switch (analysis.severity) {
      case 'mild': return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      case 'moderate': return 'border-orange-500 bg-orange-50 text-orange-800';
      case 'severe': return 'border-red-500 bg-red-50 text-red-800';
      default: return '';
    }
  };

  const getWarningIcon = () => {
    if (!analysis) return '';
    switch (analysis.severity) {
      case 'mild': return '';
      case 'moderate': return '';
      case 'severe': return '';
      default: return '';
    }
  };

  // Don't show anything if no content or no harmful content detected
  if (!showWarning || !analysis || !analysis.isHarmful) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-3">
      {/* Warning Banner */}
      <div className={`border rounded-lg p-3 ${getWarningColor()}`}>
        <div className="flex items-start space-x-2">
          <span className="text-lg">{getWarningIcon()}</span>
          <div className="flex-1">
            <p className="font-medium">
              {aiModeration.getWarningMessage(analysis)}
            </p>
            
            {/* Show analysis details */}
            <div className="mt-2 text-sm opacity-75">
              <span>Detected: {analysis.categories.join(', ')}</span>
              {analysis.confidence > 0 && (
                <span className="ml-2">
                  (Confidence: {Math.round(analysis.confidence * 100)}%)
                </span>
              )}
              <span className="ml-2">
                Method: {analysis.method}
              </span>
            </div>

            {/* Detailed warning toggle */}
            {analysis.severity !== 'mild' && (
              <button
                type="button"
                onClick={() => setShowDetailedWarning(!showDetailedWarning)}
                className="mt-2 text-sm underline hover:no-underline"
              >
                {showDetailedWarning ? 'Hide' : 'Show'} details
              </button>
            )}
          </div>
        </div>

        {/* Detailed warning */}
        {showDetailedWarning && (
          <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-sm">
            <p className="font-medium mb-1">Why this was flagged:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {analysis.categories.map(category => (
                <li key={category}>
                  <strong>{category}:</strong> {
                    category === 'threat' && 'Language suggesting harm or threats'
                  }
                  {category === 'profanity' && 'Inappropriate or offensive language'
                  }
                  {category === 'harassment' && 'Potentially harassing content'
                  }
                  {category === 'violence' && 'References to violence'
                  }
                  {category === 'anger' && 'Strong angry or frustrated tone'
                  }
                </li>
              ))}
            </ul>
            
            {analysis.severity === 'severe' && (
              <p className="mt-2 text-red-800 font-medium">
                This content may be blocked from submission.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Submit button with warning */}
      {children && (
        <div className="flex items-center space-x-2">
          {React.cloneElement(children, {
            onClick: handleSubmit,
            disabled: analysis.severity === 'severe' || (children.props.disabled || false)
          })}
          
          {analysis.severity === 'severe' && (
            <span className="text-sm text-red-600">
              Content too severe to submit
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentWarning;
