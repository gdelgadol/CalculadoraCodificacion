import heapq
import math

class HuffmanNode:
    def __init__(self, symbols, probability):
        self.symbols = symbols  
        self.probability = probability
        self.children = []
        self.code = ""

    def __lt__(self, other):
        if self.probability == other.probability:
            return self.symbols < other.symbols 
        return self.probability < other.probability
    
def get_entropy(probabilities, n):
    sum = 0
    for p in probabilities:
        if p != 0:
            sum += p * math.log2(p)
            
    return round((-sum / math.log2(n)), 4)

def get_average_length(encoding, probabilities, symbols):
    sum = 0
    for i in range(len(probabilities)):
        symbol = symbols[i]
        if symbol.startswith("DUMMY_"):
            continue
        if symbol in encoding:
            sum += len(encoding[symbol]) * probabilities[i]
        else:
            raise KeyError(f"Symbol {symbol} not found in encoding.")
    return round(sum, 4)

def huffman(symbols, probabilities, n=2):
    if n < 2:
        raise ValueError("n debe ser mayor o igual a 2 para un árbol de Huffman válido.")

    num_leaves = len(symbols)
    dummy_leaves = (num_leaves - 1) % (n - 1)

    if dummy_leaves != 0:
        for i in range(dummy_leaves):
            symbols.append(f"DUMMY_{i+1}")
            probabilities.append(0.0)

    heap = [HuffmanNode([s], p) for s, p in zip(symbols, probabilities)]
    heapq.heapify(heap)

    steps = []

    while len(heap) > 1:
        new_node = HuffmanNode([], 0)
        children = []

        for _ in range(min(n, len(heap))):
            child = heapq.heappop(heap)
            new_node.children.append(child)
            new_node.symbols.extend([s for s in child.symbols if not s.startswith("DUMMY_")])
            new_node.probability += child.probability
            children.append((child.symbols, child.probability))

        heapq.heappush(heap, new_node)

        steps.append({
            "merged": children,
            "new_node": {"symbols": new_node.symbols, "probability": new_node.probability}
        })

    def assign_codes(node, prefix=""):
        if not node.children:
            return {node.symbols[0]: prefix}

        codes = {}
        for i, child in enumerate(node.children):
            child.code = prefix + str(i)
            codes.update(assign_codes(child, child.code))

        return codes

    root = heap[0]
    encoding = assign_codes(root)

    encoding = {k: v for k, v in encoding.items() if not k.startswith("DUMMY_")}

    h_f = get_entropy(probabilities, n)

    av_length = get_average_length(encoding, probabilities, symbols)
    
    efficiency = round((h_f / av_length) * 100, 3)

    return {"encoding": encoding, "steps": steps, "entropy": h_f, "average_length": av_length, "efficiency": efficiency}