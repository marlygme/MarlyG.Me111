
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
  apiKey: "AIzaSyCEld9NHZArU4O0R4Mo_K5uJ6WiPVBTbp8",
  authDomain: "marlyg-5214402.firebaseapp.com",
  databaseURL: "https://marlyg-5214402-default-rtdb.firebaseio.com",
  projectId: "marlyg-5214402",
  storageBucket: "marlyg-5214402.appspot.com",
  messagingSenderId: "1077693372818",
  appId: "1:1077693372818:web:3a9b8c5d6e7f9a2b4c3d21"
};
