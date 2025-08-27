// Firebase initialization for radio player
(function() {
    // Wait for Firebase to be available
    function initFirebase() {
        if (typeof firebase === 'undefined') {
            // Load Firebase SDK if not already loaded
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js';
            script.onload = function() {
                const authScript = document.createElement('script');
                authScript.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js';
                authScript.onload = function() {
                    const dbScript = document.createElement('script');
                    dbScript.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js';
                    dbScript.onload = function() {
                        setupFirebase();
                    };
                    document.head.appendChild(dbScript);
                };
                document.head.appendChild(authScript);
            };
            document.head.appendChild(script);
        } else {
            setupFirebase();
        }
    }

    function setupFirebase() {
        // Use window.firebaseConfig which is loaded from env-config.js
        if (!window.firebaseConfig) {
            console.error('[Firebase] Configuration not found! Waiting...');
            setTimeout(setupFirebase, 100);
            return;
        }

        const firebaseConfig = window.firebaseConfig;

        // Initialize Firebase if not already initialized
        if (!firebase.apps.length) {
            try {
                firebase.initializeApp(firebaseConfig);
                console.log('[Firebase] Initialized successfully with config:', firebaseConfig.projectId);
            } catch (error) {
                console.error('[Firebase] Initialization error:', error);
            }
        } else {
            console.log('[Firebase] Already initialized');
        }

        // Make Firebase globally available for radio player
        window.firebaseApp = firebase.app();
        window.firebaseAuth = firebase.auth();
        window.firebaseDatabase = firebase.database();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFirebase);
    } else {
        initFirebase();
    }
})();