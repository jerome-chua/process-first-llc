from typing import List, Dict, Any
from pydantic import BaseModel

class Variable(BaseModel):
    name: str
    type: str
    value: float
    unit: str

class Equipment(BaseModel):
    equipment: str
    variables: List[Variable]

class Scenario(BaseModel):
    scenario: str
    equipment_specification: List[Equipment]
    kpi: str
    kpi_value: float

class TopVariable(BaseModel):
    equipment: str
    type: str
    name: str
    value: float
    unit: str

class SetpointImpact(BaseModel):
    equipment: str
    setpoint: str
    weightage: float
    unit: str

class ProcessData(BaseModel):
    main_summary_text: str
    top_summary_text: str
    top_impact: Dict[str, float]
    top_variables: List[TopVariable]
    impact_summary_text: str
    setpoint_impact_summary: List[SetpointImpact] 
    condition_impact_summary: List[Any]
    simulated_summary: Dict[str, List[Scenario]]

class ProcessResponse(BaseModel):
    data: ProcessData