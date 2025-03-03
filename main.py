from fastapi import FastAPI
from pydantic import BaseModel
from algorithms.shannon_fano import shannon_fano
from algorithms.huffman import huffman
from algorithms.tunstall import tunstall
from algorithms.sardinas_patterson import sardinas_patterson_theorem
from algorithms.linear_codes import generate_codes
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from this origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


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

class LinearCodeInput(BaseModel):
    p: int
    n: int
    generator_matrix: list[list[int]]

@app.get("/")
async def home():
    return {"message": "Algorithm Visualizer API"}

@app.post("/shannon-fano")
async def encode_shannon_fano(data: ShannonFanoInput):
    result = shannon_fano(data.symbols, data.probabilities)
    return result

@app.post("/huffman")
async def encode_huffman(data: HuffmanInput):
    result = huffman(data.symbols, data.probabilities, data.n)
    return result

@app.post("/tunstall")
async def encode_tunstall(data: TunstallInput):
    result = tunstall(data.symbols, data.probabilities, data.n, data.length)
    return result

@app.post("/linear-codes")
def calculate_linear_codes(data: LinearCodeInput):
    return generate_codes(data.p, data.n, data.generator_matrix)

@app.post("/sardinas-patterson")
async def check_decodability(data: list[str]):
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

