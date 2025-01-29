import heapq
import math

class TunstallNode:
    def __init__(self, symbols, probability, code=""):
        self.symbols = symbols  # Symbols in this node
        self.probability = probability  # Probability of this node
        self.children = []  # Child nodes
        self.code = code  # Assigned code

    def __lt__(self, other):
        """ Sorting for max heap: expand highest probability first """
        return (self.probability, tuple(self.symbols)) > (other.probability, tuple(other.symbols))  # Max heap

def tunstall(symbols, probabilities, n):
    """
    Generalized n-ary Tunstall encoding.

    :param symbols: List of symbols
    :param probabilities: Corresponding probabilities
    :param n: Size of the coding alphabet (binary = 2, ternary = 3, etc.)
    :return: A dictionary with Tunstall codes and tree construction steps
    """
    if n < 2:
        raise ValueError("n must be at least 2 (binary coding or higher)")

    # Step 1: Initialize priority queue (max heap) with root node
    root = TunstallNode(symbols, sum(probabilities))
    heap = [(-root.probability, root)]  # Max heap (negative probability for heapq)
    codebook = {}
    steps = []
    
    # Step 2: Expand nodes until we can't anymore
    while heap:
        _, node = heapq.heappop(heap)  # Expand the highest probability node
        total_prob = sum(probabilities)  # Normalize probabilities

        if len(node.code) >= math.ceil(math.log(len(symbols), n)):  
            # Stop when we've reached the dictionary size limit
            codebook["".join(node.symbols)] = node.code
            continue

        # Expand the node into `n` children
        new_children = []
        for j, s in enumerate(symbols):
            child_prob = probabilities[j] * (node.probability / total_prob)  # Distribute probability
            child_code = node.code + str(j)  # Assign code in left-to-right order
            child = TunstallNode([s], child_prob, child_code)
            node.children.append(child)
            new_children.append({"symbol": s, "probability": child_prob, "code": child_code})
            heapq.heappush(heap, (-child.probability, child))  # Push into heap

        steps.append({"expanded": node.symbols, "new_nodes": new_children})

    return {"encoding": codebook, "steps": steps}
