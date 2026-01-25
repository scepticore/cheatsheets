# Cheatsheet creator

Create cheatsheets with Markdown.
Designed for allowed computer-written cheatsheets at school.
Optimized for A4 prints.

## MVP Features

- Multi-Column-Cheatsheet creator (1-5)
- Font-Size-Picking between 6Pt and 12Pt
- Live-Preview in Browser (like Overleaf)
- PDF-Export
- Run in Docker-Container

## Planned features
- Group-Working
- Image Upload (External sources via markdown should work)

# Services / Ports
| Service | Port  | Description |
|-|-------|-|
| Frontend | 5173  | Frontend for Cheatsheets |
| PDF-Generator | 3000  | PDF-Generator Service for live preview |
| Backend | 3030  | ExpressJS API for Backend Calls |
| MongoDB | 27017 | Database to store cheatsheets as objects with markdown |

# Example PDF (Screenshot)
- Font Size: 6pt
- Font: Arial
- 5 Columns
- Format: A4 Landscape

![Example Cheatsheet](/example/example.png)

# Notes
- MongoDB for Cheatsheets
- SQLite for User Data and Stuff

# Third party libraries:
- [Ace9 Editor](https://github.com/ajaxorg/ace-builds)
- [MarkedJS](https://marked.js.org/)

# Guides
- [MD Syntax](https://www.markdownguide.org/basic-syntax/)

# Dev notes
- [Multi-Column Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Multicol_layout)
