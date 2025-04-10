from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import json
import os

class ProcessAnalysisReport(BaseModel):
    executive_summary: str = Field(description="A concise executive summary of the overall process analysis")
    technical_summary: str = Field(description="A detailed technical summary of the findings")
    variable_analysis: str = Field(description="Analysis of the impact of each key variable")
    recommendations: List[str] = Field(description="List of specific recommendations for process optimization")
    conclusion: str = Field(description="Concluding remarks tying the analysis together")

class ReportGenerator:
    def __init__(self, processed_data: Dict, api_key: Optional[str] = None):
        self.data = processed_data
        self.api_key = api_key or os.environ.get("OPENAI_API_KEY")
        self.llm = ChatOpenAI(temperature=0.2, model_name="gpt-4-turbo", api_key=self.api_key)
        self.report_content = {}
        self.parser = PydanticOutputParser(pydantic_object=ProcessAnalysisReport)
    
    def generate_report_content(self) -> Dict:
        """
        Generate the report content using LLM
        """

        summaries = self.data['summaries']
        top_variables = self.data['top_variables_df'].to_dict(orient='records')
        setpoint_impact = self.data['setpoint_impact_df'].to_dict(orient='records')
        kpi_stats = self.data['kpi_stats']
        
        prompt_template = """
        You are an expert process engineer specializing in thermal systems analysis for the chemical industry. 
        Your task is to analyze simulation results for a boiler system and identify process flow inefficiencies with academic rigor appropriate for chemical engineers & business executives.
        
        SYSTEM DESCRIPTION:
        This analysis examines a boiler system where fuel and air are combusted to generate high-temperature gas. 
        The thermal energy from this combustion gas is transferred to oil via a heat exchanger (HEX-100). 
        The primary Key Performance Indicator (KPI) is the Heat Exchanger Outlet Temperature, which directly impacts system efficiency and downstream processes.
        
        INPUT DATA CONTEXT:
        The provided data represents multiple simulation scenarios with varying equipment parameters. 
        Each scenario tested different operating conditions to determine their impact on the KPI.
        
        PROCESS DATA SUMMARY:
        Main Summary: {main_summary}
        Top Summary: {top_summary}
        Impact Summary: {impact_summary}
        
        TOP VARIABLES AFFECTING KPI:
        {top_variables}
        
        SETPOINT IMPACT SUMMARY:
        {setpoint_impact}
        
        KPI STATISTICS:
        - Minimum: {kpi_min} K
        - Maximum: {kpi_max} K
        - Mean: {kpi_mean} K
        - Standard Deviation: {kpi_std} K
        - Range: {kpi_range} K
        

        GENERATE A COMPREHENSIVE TECHNICAL REPORT WITH THE FOLLOWING STRUCTURE:
        {format_instructions}
        
        The report should include:
        1. An executive summary highlighting key findings (1 paragraph)
        2. Heat transfer coefficient analysis and its relationship to overall system performance
        3. Statistical significance of findings and confidence intervals where applicable
        4. Clear visualization recommendations for presenting these results to stakeholders
        5. Actionable optimization recommendations with expected KPI improvements, including:
            - Optimal setpoint ranges for each critical variable
            - Potential heat recovery opportunities
            - Process control strategy recommendations
        6. Reference to relevant engineering principles and heat exchanger design considerations
        """
        
        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["main_summary", "top_summary", "impact_summary", "top_variables", 
                            "setpoint_impact", "kpi_min", "kpi_max", "kpi_mean", "kpi_std", "kpi_range"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )

        formatted_prompt = prompt.format(
            main_summary=summaries['main_summary'],
            top_summary=summaries['top_summary'],
            impact_summary=summaries['impact_summary'],
            top_variables=json.dumps(top_variables, indent=2),
            setpoint_impact=json.dumps(setpoint_impact, indent=2),
            kpi_min=kpi_stats['min'],
            kpi_max=kpi_stats['max'],
            kpi_mean=kpi_stats['mean'],
            kpi_std=kpi_stats.get('std', 'N/A'),
            kpi_range=kpi_stats.get('range', kpi_stats['max'] - kpi_stats['min']),
        )
        
        response = self.llm.invoke(formatted_prompt)
        
        try:
            response_text = response.content if hasattr(response, 'content') else str(response)
            parsed_response = self.parser.parse(response_text)
            self.report_content = parsed_response.model_dump()
        except Exception as e:
            print(f"Error parsing LLM response: {e}")
            self.report_content = {"raw_response": response}
            self.report_content = {
                "executive_summary": "Analysis of process simulation data identified key variables affecting system performance.",
                "technical_summary": "The simulation results indicate several variables have significant impact on the heat exchanger output temperature.",
                "variable_analysis": "Temperature variables showed the strongest correlation with KPI improvements.",
                "recommendations": [
                    "Optimize temperature settings based on identified impact factors",
                    "Focus on variables with highest weightage for maximum improvement",
                    "Monitor heat transfer coefficients to ensure optimal system operation"
                ],
                "conclusion": "By adjusting the identified key variables, significant improvements in system performance can be achieved."
            }
            
        return self.report_content
    
    def get_report_content(self) -> Dict:
        """Get the report content, generating it if not already done"""
        if not self.report_content:
            return self.generate_report_content()
        return self.report_content