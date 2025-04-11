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

def get_raw_data() -> dict:
    json_path = os.path.join(DATA_DIR, "mock_results.json")
    with open(json_path, "r") as f:
        data = json.load(f)
    return data

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
    data = get_raw_data()
    scenarios = data['data']['simulated_summary']['simulated_data']
    result = {
        "scenario": {},
        "kpi_value": {},
        "elements": {}
    }
    
    for idx, scenario in enumerate(scenarios):
        str_idx = str(idx)
        
        result["scenario"][str_idx] = scenario['scenario']
        
        result["kpi_value"][str_idx] = scenario['kpi_value']
        
        result["elements"][str_idx] = {
            "Condition": {},
            "Setpoint": {}
        }
        for equipment_spec in scenario['equipment_specification']:
            equipment = equipment_spec['equipment']
            
            for variable in equipment_spec['variables']:
                var_name = f"{equipment}.{variable['name']}"
                if var_name == "Fuel.Fuel - temperature":
                    var_name = "Fuel.temperature"
                
                if 'heat_transfer_coefficient' in variable['name']:
                    formatted_value = f"{variable['value']} W/m²·K"
                else:
                    formatted_value = f"{variable['value']}K"
                
                if variable['type'] == 'Condition':
                    result["elements"][str_idx]["Condition"][var_name] = formatted_value
                else:
                    result["elements"][str_idx]["Setpoint"][var_name] = formatted_value

    return result

def get_top_scenarios_temperatures():
    """
    Extract only the temperature values from the top performing scenarios.
    Returns a simplified data structure with just the temperature values.
    """
    data = get_raw_data()
    scenarios = data['data']['simulated_summary']['simulated_data']
    sorted_scenarios = sorted(scenarios, key=lambda x: x['kpi_value'], reverse=True)
    top_scenarios = sorted_scenarios[:5]
    
    result = {
        "top_scenarios": []
    }
    
    for scenario in top_scenarios:
        scenario_data = {
            "scenario": scenario['scenario'],
            "kpi_value": scenario['kpi_value'],
            "temperatures": {}
        }
        
        for equipment_spec in scenario['equipment_specification']:
            equipment = equipment_spec['equipment']
            
            for variable in equipment_spec['variables']:
                if 'temperature' in variable['name'].lower() and 'heat_transfer_coefficient' not in variable['name'].lower():
                    var_name = f"{equipment}.{variable['name']}"
                    if var_name == "Fuel.Fuel - temperature":
                        var_name = "Fuel.temperature"
                    
                    scenario_data["temperatures"][var_name] = {
                        "value": variable['value'],
                        "formatted": f"{variable['value']}K"
                    }
        
        result["top_scenarios"].append(scenario_data)
    
    return result

def get_setpoint_impacts():
    data = get_data()
    return data.data.setpoint_impact_summary