# Portfolio Website

A modern, responsive portfolio website for a Frontend Developer & UI Designer, featuring a multi-section layout with
animations, dark/light theme support, and multilingual capabilities.

## Features

- Responsive design for all screen sizes
- Dark/light theme toggle with smooth transitions
- Multi-language support (English and Persian)
- Modern animations and transitions
- Interactive portfolio gallery with lightbox
- Skills showcase section with animated icons
- Design process timeline
- Testimonial slider
- Modular CSS and JavaScript architecture

## File Structure

```
portfolio-website/
├── css/                  # CSS files
│   ├── main.css          # Main CSS file importing all others
│   ├── variables.css     # CSS variables and custom properties
│   ├── layout.css        # Overall layout structure
│   ├── header.css        # Header styles
│   └── ...               # Other CSS modules
├── js/                   # JavaScript files
│   ├── main.js           # Main JavaScript functionality
│   ├── portfolio.js      # Portfolio functionality
│   ├── language.js       # Language switching
│   └── ...               # Other JS modules
├── images/               # Image assets
│   ├── hero/             # Hero section images
│   ├── portfolio/        # Portfolio project images
│   └── icons/            # Skill and UI icons
├── fonts/                # Custom fonts (if any)
└── index.html            # Main HTML file
```

## Development

For detailed information on the CSS organization, refer to [CSS Structure](css/readme.md).

## Browser Support

This site is optimized for modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- CSS is modularized and prioritized (critical CSS first)
- Images use WebP format for better compression
- JavaScript is deferred to avoid blocking page rendering
- Intersection Observer API for lazy loading animations