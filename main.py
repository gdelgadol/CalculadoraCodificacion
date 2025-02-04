from fastapi import FastAPI
from pydantic import BaseModel
from algorithms.shannon_fano import shannon_fano
from algorithms.huffman import huffman
from algorithms.tunstall import tunstall
from algorithms.sardinas_patterson import sardinas_patterson_theorem

app = FastAPI()

# Define request model
class ShannonFanoInput(BaseModel):
    symbols: list[str]
    probabilities: list[float]

class HuffmanInput(BaseModel):
    symbols: list[str]
    probabilities: list[float]
    n: int = 2

class TunstallInput(BaseModel):
    symbols: list[str]
    probabilities: list[float]
    n: int
    length: int

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

@app.post("/tunstall")
def encode_tunstall(data: TunstallInput):
    result = tunstall(data.symbols, data.probabilities, data.n, data.length)
    return result

@app.post("/sardinas-patterson")
def check_decodability(data: list[str]):
    c = set(data)
    if sardinas_patterson_theorem(c)["flag"]:
        return {"message": "Es univocamente decodificable",
                "C_infinity": sardinas_patterson_theorem(c)["c_infinity"],
                "cs": sardinas_patterson_theorem(c)["cs"],
                "C_inf intersection C": sardinas_patterson_theorem(c)["C_inf intersection C"]}
    else:
        return {"message": "No es univocamente decodificable",
                "C_infinity": sardinas_patterson_theorem(c)["c_infinity"],
                "cs": sardinas_patterson_theorem(c)["cs"],
                "C_inf intersection C": sardinas_patterson_theorem(c)["C_inf intersection C"]}

