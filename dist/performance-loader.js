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
    
    // Advanced image optimization
    window.optimizeImageLoading = function() {
        // Preload critical images immediately
        const criticalImages = document.querySelectorAll('img');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before image is visible
        });
        
        // Progressive enhancement for all images
        criticalImages.forEach((img, index) => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            } else if (img.src && !img.complete) {
                // Preload first 5 images immediately
                if (index < 5) {
                    const preloadLink = document.createElement('link');
                    preloadLink.rel = 'preload';
                    preloadLink.as = 'image';
                    preloadLink.href = img.src;
                    document.head.appendChild(preloadLink);
                }
            }
        });
        
        // Add loading states
        criticalImages.forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                img.onload = function() {
                    this.style.opacity = '1';
                };
            }
        });
    };
    
    // Run optimizations when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.optimizeImageLoading);
    } else {
        window.optimizeImageLoading();
    }
    
})();