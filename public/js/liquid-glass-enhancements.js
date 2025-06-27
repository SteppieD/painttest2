/**
 * Apple Liquid Glass Dynamic Enhancement Script
 * Based on Apple Human Interface Guidelines 2025
 * Implements real-time mouse tracking and specular highlights
 */

(function() {
  'use strict';

  // Apple-style mouse tracking for specular highlights
  function initializeLiquidGlassTracking() {
    const interactiveElements = document.querySelectorAll('.liquid-glass-interactive');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Update CSS custom properties for real-time highlight positioning
        element.style.setProperty('--mouse-x', `${x}%`);
        element.style.setProperty('--mouse-y', `${y}%`);
      });
      
      element.addEventListener('mouseleave', () => {
        // Reset to center when mouse leaves
        element.style.setProperty('--mouse-x', '50%');
        element.style.setProperty('--mouse-y', '50%');
      });
    });
  }

  // Apple's intelligent environment adaptation
  function applyIntelligentAdaptation() {
    const root = document.documentElement;
    
    // Check system preferences and adapt accordingly
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isReducedTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
    
    // Apply adaptive blur based on environment
    if (isDarkMode) {
      root.style.setProperty('--adaptive-blur-strength', '24px');
      root.style.setProperty('--adaptive-saturation', '160%');
      root.style.setProperty('--adaptive-brightness', '90%');
    } else {
      root.style.setProperty('--adaptive-blur-strength', '20px');
      root.style.setProperty('--adaptive-saturation', '180%');
      root.style.setProperty('--adaptive-brightness', '100%');
    }
    
    // Enhance for high contrast mode
    if (isHighContrast) {
      root.style.setProperty('--adaptive-blur-strength', '2px');
    }
    
    // Respect reduced motion preference
    if (isReducedMotion) {
      root.style.setProperty('--adaptive-blur-strength', '8px');
      // Disable shimmer animations
      const shimmerElements = document.querySelectorAll('.liquid-glass-card');
      shimmerElements.forEach(el => {
        el.style.animation = 'none';
      });
    }
    
    // Apple's reduce transparency accessibility
    if (isReducedTransparency) {
      root.style.setProperty('--adaptive-blur-strength', '0px');
      root.style.setProperty('--glass-opacity-medium', 'rgba(255, 255, 255, 0.95)');
    }
  }

  // Enhanced touch support for iOS-style interactions
  function initializeTouchEnhancements() {
    const glassElements = document.querySelectorAll('.liquid-glass-card, .liquid-glass-button');
    
    glassElements.forEach(element => {
      // iOS-style touch feedback
      element.addEventListener('touchstart', (e) => {
        element.style.setProperty('--touch-feedback', '1');
        element.style.transform = 'scale(0.98)';
      }, { passive: true });
      
      element.addEventListener('touchend', (e) => {
        element.style.setProperty('--touch-feedback', '0');
        element.style.transform = '';
      }, { passive: true });
      
      element.addEventListener('touchcancel', (e) => {
        element.style.setProperty('--touch-feedback', '0');
        element.style.transform = '';
      }, { passive: true });
    });
  }

  // Apple's performance optimization for glass effects
  function optimizePerformance() {
    // Use Intersection Observer to only animate visible elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.willChange = 'transform, background, filter';
        } else {
          entry.target.style.willChange = 'auto';
        }
      });
    });
    
    document.querySelectorAll('.liquid-glass-card, .liquid-glass-button, .liquid-glass-panel').forEach(el => {
      observer.observe(el);
    });
  }

  // Initialize all enhancements when DOM is ready
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
      return;
    }
    
    initializeLiquidGlassTracking();
    applyIntelligentAdaptation();
    initializeTouchEnhancements();
    optimizePerformance();
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyIntelligentAdaptation);
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', applyIntelligentAdaptation);
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', applyIntelligentAdaptation);
    window.matchMedia('(prefers-reduced-transparency: reduce)').addEventListener('change', applyIntelligentAdaptation);
    
    console.log('🍎 Apple Liquid Glass system initialized with HIG 2025 compliance');
  }

  // Auto-initialize
  initialize();
})();