# Overview

This is a personal portfolio website for MarlyG, built as a Single Page Application (SPA) using Readymag as the primary design platform. The site showcases various creative works including graphic design, web design, and projects. The architecture is designed to serve all content through a single entry point while maintaining URL structure for different sections like about, projects, FAQ, and portfolio categories.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Single Page Application (SPA)**: All content is served through `index.html` to provide a seamless user experience without page reloads
- **Readymag Integration**: The main content is generated and managed through Readymag, a visual web design platform
- **URL Structure Preservation**: Legacy HTML files in the `snippets/` directory are maintained as empty placeholders to preserve URL structure and SEO while redirecting all traffic to the main SPA
- **Client-Side Routing**: Navigation between sections (about, projects, graphic design, web design, FAQ) is handled client-side

## Error Handling
- **Custom 404 Page**: `sorry.html` provides a branded error page with consistent styling and navigation back to the main site
- **Graceful Fallbacks**: Empty snippet files ensure broken links don't result in server errors

## Styling Approach
- **System Fonts**: Uses native system font stacks for optimal performance and consistency across platforms
- **Minimal CSS**: Lightweight, custom CSS for error pages without external dependencies
- **Responsive Design**: Mobile-first approach with viewport meta tags and flexible layouts

## SEO and Discoverability
- **Robots.txt Configuration**: Allows all search engine crawlers with sitemap reference
- **Sitemap Integration**: Points to `https://marlyg.me/sitemap.xml` for search engine indexing
- **Semantic HTML**: Proper document structure with appropriate meta tags

# External Dependencies

## Third-Party Platforms
- **Readymag**: Primary content management and design platform that generates the main website content
- **Search Engines**: Google and other crawlers supported through robots.txt and sitemap configuration

## Hosting Requirements
- **Static File Hosting**: Requires a web server capable of serving HTML, CSS, and handling URL routing
- **Custom Error Pages**: Server should be configured to serve `sorry.html` for 404 errors
- **HTTPS Support**: Domain uses HTTPS as evidenced by the sitemap URL structure