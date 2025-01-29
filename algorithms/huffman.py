import heapq
import math

class HuffmanNode:
    def __init__(self, symbols, probability):
        self.symbols = symbols  # List of symbols in this node
        self.probability = probability  # Total probability of this node
        self.children = []  # Child nodes
        self.code = ""  # Assigned code

    def __lt__(self, other):
        return self.probability < other.probability  # For heap sorting

def huffman(symbols, probabilities, n=2):
    """
    Generalized Huffman encoding supporting n-ary trees with dummy symbol handling.

    :param symbols: List of symbols
    :param probabilities: Corresponding probabilities
    :param n: Number of children per node (default 2 for binary)
    :return: A dictionary with Huffman codes and step-by-step tree construction
    """
    if n < 2:
        raise ValueError("n must be at least 2 (binary encoding or higher)")

    # Step 1: Balance the tree by adding dummy symbols if needed
    num_leaves = len(symbols)
    required_leaves = (math.ceil((num_leaves - 1) / (n - 1))) * (n - 1) + 1

    if num_leaves < required_leaves:
        num_dummies = required_leaves - num_leaves
        for i in range(num_dummies):
            symbols.append(f"DUMMY_{i+1}")  # Name the dummy symbol
            probabilities.append(0.0)  # Assign 0 probability

    # Step 2: Priority queue (min-heap) to build the tree
    heap = [HuffmanNode([s], p) for s, p in zip(symbols, probabilities)]
    heapq.heapify(heap)

    steps = []  # Store intermediate steps

    # Step 3: Build the tree by merging n nodes at a time
    while len(heap) > 1:
        new_node = HuffmanNode([], 0)  # Create a new node
        children = []

        # Take the n least probable nodes
        for _ in range(min(n, len(heap))):
            child = heapq.heappop(heap)
            new_node.children.append(child)
            new_node.symbols.extend(child.symbols)
            new_node.probability += child.probability
            children.append((child.symbols, child.probability))

        heapq.heappush(heap, new_node)  # Push the merged node back into the heap

        # Store the step
        steps.append({
            "merged": children,
            "new_node": {"symbols": new_node.symbols, "probability": new_node.probability}
        })

    # Step 4: Assign codes using a traversal
    def assign_codes(node, prefix=""):
        if not node.children:  # Leaf node
            return {node.symbols[0]: prefix}

        codes = {}
        for i, child in enumerate(node.children):
            child.code = prefix + str(i)  # Assign n-ary digit
            codes.update(assign_codes(child, child.code))

        return codes

    # Root node should be the only element in heap now
    root = heap[0]
    encoding = assign_codes(root)

    # Remove dummy symbols from the final encoding
    encoding = {k: v for k, v in encoding.items() if not k.startswith("DUMMY_")}

    return {"encoding": encoding, "steps": steps}
