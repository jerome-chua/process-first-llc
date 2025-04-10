import os
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, List, Any
import pandas as pd
import numpy as np
from matplotlib.colors import LinearSegmentedColormap

class ChartGenerator:
    def __init__(self, processed_data: Dict):
        self.data = processed_data
        self.chart_paths = {}
        
        # Set custom styling
        self.setup_styles()
    
    def setup_styles(self):
        """Set up custom styles for charts"""
        plt.style.use('ggplot')
        sns.set_palette("deep")
        
        # Create a custom colormap for consistent coloring
        self.cmap = LinearSegmentedColormap.from_list(
            "custom_cmap", ["#2C3E50", "#3498DB", "#1ABC9C", "#F1C40F", "#E74C3C"]
        )
    
    def generate_top_impact_pie(self, save_path: str = None) -> str:
        """Generate a pie chart of top variable impacts"""
        impact_df = self.data.get('impact_df')
        
        if impact_df is None or impact_df.empty:
            return None
        
        plt.figure(figsize=(10, 8))
        wedges, texts, autotexts = plt.pie(
            impact_df['Impact'], 
            labels=impact_df['Variable'], 
            autopct='%1.1f%%', 
            startangle=90, 
            shadow=True, 
            explode=[0.05] * len(impact_df),
            colors=plt.cm.tab10.colors
        )
        
        # Enhance text and label styling
        plt.setp(autotexts, size=10, weight="bold")
        plt.setp(texts, size=12)
        
        plt.title('Top Variables Impact Distribution', fontsize=16, fontweight='bold')
        plt.axis('equal')  # Equal aspect ratio ensures the pie chart is circular
        
        if save_path:
            plt.savefig(save_path, bbox_inches='tight', dpi=300)
            self.chart_paths['top_impact_pie'] = save_path
            plt.close()
            return save_path
        else:
            plt.close()
            return None
    
    def generate_setpoint_impact_bar(self, save_path: str = None) -> str:
        """Generate a bar chart of setpoint impacts"""
        setpoint_df = self.data.get('setpoint_impact_df')
        
        if setpoint_df is None or setpoint_df.empty:
            return None
        
        plt.figure(figsize=(12, 7))
        # Create labels by combining equipment and setpoint
        labels = [f"{row['equipment']}.{row['setpoint']}" for _, row in setpoint_df.iterrows()]
        
        bars = plt.bar(
            labels, 
            setpoint_df['weightage'],
            color=plt.cm.viridis(np.linspace(0, 1, len(labels)))
        )
        
        # Add value labels on top of bars
        for bar in bars:
            height = bar.get_height()
            plt.text(
                bar.get_x() + bar.get_width()/2., 
                height + 0.5,
                f'{height:.1f}%',
                ha='center', va='bottom', 
                fontweight='bold'
            )
        
        plt.title('Setpoint Impact Analysis', fontsize=16, fontweight='bold')
        plt.xlabel('Equipment.Setpoint', fontsize=12)
        plt.ylabel('Weightage (%)', fontsize=12)
        plt.xticks(rotation=45, ha='right', fontsize=10)
        plt.grid(axis='y', linestyle='--', alpha=0.7)
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, bbox_inches='tight', dpi=300)
            self.chart_paths['setpoint_impact_bar'] = save_path
            plt.close()
            return save_path
        else:
            plt.close()
            return None
    
    def generate_kpi_distribution(self, save_path: str = None) -> str:
        """Generate a histogram of KPI values"""
        pivot_df = self.data.get('scenarios_pivot_df')
        
        if pivot_df is None or pivot_df.empty or 'kpi_value' not in pivot_df.columns:
            return None
        
        plt.figure(figsize=(12, 7))
        
        # Create distribution plot with kernel density estimate
        # Fixed version - KDE color needs to be passed differently
        ax = sns.histplot(
            pivot_df['kpi_value'], 
            kde=True, 
            bins=15, 
            color="#3498DB"
        )
        
        # Get the KDE line from the returned axes and set its color
        line = ax.lines[0]
        line.set_color("#E74C3C")
        line.set_linewidth(2)
        
        # Add vertical lines for min, max, mean and other stats
        kpi_stats = self.data.get('kpi_stats', {})
        if kpi_stats:
            ax.axvline(kpi_stats.get('min', 0), color='#E74C3C', linestyle='--', linewidth=2, 
                    label=f"Min: {kpi_stats.get('min', 0):.2f}K")
            ax.axvline(kpi_stats.get('max', 0), color='#2ECC71', linestyle='--', linewidth=2, 
                    label=f"Max: {kpi_stats.get('max', 0):.2f}K")
            ax.axvline(kpi_stats.get('mean', 0), color='#F39C12', linestyle='--', linewidth=2, 
                    label=f"Mean: {kpi_stats.get('mean', 0):.2f}K")
            ax.axvline(kpi_stats.get('median', 0), color='#9B59B6', linestyle='--', linewidth=2, 
                    label=f"Median: {kpi_stats.get('median', 0):.2f}K")
        
        plt.annotate(
            f"Range: {kpi_stats.get('range', 0):.2f}K", 
            xy=(0.7, 0.9), 
            xycoords='axes fraction',
            bbox=dict(boxstyle="round,pad=0.5", facecolor="white", alpha=0.8),
            fontsize=12
        )
        
        plt.legend(fontsize=10, loc='upper left')
        
        plt.title('KPI Distribution (Heater Outlet Temperature)', fontsize=16, fontweight='bold')
        plt.xlabel('Temperature (K)', fontsize=12)
        plt.ylabel('Frequency', fontsize=12)
        plt.grid(linestyle='--', alpha=0.7)
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, bbox_inches='tight', dpi=300)
            self.chart_paths['kpi_distribution'] = save_path
            plt.close()
            return save_path
        else:
            plt.close()
            return None
 
    def generate_variable_comparison(self, save_path: str = None) -> str:
        """Generate a scatter plot matrix of key variables against KPI"""
        pivot_df = self.data.get('scenarios_pivot_df')
        top_vars_df = self.data.get('top_variables_df')
        correlations = self.data.get('correlations')
        
        if (pivot_df is None or pivot_df.empty or 
            top_vars_df is None or top_vars_df.empty):
            return None
        
        # Identify key variables from top_vars_df
        key_vars = []
        for _, row in top_vars_df.iterrows():
            var_name = f"{row['equipment']}.{row['name']}"
            if var_name in pivot_df.columns:
                key_vars.append(var_name)
        
        if not key_vars:
            return None
        
        # Create a subset of the dataframe with key variables and KPI
        plt.figure(figsize=(12, 4 * len(key_vars)))
        fig, axes = plt.subplots(len(key_vars), 1, figsize=(12, 4 * len(key_vars)))
        
        # Use a colormap for points to show KPI values
        cmap = plt.cm.viridis
        
        for i, var in enumerate(key_vars):
            ax = axes[i] if len(key_vars) > 1 else axes
            
            # Get correlation value
            corr_val = 0
            if correlations is not None and not correlations.empty:
                corr_row = correlations[correlations['variable'] == var]
                if not corr_row.empty:
                    corr_val = corr_row.iloc[0]['correlation']
            
            # Create scatter plot
            scatter = ax.scatter(
                pivot_df[var], 
                pivot_df['kpi_value'],
                c=pivot_df['kpi_value'],  # Color by KPI value
                cmap=cmap,
                alpha=0.7,
                s=70,
                edgecolor='k'
            )
            
            # Add trend line
            z = np.polyfit(pivot_df[var], pivot_df['kpi_value'], 1)
            p = np.poly1d(z)
            ax.plot(
                sorted(pivot_df[var]), 
                p(sorted(pivot_df[var])), 
                "r--", 
                linewidth=2,
                alpha=0.8
            )
            
            # Add correlation information
            ax.text(
                0.05, 0.95, 
                f'Correlation: {corr_val:.3f}', 
                transform=ax.transAxes,
                fontsize=12,
                verticalalignment='top', 
                bbox={'boxstyle': 'round', 'facecolor': 'white', 'alpha': 0.8}
            )
            
            # Add variable details from top_vars_df if available
            var_details = top_vars_df[
                (top_vars_df['equipment'] + '.' + top_vars_df['name']) == var
            ]
            
            if not var_details.empty:
                var_type = var_details.iloc[0]['type']
                unit = var_details.iloc[0]['unit']
                ax.set_title(
                    f"Impact of {var} ({var_type}) on KPI", 
                    fontsize=14,
                    fontweight='bold'
                )
                ax.set_xlabel(f"{var} ({unit})", fontsize=12)
            else:
                ax.set_title(f"Impact of {var} on KPI", fontsize=14, fontweight='bold')
                ax.set_xlabel(var, fontsize=12)
            
            ax.set_ylabel('KPI Value (K)', fontsize=12)
            ax.grid(linestyle='--', alpha=0.7)
            
            # Add colorbar
            if i == len(key_vars) - 1:  # Only for the last subplot
                fig.colorbar(scatter, ax=ax, label='KPI Value (K)')
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, bbox_inches='tight', dpi=300)
            self.chart_paths['variable_comparison'] = save_path
            plt.close()
            return save_path
        else:
            plt.close()
            return None
    
    def generate_top_scenarios(self, save_path: str = None, top_n: int = 5) -> str:
        """Generate a bar chart of top performing scenarios"""
        pivot_df = self.data.get('scenarios_pivot_df')
        
        if pivot_df is None or pivot_df.empty:
            return None
        
        # Get top N scenarios by KPI value
        top_scenarios = pivot_df.sort_values('kpi_value', ascending=False).head(top_n)
        
        plt.figure(figsize=(12, 7))
        bars = plt.bar(
            top_scenarios['scenario'], 
            top_scenarios['kpi_value'],
            color=plt.cm.viridis(np.linspace(0, 1, len(top_scenarios))),
            width=0.6
        )
        
        # Add value labels on top of bars
        for bar in bars:
            height = bar.get_height()
            plt.text(
                bar.get_x() + bar.get_width()/2., 
                height + 1,
                f'{height:.1f}K',
                ha='center', va='bottom', 
                fontweight='bold',
                fontsize=11
            )
        
        plt.title(f'Top {top_n} Performing Scenarios', fontsize=16, fontweight='bold')
        plt.xlabel('Scenario', fontsize=12)
        plt.ylabel('KPI Value (K)', fontsize=12)
        plt.xticks(rotation=45, ha='right', fontsize=10)
        plt.grid(axis='y', linestyle='--', alpha=0.7)
        
        # Add a horizontal line for the average KPI value
        avg_kpi = pivot_df['kpi_value'].mean()
        plt.axhline(
            y=avg_kpi, 
            color='r', 
            linestyle='--', 
            linewidth=2,
            label=f'Average KPI: {avg_kpi:.2f}K'
        )
        plt.legend()
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, bbox_inches='tight', dpi=300)
            self.chart_paths['top_scenarios'] = save_path
            plt.close()
            return save_path
        else:
            plt.close()
            return None
    
    def save_charts_to_files(self, directory: str = './charts') -> Dict:
        """Generate all charts and save them to files"""
        os.makedirs(directory, exist_ok=True)
        
        self.generate_top_impact_pie(os.path.join(directory, 'top_impact_pie.png'))
        self.generate_setpoint_impact_bar(os.path.join(directory, 'setpoint_impact_bar.png'))
        self.generate_kpi_distribution(os.path.join(directory, 'kpi_distribution.png'))
        self.generate_variable_comparison(os.path.join(directory, 'variable_comparison.png'))
        self.generate_top_scenarios(os.path.join(directory, 'top_scenarios.png'))
        
        return self.chart_paths