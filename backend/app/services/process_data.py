import json
import os
from pathlib import Path
from app.core.config import DATA_DIR
from app.models.schemas import ProcessResponse

def get_data() -> ProcessResponse:
    json_path = os.path.join(DATA_DIR, "mock_results.json")
    with open(json_path, "r") as f:
        data = json.load(f)
    return ProcessResponse(**data)

def get_top_impact_variables():
    data = get_data()
    cleaned_impact = {}
    key_mapping = {
        "HEX-100.cold_fluid_temperature": "HEX-100 - Cold Fluid Temperature",
        "Fuel.temperature": "Fuel Temperature",
        "Air.temperature": "Air Temperature",
        "Others": "Others"
    }
    for old_key, new_key in key_mapping.items():
        if old_key in data.data.top_impact:
            cleaned_impact[new_key] = data.data.top_impact[old_key]
    return {
        "top_summary_text": data.data.top_summary_text,
        "top_impact": cleaned_impact
    }

def get_scenarios():
    data = get_data()
    scenarios = data.data.simulated_summary["simulated_data"]
    
    # Simplify data for charting
    result = []
    for scenario in scenarios:
        result.append({
            "scenario": scenario.scenario,
            "kpi_value": scenario.kpi_value
        })
    
    return result

def get_setpoint_impacts():
    data = get_data()
    return data.data.setpoint_impact_summary