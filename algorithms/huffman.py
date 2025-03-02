import heapq
import math

class HuffmanNode:
    def __init__(self, symbols, probability):
        self.symbols = symbols  # List of symbols
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
        if symbol.startswith("□"):
            continue
        if symbol in encoding:
            sum += len(encoding[symbol]) * probabilities[i]
        else:
            raise KeyError(f"Symbol {symbol} not found in encoding.")
    return round(sum, 4)


def huffman(symbols, probabilities, n=2):
    if n < 2:
        raise ValueError("n must be at least 2 for a valid Huffman tree.")

    # Sort symbols and probabilities in ascending order
    sorted_data = sorted(zip(symbols, probabilities), key=lambda x: x[1])
    symbols, probabilities = zip(*sorted_data)
    symbols = list(symbols)
    probabilities = list(probabilities)

    num_leaves = len(symbols)
    dummy_leaves = (num_leaves - 1) % (n - 1)

    if dummy_leaves != 0:
        for i in range(dummy_leaves):
            symbols.append("□")
            probabilities.append(0.0)

    heap = [HuffmanNode([s], p) for s, p in zip(symbols, probabilities)]
    heapq.heapify(heap)

    steps = []

    # Add the initial step with individual nodes
    initial_nodes = [{"symbols": [s], "probability": p, "children": []} for s, p in zip(symbols, probabilities)]
    steps.append({
        "tree": initial_nodes,
        "description": "Nodos iniciales ordenados por probabilidad."
    })

    iteration = 0  # Counter for parent node labels

    while len(heap) > 1:
        new_node = HuffmanNode([], 0)
        children = []
        combined_probability = 0

        for _ in range(min(n, len(heap))):
            child = heapq.heappop(heap)
            new_node.children.append(child)
            combined_probability += child.probability
            children.append({
                "symbols": child.symbols,
                "probability": child.probability,
                "children": child.children
            })

        # Assign a unique label v_i to the parent node
        new_node.symbols = [f"v_{iteration}"]
        new_node.probability = combined_probability
        heapq.heappush(heap, new_node)

        # Create a hierarchical tree structure for the current step
        current_tree = {
            "symbols": new_node.symbols,
            "probability": new_node.probability,
            "children": children
        }

        # Generate the description for the current step
        child_symbols = [", ".join(child["symbols"]) for child in children]
        description = f"Nodo{'s' if len(child_symbols) > 1 else ''} {', '.join(child_symbols)} tienen nuevo padre {', '.join(new_node.symbols)}"

        steps.append({
            "tree": current_tree,
            "description": description
        })

        iteration += 1  # Increment the iteration counter

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

    encoding = {k: v for k, v in encoding.items() if not k.startswith("□")}

    h_f = get_entropy(probabilities, n)
    av_length = get_average_length(encoding, probabilities, symbols)
    efficiency = round((h_f / av_length) * 100, 3)

    return {
        "encoding": encoding,
        "steps": steps,
        "entropy": h_f,
        "average_length": av_length,
        "efficiency": efficiency
    }