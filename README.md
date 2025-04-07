# Chat TOC Bookmarklet

A JavaScript bookmarklet that adds a Table of Contents panel to AI chat interfaces like ChatGPT and Grok, making it easier to navigate through long conversations.

## Features

- 📋 Creates a collapsible Table of Contents panel for AI chat interfaces
- 🔄 Works with both ChatGPT and Grok chat formats
- 📱 Responsive design with a collapsible sidebar
- 🌙 Dark mode support
- 🔍 Highlights sections when clicked for better visibility
- 📌 Persists across page refreshes
- 🔽 Collapsible sections with expand/collapse all functionality
- 📑 Support for navigating headings (H3, H4) and lists
- 💾 Small file size after minification

## Quick Start Guide

### Installation (One-Time Setup)

1. Create a new bookmark in your browser:
   - **Chrome/Edge**: Click ⋮ (menu) → Bookmarks → Bookmark Manager → Right-click empty space → Add new bookmark
   - **Firefox**: Click ☰ (menu) → Bookmarks → Manage Bookmarks → Right-click → New Bookmark
   - **Safari**: Bookmarks menu → Add Bookmark → Edit URL field

2. In the bookmark dialog:
   - **Name**: "Chat TOC" (or whatever you prefer)
   - **URL/Address**: Paste the entire contents of `TOC-min.js`
   - Click Save

### Using the TOC

1. Go to ChatGPT (chat.openai.com) or Grok
2. Click your "Chat TOC" bookmark
3. A TOC panel will appear on the right side
4. Click any section to navigate to it
5. Use +/- icons to collapse/expand sections
6. Click the "TOC" tab on the edge to hide/show the panel

## Alternative Installation Methods

### Option 1: Bookmarklet (Recommended)

1. Create a new bookmark in your browser
2. Name it something like "Chat TOC"
3. Copy the entire contents of `TOC-min.js` file
4. Paste it into the URL/Address field of the bookmark
5. Save the bookmark

### Option 2: Browser Console

1. Open your browser's developer console (F12 or Ctrl+Shift+I)
2. Copy the contents of `TOC.js` (or `TOC-min.js`)
3. Paste it into the console and press Enter

## Visual Example

```
Chat Window                        TOC Panel
+------------------------+        +-----------------+
| User:                  |        | Conversation TOC|
| How to make pasta?     |        | + -             |
|                        |        +-----------------+
| ChatGPT/Grok:          |        | - Turn 1 (You)  |
| Making pasta involves  |        | - Turn 2 (AI)   |
| these basic steps:     |        |   - Intro       |
|                        |        |   - Basic Steps |
| ## Basic Steps         |        |     - Boil water|
| 1. **Boil water**      |        |     - Add pasta |
| 2. **Add pasta**       |        |     - Cook time |
| 3. **Cook time**       |        |   - Tips        |
| 4. **Drain**           |        |     - Salt water|
|                        |        |     - Stir often|
| ## Tips                |        | - Turn 3 (You)  |
| - **Salt water**       |        |                 |
| - **Stir often**       |        |                 |
+------------------------+        +-----------------+
```

## Features In Detail

### Navigation

- **Section Highlighting**: When you click on a section in the TOC, it will be highlighted briefly for easy identification
- **Collapsible Sections**: Each section can be collapsed independently
- **Expand/Collapse All**: Buttons at the top to expand or collapse all sections at once

### Supported Elements

- **H3 Headings**: Main section titles in AI responses
- **H4 Headings**: Subsection titles
- **Ordered Lists**: Nested list items under headings
- **Strong Text**: Bold text elements that serve as important points

### User Interface

- **TOC Panel**: Fixed sidebar on the right with scrollable contents
- **TOC Handle**: Vertical tab to collapse/expand the entire panel
- **Dark Mode**: Automatically adjusts to browser dark mode settings

## Development

This project includes the following main files:

1. `TOC.js` - The full, unminified source code with comments
2. `TOC-min.js` - The minified version for use as a bookmarklet
3. `minify-toc.js` - Node.js script to minify the code

### Minification Process

The project includes a Node.js script (`minify-toc.js`) that handles minification while preserving the critical `javascript:` prefix required for bookmarklets:

1. Make sure you have Node.js installed
2. Install dependencies: `npm install`
3. Run the minification script: `npm run minify`

#### How the Minification Works

The minification script:

1. Preserves the `javascript:` prefix needed for bookmarklets
2. Uses Terser for high-quality JavaScript minification with optimal settings:
   - Multiple optimization passes
   - Unsafe optimizations for smaller output
   - Property mangling for minimized size
   - Comment removal and whitespace optimization
3. Implements additional custom optimizations to further reduce size
4. Reports compression statistics when done

## Technical Notes

- The script injects a styled panel into the page
- It observes DOM changes to update the TOC as the conversation progresses
- Works with both ChatGPT and Grok response formats
- The script distinguishes between user messages and AI responses
- No data is sent to external servers - everything happens locally in your browser
- The bookmarklet's size is optimized for maximum compression

## Notes and Limitations

- This tool does not currently display or navigate edits
- Works with Dark mode automatically (detects system preferences)
- Each section can be collapsed independently
- The entire TOC panel can be collapsed using the vertical handle
- Compatible with both ChatGPT and Grok AI chat interfaces
- No external dependencies - runs completely in the browser

## Inspiration

This bookmarklet is inspired by the work of [Brostoffed on GitHub](https://gist.github.com/Brostoffed/cbe33856cb1beb5f1c3852b9b5625204), with enhancements for compatibility with multiple AI platforms and improved usability features.

## License
MIT