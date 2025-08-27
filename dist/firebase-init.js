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
        // Use the hardcoded configuration since environment variables aren't available in browser
        const firebaseConfig = {
            apiKey: "AIzaSyCEld9NHZArU4O0R4Mo_K5uJ6WiPVBTbp8",
            authDomain: "marlyg-5214402.firebaseapp.com",
            databaseURL: "https://marlyg-5214402-default-rtdb.firebaseio.com",
            projectId: "marlyg-5214402",
            storageBucket: "marlyg-5214402.appspot.com",
            messagingSenderId: "1077693372818",
            appId: "1:1077693372818:web:3a9b8c5d6e7f9a2b4c3d21"
        };

        // Initialize Firebase if not already initialized
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('[Firebase] Initialized successfully');
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