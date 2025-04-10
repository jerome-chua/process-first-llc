import os
import tempfile
from typing import Dict
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

class PDFService:
    def __init__(self, report_content: Dict, chart_paths: Dict, processed_data: Dict):
        self.report_content = report_content
        self.chart_paths = chart_paths
        self.data = processed_data
        
    def generate_pdf(self, output_path: str = "process_analysis_report.pdf") -> str:
        """Generate the PDF report using reportlab"""
        with tempfile.TemporaryDirectory() as temp_dir:
            doc = SimpleDocTemplate(
                output_path,
                pagesize=letter,
                rightMargin=72,
                leftMargin=72,
                topMargin=72,
                bottomMargin=72
            )
            
            styles = getSampleStyleSheet()
            title_style = styles["Heading1"]
            heading1_style = styles["Heading1"]
            heading2_style = styles["Heading2"]
            heading3_style = styles["Heading3"]
            normal_style = styles["Normal"]
            
            styles.add(ParagraphStyle(
                name='CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                spaceAfter=30,
                alignment=TA_CENTER
            ))
            styles.add(ParagraphStyle(
                name='CustomSubtitle',
                parent=styles['Heading2'],
                fontSize=18,
                spaceAfter=20,
                alignment=TA_CENTER
            ))
            story = []
            
            # Title
            story.append(Paragraph("Process Simulation Analysis Report", styles["CustomTitle"]))
            story.append(Paragraph("KPI Optimization Analysis", styles["CustomSubtitle"]))
            story.append(Spacer(1, 0.5*inch))
            
            # Executive Summary
            story.append(Paragraph("Executive Summary", heading1_style))
            story.append(Spacer(1, 0.2*inch))
            exec_summary = self.report_content.get('executive_summary', '')
            story.append(Paragraph(exec_summary, normal_style))
            story.append(Spacer(1, 0.3*inch))
            
            # Technical Analysis
            story.append(Paragraph("Technical Analysis", heading1_style))
            story.append(Spacer(1, 0.2*inch))
            tech_summary = self.report_content.get('technical_summary', '')
            story.append(Paragraph(tech_summary, normal_style))
            story.append(Spacer(1, 0.3*inch))
            story.append(Paragraph("Key Variables Impacting the KPI", heading1_style))
            story.append(Spacer(1, 0.2*inch))
            story.append(Paragraph("Top Variables Overview", heading2_style))
            story.append(Spacer(1, 0.1*inch))
            
            # Table from top variables dataframe
            top_vars_df = self.data['top_variables_df']
            top_vars_data = [top_vars_df.columns.tolist()] + top_vars_df.values.tolist()
            top_vars_table = Table(top_vars_data)
            top_vars_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 10),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ]))
            story.append(top_vars_table)
            story.append(Spacer(1, 0.2*inch))
            
            # Top impact pie chart
            top_impact_pie = self.chart_paths.get('top_impact_pie', '')
            if top_impact_pie and os.path.exists(top_impact_pie):
                story.append(Paragraph("Top Variable Impact", heading3_style))
                story.append(Spacer(1, 0.1*inch))
                img = Image(top_impact_pie, width=6*inch, height=4*inch)
                story.append(img)
                story.append(Spacer(1, 0.2*inch))
            
            # Variable Impact Analysis
            story.append(Paragraph("Variable Impact Analysis", heading2_style))
            story.append(Spacer(1, 0.1*inch))
            var_analysis = self.report_content.get('variable_analysis', '')
            story.append(Paragraph(var_analysis, normal_style))
            story.append(Spacer(1, 0.2*inch))
            
            # Setpoint impact bar chart
            setpoint_impact_bar = self.chart_paths.get('setpoint_impact_bar', '')
            if setpoint_impact_bar and os.path.exists(setpoint_impact_bar):
                story.append(Paragraph("Setpoint Impact Analysis", heading3_style))
                story.append(Spacer(1, 0.1*inch))
                img = Image(setpoint_impact_bar, width=6*inch, height=4*inch)
                story.append(img)
                story.append(Spacer(1, 0.2*inch))
            
            # Performance Distribution
            story.append(Paragraph("Performance Distribution", heading2_style))
            story.append(Spacer(1, 0.1*inch))
            story.append(Paragraph(
                "The following chart shows the distribution of KPI values (Heater Outlet Temperature) across all simulated scenarios:",
                normal_style
            ))
            story.append(Spacer(1, 0.1*inch))
            
            # KPI distribution chart
            kpi_distribution = self.chart_paths.get('kpi_distribution', '')
            if kpi_distribution and os.path.exists(kpi_distribution):
                img = Image(kpi_distribution, width=6*inch, height=4*inch)
                story.append(img)
                story.append(Spacer(1, 0.2*inch))
            
            # Variable Correlation Analysis
            story.append(Paragraph("Variable Correlation Analysis", heading2_style))
            story.append(Spacer(1, 0.1*inch))
            story.append(Paragraph(
                "This chart demonstrates how the key variables correlate with the KPI value:",
                normal_style
            ))
            story.append(Spacer(1, 0.1*inch))
            
            # Variable Comparison Chart
            variable_comparison = self.chart_paths.get('variable_comparison', '')
            if variable_comparison and os.path.exists(variable_comparison):
                img = Image(variable_comparison, width=6*inch, height=4*inch)
                story.append(img)
                story.append(Spacer(1, 0.2*inch))
            
            # Top Performing Scenarios
            story.append(Paragraph("Top Performing Scenarios", heading2_style))
            story.append(Spacer(1, 0.1*inch))
            story.append(Paragraph(
                "The following scenarios achieved the highest KPI values:",
                normal_style
            ))
            story.append(Spacer(1, 0.1*inch))
            
            # Top Scenarios Chart
            top_scenarios = self.chart_paths.get('top_scenarios', '')
            if top_scenarios and os.path.exists(top_scenarios):
                img = Image(top_scenarios, width=6*inch, height=4*inch)
                story.append(img)
                story.append(Spacer(1, 0.2*inch))
            
            # Implementation Recommendations
            story.append(Paragraph("Implementation Recommendations", heading1_style))
            story.append(Spacer(1, 0.2*inch))
            
            recommendations = self.report_content.get('recommendations', [])
            for i, rec in enumerate(recommendations, 1):
                story.append(Paragraph(f"{i}. {rec}", normal_style))
                story.append(Spacer(1, 0.1*inch))
            
            story.append(Spacer(1, 0.2*inch))
            
            # Conclusion
            story.append(Paragraph("Conclusion", heading1_style))
            story.append(Spacer(1, 0.2*inch))
            conclusion = self.report_content.get('conclusion', '')
            story.append(Paragraph(conclusion, normal_style))
            
            doc.build(story)
            
            return os.path.abspath(output_path)