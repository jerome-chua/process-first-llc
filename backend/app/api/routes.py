from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import json
import os
from dotenv import load_dotenv
from app.services.process_data import (
    get_data, 
    get_top_impact_variables,
    get_scenarios,
    get_setpoint_impacts,
    get_top_scenarios_temperatures
)
from app.services.data_processor import DataProcessor
from app.services.chart_generator import ChartGenerator
from app.services.report_generator import ReportGenerator
from app.services.pdf_service import PDFService

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("WARNING: OPENAI_API_KEY not found in environment variables")

router = APIRouter()

OUTPUT_DIR = "./output"
os.makedirs(OUTPUT_DIR, exist_ok=True)
PDF_PATH = os.path.join(OUTPUT_DIR, "process_analysis_report.pdf")
CHARTS_DIR = os.path.join(OUTPUT_DIR, "charts")
os.makedirs(CHARTS_DIR, exist_ok=True)

# Task 4
@router.get("/process-data")
async def process_data():
    """Return the full process data."""
    try:
        return get_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving process data: {str(e)}")

@router.get("/top-impact")
async def top_impact():
    """Return top impact variables."""
    try:
        return get_top_impact_variables()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving top impact: {str(e)}")

@router.get("/scenarios")
async def scenarios():
    """Return all scenarios with their KPI values."""
    try:
        return get_scenarios()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving scenarios: {str(e)}")

@router.get("/top-scenarios-temperatures")
async def top_scenarios_temperatures():
    """Return only temperature values from top performing scenarios."""
    try:
        return get_top_scenarios_temperatures()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving top scenarios temperatures: {str(e)}")

@router.get("/setpoint-impacts")
async def setpoint_impacts():
    """Return setpoint impact summary."""
    try:
        return get_setpoint_impacts()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving setpoint impacts: {str(e)}")

# Task 3
@router.get("/generate-report")
async def generate_report():
    """
    Generate a PDF report from uploaded JSON data
    """
    data_file_path = "./data/mock_results.json"

    try:
        # Validate that the data file exists
        if not os.path.exists(data_file_path):
            raise HTTPException(
                status_code=404, 
                detail=f"Data file not found at {data_file_path}. Please upload data first."
            )
            
        # Load the JSON data
        with open(data_file_path, "r") as file:
            json_data = json.load(file)
        
        # Process the data
        data_processor = DataProcessor(json_data)
        processed_data = data_processor.process_all()
        
        # Generate charts
        chart_generator = ChartGenerator(processed_data)
        chart_paths = chart_generator.save_charts_to_files(directory=CHARTS_DIR)
        
        # Generate report content using LLM
        report_generator = ReportGenerator(processed_data, api_key=api_key)
        report_content = report_generator.get_report_content()
        
        # Generate the PDF report
        pdf_service = PDFService(report_content, chart_paths, processed_data)
        pdf_service.generate_pdf(output_path=PDF_PATH)
        
        return {"message": "Report generated successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")

PDF_PATH = "./output/process_analysis_report.pdf"
@router.get("/download-report")
async def download_report():
    """
    Download the generated PDF report
    """
    try:
        if not os.path.exists(PDF_PATH):
            raise HTTPException(
                status_code=404,
                detail="Report not found. Please generate the report first."
            )
        
        return FileResponse(
            path=PDF_PATH,
            filename="process_analysis_report.pdf",
            media_type="application/pdf"
        )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Error downloading report: {str(e)}")