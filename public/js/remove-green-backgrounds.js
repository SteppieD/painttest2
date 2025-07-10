// Remove all green backgrounds from links
document.addEventListener('DOMContentLoaded', function() {
  // Function to remove green backgrounds
  function removeGreenBackgrounds() {
    // Get all links
    const allLinks = document.querySelectorAll('a');
    
    allLinks.forEach(link => {
      // Get computed style
      const computedStyle = window.getComputedStyle(link);
      const bgColor = computedStyle.backgroundColor;
      
      // Check if background is green (rgb(22, 163, 74) or similar)
      if (bgColor.includes('22') && bgColor.includes('163') && bgColor.includes('74') ||
          bgColor.includes('34') && bgColor.includes('197') && bgColor.includes('94') ||
          bgColor.includes('16') && bgColor.includes('185') && bgColor.includes('129') ||
          bgColor.includes('green')) {
        
        // Remove background
        link.style.backgroundColor = 'transparent';
        link.style.background = 'transparent';
        link.style.backgroundImage = 'none';
      }
      
      // Also check for inline styles
      if (link.style.backgroundColor || link.style.background) {
        const bg = link.style.backgroundColor || link.style.background;
        if (bg.includes('22') && bg.includes('163') && bg.includes('74') ||
            bg.includes('34') && bg.includes('197') && bg.includes('94') ||
            bg.includes('green')) {
          link.style.backgroundColor = 'transparent';
          link.style.background = 'transparent';
          link.style.backgroundImage = 'none';
        }
      }
    });
    
    // Also check all elements that might have green backgrounds
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const bgColor = window.getComputedStyle(el).backgroundColor;
      
      // If element has a link inside and has green background, remove it
      if (el.querySelector('a') && 
          (bgColor.includes('22') && bgColor.includes('163') && bgColor.includes('74') ||
           bgColor.includes('34') && bgColor.includes('197') && bgColor.includes('94'))) {
        el.style.backgroundColor = 'transparent';
        el.style.background = 'transparent';
      }
    });
  }
  
  // Run immediately
  removeGreenBackgrounds();
  
  // Run again after a short delay to catch any dynamically added content
  setTimeout(removeGreenBackgrounds, 100);
  setTimeout(removeGreenBackgrounds, 500);
  setTimeout(removeGreenBackgrounds, 1000);
  
  // Watch for changes and remove green backgrounds
  const observer = new MutationObserver(removeGreenBackgrounds);
  observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
});