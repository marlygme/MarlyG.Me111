// Popup prevention module for Readymag export
(function() {
    'use strict';
    
    console.log('[PopupFix] Initializing popup prevention...');
    
    // Store original functions
    var originalOpen = window.open;
    var originalAddEventListener = EventTarget.prototype.addEventListener;
    
    // Track fixed elements
    var fixedElements = new WeakSet();
    
    // Override window.open globally
    window.open = function(url, target, features) {
        console.log('[PopupFix] Intercepted window.open:', url, target);
        
        // Force all internal links to same window
        if (url && (url.includes('marlyg.me') || url.startsWith('/') || !url.includes('://'))) {
            console.log('[PopupFix] Redirecting to same window');
            window.location.href = url;
            return window;
        }
        
        // External links open in same tab too
        return originalOpen.call(this, url, '_self', features);
    };
    
    // Override addEventListener to intercept click handlers
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'click' && this.tagName === 'A') {
            // Wrap the original listener
            var wrappedListener = function(e) {
                var link = e.currentTarget || e.target;
                if (link && link.tagName === 'A') {
                    link.removeAttribute('target');
                }
                // Call original listener
                return listener.call(this, e);
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // Fix individual link
    function fixLink(link) {
        if (!fixedElements.has(link)) {
            link.removeAttribute('target');
            
            // Override onclick if it exists
            var originalOnclick = link.onclick;
            link.onclick = function(e) {
                this.removeAttribute('target');
                if (originalOnclick) {
                    return originalOnclick.call(this, e);
                }
            };
            
            fixedElements.add(link);
        }
    }
    
    // Fix all links on page
    function fixAllLinks() {
        document.querySelectorAll('a').forEach(fixLink);
    }
    
    // Intercept all clicks
    function interceptClick(e) {
        var element = e.target;
        var attempts = 0;
        
        while (element && attempts < 10) {
            if (element.tagName === 'A') {
                element.removeAttribute('target');
                fixLink(element);
                
                // Handle navigation for internal links
                if (element.href && (element.href.includes('marlyg.me') || element.href.startsWith('/'))) {
                    if (!element.href.includes('#')) {
                        console.log('[PopupFix] Intercepting navigation:', element.href);
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        window.location.href = element.href;
                        return false;
                    }
                }
                break;
            }
            element = element.parentElement;
            attempts++;
        }
    }
    
    // Set up observers and listeners
    function initialize() {
        console.log('[PopupFix] Setting up observers...');
        
        // Initial fix
        fixAllLinks();
        
        // Intercept clicks at capture phase
        document.addEventListener('click', interceptClick, true);
        document.addEventListener('mousedown', interceptClick, true);
        document.addEventListener('touchstart', interceptClick, true);
        
        // Watch for DOM changes
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check added nodes
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'A') {
                            fixLink(node);
                        }
                        // Check descendants
                        if (node.querySelectorAll) {
                            node.querySelectorAll('a').forEach(fixLink);
                        }
                    }
                });
                
                // Check for target attribute changes
                if (mutation.type === 'attributes' && 
                    mutation.target.tagName === 'A' && 
                    mutation.attributeName === 'target') {
                    fixLink(mutation.target);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['target', 'href', 'onclick']
        });
        
        console.log('[PopupFix] Setup complete');
    }
    
    // Initialize based on document state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Additional initialization after load
    window.addEventListener('load', function() {
        setTimeout(fixAllLinks, 100);
        setTimeout(fixAllLinks, 500);
        setTimeout(fixAllLinks, 1000);
    });
    
    // Periodic check as failsafe
    setInterval(fixAllLinks, 3000);
    
    // Expose for debugging
    window.popupFix = {
        fixAllLinks: fixAllLinks,
        status: function() {
            var links = document.querySelectorAll('a');
            var withTarget = document.querySelectorAll('a[target]');
            console.log('[PopupFix] Total links:', links.length);
            console.log('[PopupFix] Links with target:', withTarget.length);
            return {
                total: links.length,
                withTarget: withTarget.length
            };
        }
    };
})();