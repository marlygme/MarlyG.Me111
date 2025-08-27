
var RM = window.RM = window.RM || {};

window.RM.config = {
  root: "/",
  pushState: true,
  baseURL: window.location.origin,
  publicPath: "/"
}

window.chunkURL = "/dist/";

// Fix for image paths in SPA routing
window.RM.imageBaseURL = "/img/";
window.RM.videoBaseURL = "/videos/";

// Firebase configuration for radio player
window.firebaseConfig = {
  apiKey: typeof FIREBASE_API_KEY !== 'undefined' ? FIREBASE_API_KEY : "AIzaSyCEld9NHZArU4O0R4Mo_K5uJ6WiPVBTbp8",
  authDomain: typeof FIREBASE_AUTH_DOMAIN !== 'undefined' ? FIREBASE_AUTH_DOMAIN : "marlyg-5214402.firebaseapp.com",
  projectId: typeof FIREBASE_PROJECT_ID !== 'undefined' ? FIREBASE_PROJECT_ID : "marlyg-5214402",
  storageBucket: typeof FIREBASE_STORAGE_BUCKET !== 'undefined' ? FIREBASE_STORAGE_BUCKET : "marlyg-5214402.appspot.com",
  messagingSenderId: typeof FIREBASE_MESSAGING_SENDER_ID !== 'undefined' ? FIREBASE_MESSAGING_SENDER_ID : "123456789",
  appId: typeof FIREBASE_APP_ID !== 'undefined' ? FIREBASE_APP_ID : "1:123456789:web:abcdef123456"
};
