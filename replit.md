# EGCA European 2025 Goalball Tournament Website

## Overview

This is a static website for the EGCA European 2025 Goalball Tournament, built as a pure frontend application using HTML5, CSS3, and vanilla JavaScript. The site serves as an information hub for the tournament, providing details about teams, schedules, results, and organizational information. It's designed to be accessible, responsive, and inclusive, reflecting the values of adaptive sports.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Pure HTML5, CSS3, and vanilla JavaScript
- **Architecture Pattern**: Multi-page static website with shared components
- **Styling Approach**: CSS custom properties (CSS variables) for consistent theming
- **JavaScript Pattern**: Module-like organization with event-driven functionality

### File Structure
```
/
├── index.html          # Homepage with hero section and highlights
├── info.html           # Tournament information and mission
├── invitations.html    # Registration and invitation details
├── teams.html          # Team listings and profiles
├── results.html        # Tournament results and standings
├── members.html        # Organizing committee information
├── help.html           # Support, FAQs, and contact
├── styles.css          # Global stylesheet with CSS variables
├── script.js           # Main JavaScript functionality
└── server.py           # Simple Python HTTP server for development
```

### Design System
- **Color Scheme**: Orange-red primary (#e74c3c) with blue accents, reflecting tournament branding
- **Typography**: Inter font family for modern, accessible readability
- **Theming**: CSS custom properties enable consistent styling and dark mode support
- **Responsive Design**: Mobile-first approach with breakpoints for tablets and desktops

## Key Components

### Navigation System
- Fixed top navigation bar across all pages
- Mobile hamburger menu for smaller screens
- Active page highlighting
- Dark mode toggle integrated into navigation

### Theme System
- Light/dark mode toggle with localStorage persistence
- CSS custom properties for easy theme switching
- Smooth transitions between themes
- Consistent theming across all components

### Content Sections
- **Hero Section**: Gradient background with call-to-action buttons
- **Information Cards**: Reusable card components for highlights and details
- **Team Profiles**: Grid-based team display with filtering capabilities
- **Forms**: Contact and support forms with validation

### Interactive Features
- Dark mode toggle with theme persistence
- Mobile navigation menu
- FAQ accordion functionality
- Team filtering and search
- Smooth scroll animations
- Form validation and submission handling

## Data Flow

### Static Content Flow
1. HTML files contain structured content and semantic markup
2. CSS provides styling through cascading custom properties
3. JavaScript enhances interactivity and user experience
4. No backend data processing - all content is static

### User Interaction Flow
1. User navigates between pages via shared navigation
2. Theme preferences stored in browser localStorage
3. Interactive elements respond to user events (clicks, hovers, scrolls)
4. Form submissions handled client-side with validation

### State Management
- Theme state: localStorage for persistence across sessions
- Navigation state: Active page tracking and mobile menu toggle
- Form state: Client-side validation and user feedback
- Animation state: Intersection Observer for scroll-triggered animations

## External Dependencies

### CDN Resources
- **Google Fonts**: Inter font family for typography
- **Font Awesome**: Icon library for UI elements and navigation
- **Version**: Font Awesome 6.4.0 for modern icon support

### No Backend Dependencies
- No database connections required
- No server-side processing needed
- No third-party API integrations
- Fully self-contained static website

## Deployment Strategy

### Development Server
- **Python HTTP Server**: Simple server.py for local development
- **Port**: 5000 (configurable)
- **Features**: No-cache headers for development, static file serving

### Production Deployment Options
- **Static Hosting**: Compatible with GitHub Pages, Netlify, Vercel
- **CDN Deployment**: Can be served from any static file hosting service
- **Web Server**: Apache, Nginx, or any static file server

### Performance Considerations
- Minimal external dependencies (only fonts and icons from CDN)
- CSS custom properties reduce stylesheet complexity
- Vanilla JavaScript keeps bundle size minimal
- Images and assets can be optimized for web delivery

## Changelog

```
Changelog:
- June 27, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```