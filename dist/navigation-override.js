// Navigation override for Tools popup issue
(function() {
    'use strict';
    
    // Override all navigation methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    // Track navigation
    history.pushState = function() {
        console.log('[Nav] pushState intercepted:', arguments[2]);
        return originalPushState.apply(history, arguments);
    };
    
    history.replaceState = function() {
        console.log('[Nav] replaceState intercepted:', arguments[2]);
        return originalReplaceState.apply(history, arguments);
    };
    
    // Force single-page behavior for Tools link
    function interceptToolsNavigation() {
        // Find all elements that might trigger Tools navigation
        const toolsElements = document.querySelectorAll('[href*="tools"], [data-link*="tools"], [onclick*="tools"]');
        
        toolsElements.forEach(function(element) {
            // Remove any onclick handlers
            element.onclick = null;
            element.removeAttribute('onclick');
            
            // Add new click handler
            element.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                console.log('[Nav] Tools click intercepted');
                
                // Navigate using pushState
                const url = '/tools';
                history.pushState({}, '', url);
                
                // Trigger Readymag's router
                window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
                
                // Force a hash change as backup
                window.location.hash = '#tools';
                
                return false;
            }, true);
        });
    }
    
    // Run on load and periodically
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', interceptToolsNavigation);
    } else {
        interceptToolsNavigation();
    }
    
    // Re-run after dynamic content loads
    const observer = new MutationObserver(function() {
        interceptToolsNavigation();
    });
    
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Periodic check
    setInterval(interceptToolsNavigation, 2000);
})();