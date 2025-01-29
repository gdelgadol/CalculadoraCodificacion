from fastapi import FastAPI
from pydantic import BaseModel
from algorithms.shannon_fano import shannon_fano
from algorithms.huffman import huffman

app = FastAPI()

# Define request model
class ShannonFanoInput(BaseModel):
    symbols: list[str]
    probabilities: list[float]

class HuffmanInput(BaseModel):
    symbols: list[str]
    probabilities: list[float]
    n: int = 2

@app.get("/")
def home():
    return {"message": "Algorithm Visualizer API"}

@app.post("/shannon-fano")
def encode_shannon_fano(data: ShannonFanoInput):
    result = shannon_fano(data.symbols, data.probabilities)
    return {"encoding": result}

@app.post("/huffman")
def encode_huffman(data: HuffmanInput):
    result = huffman(data.symbols, data.probabilities, data.n)
    return result
