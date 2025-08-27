// Performance optimization for parallel chunk loading
(function() {
    'use strict';
    
    // Override the default script loading to enable parallel requests
    const originalLoadScript = window.loadScript || function(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = callback;
        document.head.appendChild(script);
    };
    
    // Batch load scripts in parallel groups
    window.loadScriptsBatch = function(urls, callback) {
        if (!urls || urls.length === 0) {
            if (callback) callback();
            return;
        }
        
        const batchSize = 6; // Load 6 scripts at a time
        let loadedCount = 0;
        const totalCount = urls.length;
        let hasError = false;
        
        function onScriptLoad() {
            loadedCount++;
            if (loadedCount >= totalCount && callback && !hasError) {
                callback();
            }
        }
        
        function onScriptError() {
            if (!hasError) {
                hasError = true;
                if (callback) callback(new Error('Script loading failed'));
            }
        }
        
        // Load scripts in batches
        for (let i = 0; i < urls.length; i += batchSize) {
            const batch = urls.slice(i, i + batchSize);
            
            // Small delay between batches to prevent overwhelming
            setTimeout(() => {
                batch.forEach(url => {
                    const script = document.createElement('script');
                    script.src = url;
                    script.onload = onScriptLoad;
                    script.onerror = onScriptError;
                    script.async = true;
                    document.head.appendChild(script);
                });
            }, Math.floor(i / batchSize) * 50);
        }
    };
    
    // Optimize image loading
    window.optimizeImageLoading = function() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    };
    
    // Run optimizations when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.optimizeImageLoading);
    } else {
        window.optimizeImageLoading();
    }
    
})();