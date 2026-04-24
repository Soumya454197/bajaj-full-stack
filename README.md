
# BFHL - Node Hierarchy Explorer

A full-stack application that analyzes node hierarchies and detects cyclic relationships in tree structures. This project consists of a lightweight backend API built with Express.js and an interactive frontend interface for visualizing the analysis results.

## Overview

The BFHL Explorer helps you understand complex node relationships by parsing edge definitions, identifying valid tree hierarchies, detecting cycles, and providing detailed structural analysis. Perfect for graph analysis, tree validation, and hierarchy visualization.

## Features

- Parse and validate node relationships from text input
- Automatically detect and classify tree hierarchies
- Identify cyclic relationships in graph structures
- Calculate tree depth and structural metrics
- Highlight duplicate edges and invalid entries
- Clean, responsive web interface for interaction
- Full CORS support for cross-origin requests
- Detailed JSON response with all analytical results

## Project Structure

```
bajaj full stack/
├── index.html              # Frontend interface
└── srm-challenge/
    ├── index.js            # Backend server
    └── package.json        # Dependencies
```

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js
- Middleware: CORS for cross-origin support
- Data Format: JSON

## Installation

Navigate to the backend directory and install dependencies:

```bash
cd srm-challenge
npm install
```

This will install Express.js and CORS package.

## Running the Application

Start the backend server:

```bash
node index.js
```

The server will start on `http://localhost:3000`.

Then open `index.html` in your browser to access the frontend interface.

## How to Use

1. Open the application in your browser
2. Enter node relationships in the format: `A->B, A->C, B->D`
3. You can use commas or newlines to separate entries
4. Click Submit to analyze the relationships
5. View the results including valid trees, cycles, invalid entries, and detailed hierarchy information

## Input Format

Node relationships should follow this pattern:
- Single uppercase letters as node identifiers
- Arrow notation: `SOURCE->DESTINATION`
- Separate multiple entries with commas or newlines

Valid examples:
- `A->B`
- `X->Y, Y->Z`
- `P->Q` (on new line)

Invalid entries will be flagged and displayed separately.

## API Endpoint

The backend exposes a single endpoint:

**POST** `/bfhl`

Request body:
```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

Response structure:
```json
{
  "user_id": "string",
  "email_id": "string",
  "college_roll_number": "string",
  "hierarchies": [
    {
      "root": "A",
      "tree": { ... },
      "depth": 2,
      "has_cycle": false
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

## Algorithm Details

The application processes input through the following steps:

1. Validation: Filters entries matching the A->Z pattern and rejects self-loops
2. Deduplication: Removes duplicate edges while tracking them
3. Graph Construction: Builds adjacency list and tracks parent-child relationships
4. Root Detection: Identifies nodes with no incoming edges as roots
5. Cycle Detection: Uses DFS to identify cyclic relationships
6. Hierarchy Building: Constructs tree structures and calculates metrics

## Configuration

To customize the API URL, modify the value in the input field on the frontend. Default is set to `http://localhost:3000`.

To update user information in the API response, edit the following lines in `index.js`:
- Line: `user_id`
- Line: `email_id`
- Line: `college_roll_number`

## Features in Detail

### Hierarchy Analysis
Each valid tree is analyzed to determine its depth, root node, and complete structure. Cyclic relationships are identified separately and flagged for special attention.

### Duplicate Detection
The system tracks and reports duplicate edges, allowing you to identify redundant relationships in your input data.

### Invalid Entry Handling
Any entries that do not conform to the required format are collected and displayed, helping you validate your input.

## Browser Compatibility

The application works on all modern browsers that support:
- ES6 JavaScript
- Fetch API
- CSS Grid and Flexbox

## Notes

- The application uses CORS, allowing requests from any origin
- Large datasets may affect performance; optimal performance is achieved with up to a few hundred nodes
- All analysis is performed server-side for consistency

## Future Enhancements

- Export analysis results as CSV or JSON
- Support for more complex node naming schemes
- Visual graph rendering with interactive features
- Performance optimization for large datasets
- Additional algorithm options for hierarchy detection
