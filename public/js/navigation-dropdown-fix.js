// Navigation Dropdown Fix
// Ensures dropdown menus work properly on hover

document.addEventListener('DOMContentLoaded', function() {
  // Fix dropdown functionality
  const dropdownGroups = document.querySelectorAll('.group');
  
  dropdownGroups.forEach(group => {
    const button = group.querySelector('button');
    const dropdown = group.querySelector('.absolute');
    
    if (button && dropdown) {
      // Remove hidden class by default
      dropdown.classList.remove('hidden');
      dropdown.style.display = 'none';
      
      // Show on hover
      group.addEventListener('mouseenter', () => {
        dropdown.style.display = 'block';
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0)';
      });
      
      // Hide on leave
      group.addEventListener('mouseleave', () => {
        dropdown.style.display = 'none';
      });
      
      // Also handle click for mobile
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
      });
    }
  });
  
  // Fix "Watch Demo" button specifically
  const watchDemoButtons = document.querySelectorAll('a[href="/demo"]');
  watchDemoButtons.forEach(btn => {
    // Force correct styles
    if (btn.classList.contains('bg-white')) {
      btn.style.backgroundColor = '#ffffff';
      btn.style.color = '#1f2937';
      btn.style.border = '2px solid #d1d5db';
    }
  });
  
  // Remove any pink colors that might have slipped through
  const allElements = document.querySelectorAll('*');
  allElements.forEach(el => {
    const bgColor = window.getComputedStyle(el).backgroundColor;
    const color = window.getComputedStyle(el).color;
    
    // Check for pink colors
    if (bgColor === 'rgb(239, 43, 112)' || bgColor === 'rgb(217, 30, 90)') {
      el.style.backgroundColor = '#1e3a8a'; // Navy
      if (color === 'rgb(255, 255, 255)') {
        el.style.color = '#ffffff';
      }
    }
    
    if (color === 'rgb(239, 43, 112)') {
      el.style.color = '#1e3a8a'; // Navy
    }
  });
});