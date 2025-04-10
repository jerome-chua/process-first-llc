# Process First LLC - Process Analysis Tool

## Project Structure
```
.
├── backend/               # FastAPI backend
│   ├── app/               # Application code
│   │   ├── api/           # API routes
│   │   ├── models/        # Data models
│   │   └── services/      # Business logic services
│   ├── data/              # Sample data
│   ├── output/            # Generated reports and charts
│   ├── main.py            # Application entry point
│   └── requirements.txt   # Python dependencies
└── frontend/              # Frontend application
```

## Development
### Prerequisites
- Python 3.8+
- OpenAI API key (for AI-generated summaries)
- Node.js and npm (for frontend development)

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
OPENAI_API_KEY=your_openai_api_key
```

## Backend

### Getting Started
1. Install the latest version of Python with `brew install python` (install Brew if you haven't already)
2. Create virtual env in `backend` folder with `python3 -m venv venv`
3. Activate venv with `. venv/bin/activate`
4. Install packages with `pip3 install -r requirements.txt`
5. Run `python3 main.py` to run the backend
6. Enter the following in a browser: `http://localhost:8000/docs` to see APIs

### API Routes
The backend provides the following API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/process-data` | GET | Returns the full process data |
| `/api/top-impact` | GET | Returns top impact variables affecting the KPI |
| `/api/scenarios` | GET | Returns all scenarios with their KPI values |
| `/api/setpoint-impacts` | GET | Returns setpoint impact summary |
| `/api/generate-report` | GET | Generates a PDF report from the data |
| `/api/download-report` | GET | Downloads the generated PDF report |

### API Documentation

When the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`

### Keeping Packages Updated
If you install any new packages, run `pip freeze > requirements.txt` to save the latest packages before committing, so others can easily install them.

---

## Frontend
### Getting Started
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. To start the application, run `npm run dev`
4. Access the appplication at: `http://localhost:5174/`
5. Ensure the backend server is running before using the application

### Test Cases for Task 1 & 2 - Table & Canvas
- Node Creation
[x] When user adds node(s), pagination table should take things into consideration
[x] When user adds node, the ID should be unique
- Node Deletion
[x] Users should be able to delete nodes
[x] Deleting a node on Table row should result in it being deleted on Canvas
[x] Deleting a node that has edges connected should result in the edge being deleted as well 
- Node Modification
[x] Editing a node's name should be reflected on Canvas & Table
[x] Edited node properties should be saved correctly
[x] Users should be able to change node types
- Edge Creation
[x] Edge creation should not be possible if fewer than 2 nodes exist
[x] Dropdown/upstream options should reflect all available nodes from the Node table
[x] New edges should appear in the edge table with correct endpoint nodes
- Edge Modification
[x] Users should be able to modify edge endpoints (change upstream/downstream nodes)
[x] Changes to edges should be reflected in the table
- Edge Deletion
[x] Users should be able to delete edges
[x] Deleted edges should be removed from both the table & canvas visualization

---
