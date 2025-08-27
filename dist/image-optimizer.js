// Advanced image optimization with intersection observer
(function() {
    const imageCache = new Set();
    
    function optimizeImages() {
        // Create intersection observer with aggressive settings
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Handle different image source attributes
                    if (img.dataset.src && !imageCache.has(img.dataset.src)) {
                        imageCache.add(img.dataset.src);
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    } else if (img.getAttribute('data-lazy-src')) {
                        const lazySrc = img.getAttribute('data-lazy-src');
                        if (!imageCache.has(lazySrc)) {
                            imageCache.add(lazySrc);
                            img.src = lazySrc;
                            img.removeAttribute('data-lazy-src');
                        }
                    }
                    
                    // Handle background images
                    if (img.dataset.bg) {
                        img.style.backgroundImage = `url(${img.dataset.bg})`;
                        img.removeAttribute('data-bg');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px', // Start loading 200px before visible
            threshold: 0.01
        });

        // Optimize all images
        const allImages = document.querySelectorAll('img, [data-bg], [style*="background-image"]');
        let criticalCount = 0;
        
        allImages.forEach((element, index) => {
            // First 3 images load immediately
            if (index < 3 && element.tagName === 'IMG') {
                if (element.dataset.src) {
                    element.src = element.dataset.src;
                    element.removeAttribute('data-src');
                } else if (!element.complete && element.src) {
                    // Preload critical images
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = 'image';
                    link.href = element.src;
                    document.head.appendChild(link);
                }
                criticalCount++;
            } else {
                // Lazy load other images
                if (element.src && !element.dataset.src && element.tagName === 'IMG') {
                    element.dataset.src = element.src;
                    element.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
                }
                imageObserver.observe(element);
            }
            
            // Add loading animation
            if (element.tagName === 'IMG' && !element.complete) {
                element.style.opacity = '0';
                element.style.transition = 'opacity 0.3s ease-in-out';
                element.onload = function() {
                    this.style.opacity = '1';
                };
            }
        });

        // Handle dynamically added images
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.tagName === 'IMG') {
                            imageObserver.observe(node);
                        }
                        const imgs = node.querySelectorAll ? node.querySelectorAll('img') : [];
                        imgs.forEach(img => imageObserver.observe(img));
                    }
                });
            });
        });

        if (document.body) {
            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        console.log('[ImageOptimizer] Optimizing ' + allImages.length + ' images, ' + criticalCount + ' critical');
    }

    // Run optimization at different stages
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizeImages);
    } else {
        optimizeImages();
    }

    // Re-optimize after navigation changes
    window.addEventListener('popstate', () => setTimeout(optimizeImages, 100));
    window.addEventListener('hashchange', () => setTimeout(optimizeImages, 100));
    
    // Export for manual triggering
    window.optimizeImages = optimizeImages;
})();