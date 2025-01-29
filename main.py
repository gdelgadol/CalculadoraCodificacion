from fastapi import FastAPI
from pydantic import BaseModel
from algorithms.shannon_fano import shannon_fano

app = FastAPI()

# Define request model
class ShannonFanoInput(BaseModel):
    symbols: list[str]
    probabilities: list[float]

@app.get("/")
def home():
    return {"message": "Algorithm Visualizer API"}

@app.post("/shannon-fano")
def encode_shannon_fano(data: ShannonFanoInput):
    result = shannon_fano(data.symbols, data.probabilities)
    return {"encoding": result}
