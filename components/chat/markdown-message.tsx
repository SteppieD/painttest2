'use client';

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

export function MarkdownMessage({ content, className = "" }: MarkdownMessageProps) {
  // Simple markdown to HTML conversion for chat messages
  const renderMarkdown = (text: string) => {
    // Split by double newlines to preserve paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      // Handle headers
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        const headerText = paragraph.slice(2, -2);
        return <h3 key={pIndex} className="font-semibold text-base mb-2">{headerText}</h3>;
      }
      
      // Handle bullet points
      if (paragraph.includes('•')) {
        const lines = paragraph.split('\n');
        const listItems = lines
          .filter(line => line.trim().startsWith('•'))
          .map((line, lIndex) => {
            const text = line.replace('•', '').trim();
            // Handle inline bold text
            const renderedText = text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
              }
              return part;
            });
            return <li key={lIndex} className="ml-4">{renderedText}</li>;
          });
        
        if (listItems.length > 0) {
          return <ul key={pIndex} className="list-disc list-inside space-y-1 mb-3">{listItems}</ul>;
        }
      }
      
      // Handle inline formatting in regular paragraphs
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/);
      const renderedParts = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        // Handle line breaks within paragraphs
        return part.split('\n').map((line, lineIndex) => (
          <span key={`${i}-${lineIndex}`}>
            {line}
            {lineIndex < part.split('\n').length - 1 && <br />}
          </span>
        ));
      });
      
      return <p key={pIndex} className="mb-3">{renderedParts}</p>;
    });
  };
  
  return (
    <div className={className}>
      {renderMarkdown(content)}
    </div>
  );
}