import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Simple markdown parsing for bold text
  const renderMarkdown = (text: string) => {
    // Split by ** for bold text
    const parts = text.split(/\*\*(.*?)\*\*/g);
    
    return parts.map((part, index) => {
      // Even indices are regular text, odd indices are bold
      if (index % 2 === 0) {
        // Handle line breaks
        return part.split('\n').map((line, lineIndex) => (
          <React.Fragment key={`${index}-${lineIndex}`}>
            {lineIndex > 0 && <br />}
            {line}
          </React.Fragment>
        ));
      } else {
        // Bold text
        return <strong key={index} className="font-semibold">{part}</strong>;
      }
    });
  };

  return (
    <div className={className}>
      {renderMarkdown(content)}
    </div>
  );
};