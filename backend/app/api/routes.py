from fastapi import APIRouter, HTTPException
from app.services.process_data import (
    get_data, 
    get_top_impact_variables,
    get_scenarios,
    get_setpoint_impacts
)

router = APIRouter()

@router.get("/process-data")
async def process_data():
    """Return the full process data."""
    try:
        return get_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving process data: {str(e)}")

@router.get("/top-impacts")
async def top_impacts():
    """Return top impact variables."""
    try:
        return get_top_impact_variables()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving top impacts: {str(e)}")

@router.get("/scenarios")
async def scenarios():
    """Return all scenarios with their KPI values."""
    try:
        return get_scenarios()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving scenarios: {str(e)}")

@router.get("/setpoint-impacts")
async def setpoint_impacts():
    """Return setpoint impact summary."""
    try:
        return get_setpoint_impacts()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving setpoint impacts: {str(e)}")