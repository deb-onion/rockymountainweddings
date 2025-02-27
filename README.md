# Rocky Mountain Weddings Website

## Dynamic Media Management System

This website uses a dynamic media management system that allows for easy updating of images and videos without modifying the code. The system automatically detects the correct folders for media files based on their context and page location.

### Directory Structure

Media files are organized in the following structure:

```
src/
├── assets/
│   ├── images/
│   │   ├── homepage-hero/       # Homepage hero section images
│   │   ├── homepage-featured/   # Homepage featured sections
│   │   ├── services-intro/      # Services page intro section
│   │   ├── case-studies/        # Case studies section
│   │   ├── venues-intro/        # Venues page intro images
│   │   ├── venues-regions/      # Venue region selection images
│   │   ├── venues-details/      # Detailed venue images
│   │   ├── portfolio/           # Portfolio images
│   │   ├── testimonials/        # Testimonial photos
│   │   ├── team/                # Team member photos
│   │   ├── about/               # About page images
│   │   └── icons/               # Icon images
│   │
│   ├── videos/
│   │   ├── homepage-hero/       # Homepage hero video content
│   │   └── testimonials/        # Testimonial videos
│   │
│   ├── update-check.json        # Timestamp file for detecting updates
│   ├── media-updates.log        # Log of all media updates
│   └── update-media-timestamp.js # Update script for the timestamp file
```

### How to Update Media

1. To update an image or video, simply replace the file in the corresponding folder
2. The website will automatically use the new file without any code changes
3. All updates are automatically logged in `src/assets/media-updates.log`

### Development Setup

To run the website with live updates during development:

1. Make sure Node.js is installed on your system
2. Install dependencies with `npm install`
3. Run the development server with either:
   - `npm run dev` (using npm script)
   - `dev-server.bat` (using batch file)

This will start both the file watcher and a local server with logging capabilities.

### Manual Control

You can also use the JavaScript API for manual control:

```javascript
// Refresh all media paths
window.mediaManager.refresh();

// Get the path for a specific file
const path = window.mediaManager.getMediaPath('image.jpg', 'images', 'homepage-hero');
```

### Update Log

All media updates are automatically logged in `src/assets/media-updates.log`. This includes:

- Backend file changes detected by the file watcher
- Frontend dynamic path updates
- Timestamp of each change
- Path of the changed files

The log provides a comprehensive history of all media updates for auditing and tracking purposes. 