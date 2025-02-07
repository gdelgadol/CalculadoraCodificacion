import math
from heapq import heappush, heappop

class TunstallNode:
    def __init__(self, probability, code=""):
        self.probability = probability
        self.children = []
        self.code = code

    def __lt__(self, other):
        return self.probability > other.probability
    
def get_entropy(probabilities,n):
        return (-sum(p * math.log2(p) for p in probabilities))/math.log2(n)

def get_average_length(encoding, probabilities, symbols):
        sum = 0
        for i in range(len(probabilities)):
            sum += len(encoding[symbols[i]]) * probabilities[i]
        return sum

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

    while iterations > 0:
        _, node = heappop(heap) 

        new_children = []
        for j in range(len(symbols)):
            child_prob = probabilities[j] * (node.probability)
            child = TunstallNode(child_prob, code=node.code + str(symbols[j]))
            node.children.append(child)
            new_children.append(child)
            heappush(heap, (-child.probability, child))
        steps.append({"expanded": node.code, "new_nodes": new_children})
        iterations -= 1


    alphabet = [str(i) for i in range(n)]
    codes = []
    queue = [""] 

    while queue:
        current = queue.pop(0)

        if len(current) == length:
            codes.append(current)

            if len(codes) >= num_leaves:
                break
        else:
            for digit in alphabet:
                queue.append(current + digit)

    leaves = get_leaves(root)
    for i in range(num_leaves):
        codebook.append({"Word": leaves[i].code, "Code": codes[i]})

    entropy = get_entropy(probabilities,n)

    return {"encoding": codebook, "steps": steps, "entropy": entropy}