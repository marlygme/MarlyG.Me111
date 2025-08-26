
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
