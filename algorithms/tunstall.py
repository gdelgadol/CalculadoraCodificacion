import math
from heapq import heappush, heappop

class TunstallNode:
    def __init__(self, probability, code=""):
        self.probability = probability  # Probability of this node
        self.children = []  # Child nodes
        self.code = code  # Assigned code

    def __lt__(self, other):
        return self.probability > other.probability  # Max heap

def get_leaves(node):
    if not node.children:
        return [node]
    leaves = []
    for child in node.children:
        leaves.extend(get_leaves(child))
    return leaves

def tunstall(symbols, probabilities, n, length):
    if n < 2:
        raise ValueError("Dz must be at least 2 (binary coding or higher)")

    # Step 1: Initialize priority queue (max heap) with root node
    root = TunstallNode(symbols, sum(probabilities))
    heap = []
    for i in range(len(symbols)):
        child = TunstallNode(probabilities[i], code=str(symbols[i]))
        root.children.append(child)
        heappush(heap, (-child.probability, child))
    
    codebook = []
    steps = []
    iterations = math.floor(((n ** length) - 1) / (len(symbols) - 1)) - 1
    num_leaves = 1 + ((iterations + 1) * (len(symbols) - 1))
    # Step 2: Expand nodes until we can't anymore
    while iterations > 0:
        _, node = heappop(heap)  # Expand the highest probability node
        # Expand the node into `n` children
        new_children = []
        for j in range(len(symbols)):
            child_prob = probabilities[j] * (node.probability)
            child = TunstallNode(child_prob, code=node.code + str(symbols[j]))
            node.children.append(child)
            new_children.append(child)
            heappush(heap, (-child.probability, child))
        steps.append({"expanded": node.code, "new_nodes": new_children})
        iterations -= 1

    # Step 3: Assign codes to leaf nodes
    alphabet = [str(i) for i in range(n)]  # Create numeric alphabet
    codes = []
    queue = [""]  # Start with an empty combination

    while queue:
        current = queue.pop(0)

        # If we have reached the required length, store the result
        if len(current) == length:
            codes.append(current)

            # Stop if we reach the desired limit
            if len(codes) >= num_leaves:
                break
        else:
            # Append each digit in the alphabet to form new combinations
            for digit in alphabet:
                queue.append(current + digit)

    # Ensure we have enough codes
    if len(codes) < num_leaves:
        raise ValueError("Not enough codes generated to match the number of leaves")

    leaves = get_leaves(root)
    for i in range(num_leaves):
        codebook.append({"Word": leaves[i].code, "Code": codes[i]})
    return {"encoding": codebook, "steps": steps}