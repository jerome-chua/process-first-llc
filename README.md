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
Create a `.env` file in the backend directory with the following variables:
```
OPENAI_API_KEY=your_openai_api_key
```

## Backend

### Getting Started
1. Install the latest version of Python with `brew install python` (install Brew if you haven't already)
2. Create virtual env in `backend` folder with `python3 -m venv venv`
3. Activate venv with `. venv/bin/activate`
4. Install packages with `pip3 install -r requirements.txt`
5. Create `.env` file with relevant API keys (can reference `.env.example`)
6. Run `python3 main.py` to run the backend
7. Enter the following in a browser: `http://localhost:8000/docs` to see APIs

### API Routes
The backend provides the following API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/process-data` | GET | Returns the full process data |
| `/api/top-impacts` | GET | Returns top impact variables affecting the KPI |
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
1. If on root, `cd frontend`, and run `npm install` to install node packages
2. To start the application, run `npm run dev`
3. Enter the following in a browser: `http://localhost:5174/`

---
