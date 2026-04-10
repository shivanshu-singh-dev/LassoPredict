import pandas as pd
from sklearn.linear_model import Lasso
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

def train_lasso_model(df: pd.DataFrame, target_column: str, alpha: float = 1.0):
    if target_column not in df.columns:
        raise ValueError("Target column not found in data.")
    
    X = df.drop(columns=[target_column])
    y = df[target_column]
    
    if X.empty:
        raise ValueError("No features available for training.")
        
    model = Lasso(alpha=alpha)
    model.fit(X, y)
    
    predictions = model.predict(X)
    
    mse = mean_squared_error(y, predictions)
    r2 = r2_score(y, predictions)
    
    coefficients = dict(zip(X.columns, model.coef_))
    selected_features = [feature for feature, coef in coefficients.items() if coef != 0.0]
    
    return {
        "coefficients": json_safe(coefficients),
        "intercept": float(model.intercept_),
        "selected_features": selected_features,
        "predictions": predictions.tolist()[:100],
        "metrics": {
            "mse": float(mse),
            "r2": float(r2)
        }
    }

def json_safe(d: dict) -> dict:
    return {k: float(v) for k, v in d.items()}
