import pandas as pd
import numpy as np
from typing import Dict, List, Any

class DataProcessor:
    def __init__(self, json_data: Dict):
        self.raw_data = json_data
        self.data = json_data.get('data', {})
        self.processed_data = {}
    
    def process_summaries(self) -> Dict:
        """Extract and process summary texts from the data"""
        summaries = {
            'main_summary': self.data.get('main_summary_text', ''),
            'top_summary': self.data.get('top_summary_text', ''),
            'impact_summary': self.data.get('impact_summary_text', '')
        }
        self.processed_data['summaries'] = summaries
        return summaries
    
    def process_top_variables(self) -> pd.DataFrame:
        """Process the top variables data into a DataFrame"""
        top_vars = self.data.get('top_variables', [])
        top_vars_df = pd.DataFrame(top_vars)
        self.processed_data['top_variables_df'] = top_vars_df
        return top_vars_df
    
    def process_impacts(self) -> Dict:
        """Process the impact data"""
        top_impact = self.data.get('top_impact', {})
        
        impact_items = [(k, v) for k, v in top_impact.items()]
        impact_df = pd.DataFrame(impact_items, columns=['Variable', 'Impact'])
        
        impact_df = impact_df.sort_values('Impact', ascending=False)
        
        self.processed_data['impact_df'] = impact_df
        return {'impact_df': impact_df, 'top_impact': top_impact}
    
    def process_setpoint_impact(self) -> pd.DataFrame:
        """Process the setpoint impact summary data"""
        setpoint_impact = self.data.get('setpoint_impact_summary', [])
        setpoint_df = pd.DataFrame(setpoint_impact)
        
        # Sort by weightage
        if not setpoint_df.empty and 'weightage' in setpoint_df.columns:
            setpoint_df = setpoint_df.sort_values('weightage', ascending=False)
        
        self.processed_data['setpoint_impact_df'] = setpoint_df
        return setpoint_df
    
    def prepare_scenario_data(self) -> pd.DataFrame:
        """Convert scenario data to DataFrame format"""
        simulated_data = self.raw_data['data']['simulated_summary']['simulated_data']
        scenario_data = []
        
        for scenario in simulated_data:
            scenario_id = scenario['scenario']
            kpi_value = scenario['kpi_value']
            
            for equipment_spec in scenario['equipment_specification']:
                equipment = equipment_spec['equipment']
                
                for variable in equipment_spec['variables']:
                    var_name = f"{equipment}.{variable['name']}"
                    if var_name == "Fuel.Fuel - temperature":
                        var_name = "Fuel.temperature"
                    
                    if 'heat_transfer_coefficient' in variable['name']:
                        formatted_value = f"{variable['value']} W/m²·K"
                        raw_value = variable['value']
                        unit = "W/m²·K"
                    else:
                        formatted_value = f"{variable['value']}K"
                        raw_value = variable['value']
                        unit = "K"
                    
                    scenario_data.append({
                        'scenario': scenario_id,
                        'equipment': equipment,
                        'variable': var_name,
                        'type': variable['type'],
                        'value': raw_value,  
                        'formatted_value': formatted_value,
                        'unit': unit,
                        'kpi_value': kpi_value
                    })
        
        return pd.DataFrame(scenario_data)
    
    def process_scenarios(self) -> Dict:
        """Process the scenario data using prepare_scenario_data and calculate statistics"""
        scenario_df = self.prepare_scenario_data()
        self.processed_data['scenario_df'] = scenario_df
        
        pivot_df = scenario_df.pivot_table(
            index='scenario', 
            columns='variable', 
            values='value',
            aggfunc='first'
        ).reset_index()
        
        kpi_values = scenario_df[['scenario', 'kpi_value']].drop_duplicates()
        pivot_df = pd.merge(pivot_df, kpi_values, on='scenario')
        
        self.processed_data['scenarios_pivot_df'] = pivot_df
        
        kpi_stats = {
            'min': pivot_df['kpi_value'].min(),
            'max': pivot_df['kpi_value'].max(),
            'mean': pivot_df['kpi_value'].mean(),
            'std': pivot_df['kpi_value'].std(),
            'range': pivot_df['kpi_value'].max() - pivot_df['kpi_value'].min(),
            'median': pivot_df['kpi_value'].median()
        }
        self.processed_data['kpi_stats'] = kpi_stats
        
        # Get top performing scenarios
        top_scenarios = pivot_df.sort_values('kpi_value', ascending=False).head(5)
        self.processed_data['top_scenarios'] = top_scenarios
        
        return {
            'scenario_df': scenario_df,
            'scenarios_pivot_df': pivot_df,
            'kpi_stats': kpi_stats,
            'top_scenarios': top_scenarios
        }
    
    def calculate_correlations(self) -> pd.DataFrame:
        """Calculate correlations between variables and KPI"""
        pivot_df = self.processed_data.get('scenarios_pivot_df')
        
        if pivot_df is None or pivot_df.empty:
            return pd.DataFrame()
        
        numeric_cols = pivot_df.select_dtypes(include=[np.number]).columns.tolist()
        numeric_cols = [col for col in numeric_cols if col != 'kpi_value']
        
        correlations = pd.DataFrame({
            'variable': numeric_cols,
            'correlation': [pivot_df[col].corr(pivot_df['kpi_value']) for col in numeric_cols]
        }).sort_values('correlation', ascending=False)
        
        self.processed_data['correlations'] = correlations
        return correlations
    
    def process_all(self) -> Dict:
        """Process all data and return the processed results"""
        self.process_summaries()
        self.process_top_variables()
        self.process_impacts()
        self.process_setpoint_impact()
        self.process_scenarios()
        self.calculate_correlations()
        
        return self.processed_data