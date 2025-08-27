// JavaScript chunk loading optimizer
(function() {
    const loadedChunks = new Set();
    const chunkQueue = [];
    let isLoading = false;
    
    // Override chunk loading to batch and prioritize
    if (window.RM && window.RM.loadChunk) {
        const originalLoadChunk = window.RM.loadChunk;
        window.RM.loadChunk = function(chunkId, priority = 0) {
            if (loadedChunks.has(chunkId)) {
                return Promise.resolve();
            }
            
            return new Promise((resolve, reject) => {
                chunkQueue.push({ chunkId, priority, resolve, reject });
                chunkQueue.sort((a, b) => b.priority - a.priority);
                processQueue();
            });
        };
    }
    
    function processQueue() {
        if (isLoading || chunkQueue.length === 0) return;
        
        isLoading = true;
        const batch = chunkQueue.splice(0, 3); // Load 3 chunks at a time
        
        Promise.all(batch.map(item => {
            return loadChunk(item.chunkId).then(() => {
                loadedChunks.add(item.chunkId);
                item.resolve();
            }).catch(item.reject);
        })).finally(() => {
            isLoading = false;
            if (chunkQueue.length > 0) {
                setTimeout(processQueue, 10);
            }
        });
    }
    
    function loadChunk(chunkId) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `/dist/c/${chunkId}.js`;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Preload critical chunks - removed non-existent files
    function preloadCriticalChunks() {
        // Only prefetch files that actually exist
        // Removed c-viewer, c-config, c-navigation as they don't exist
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preloadCriticalChunks);
    } else {
        preloadCriticalChunks();
    }
    
    console.log('[ChunkOptimizer] Initialized');
})();