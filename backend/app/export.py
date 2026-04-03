import pandas as pd
import json
import io
from fpdf import FPDF
import base64

def export_results(results: dict, format: str) -> dict:
    """Takes results dictionary and returns base64 encoded string of the exported file along with filename."""
    # Data to export (we'll just tabularize metrics and selected features for simple export)
    # the frontend passes down the dict: {coefficients, intercept, selected_features, predictions, metrics}
    
    # Create simple dataframes
    coef_df = pd.DataFrame(list(results.get("coefficients", {}).items()), columns=["Feature", "Coefficient"])
    metrics_df = pd.DataFrame([results.get("metrics", {})])
    
    if format == "csv":
        output = io.StringIO()
        coef_df.to_csv(output, index=False)
        return {"filename": "results.csv", "data": base64.b64encode(output.getvalue().encode()).decode(), "type": "text/csv"}
        
    elif format == "excel":
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            coef_df.to_excel(writer, sheet_name="Coefficients", index=False)
            metrics_df.to_excel(writer, sheet_name="Metrics", index=False)
        return {"filename": "results.xlsx", "data": base64.b64encode(output.getvalue()).decode(), "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
        
    elif format == "json":
        output = json.dumps(results, indent=2)
        return {"filename": "results.json", "data": base64.b64encode(output.encode()).decode(), "type": "application/json"}
        
    elif format == "txt":
        output = io.StringIO()
        coef_df.to_csv(output, index=False, sep="\t")
        return {"filename": "results.txt", "data": base64.b64encode(output.getvalue().encode()).decode(), "type": "text/plain"}
        
    elif format == "pdf":
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt="Lasso Regression Results", ln=True, align='C')
        
        pdf.set_font("Arial", size=10)
        metrics = results.get("metrics", {})
        pdf.cell(200, 10, txt=f"MSE: {metrics.get('mse', 'N/A')}", ln=True)
        pdf.cell(200, 10, txt=f"R2: {metrics.get('r2', 'N/A')}", ln=True)
        
        pdf.cell(200, 10, txt=f"Intercept: {results.get('intercept', 'N/A')}", ln=True)
        
        pdf.cell(200, 10, txt="Coefficients:", ln=True)
        for k, v in results.get("coefficients", {}).items():
            pdf.cell(200, 10, txt=f"{k}: {v}", ln=True)
            
        output = io.BytesIO()
        output.write(pdf.output(dest='S').encode('latin1')) # FPDF output to string -> bytes
        return {"filename": "results.pdf", "data": base64.b64encode(output.getvalue()).decode(), "type": "application/pdf"}
        
    else:
        raise ValueError("Unsupported format")

