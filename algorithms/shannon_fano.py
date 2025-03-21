import numpy as np
import math

def shannon_fano(symbols, probabilities):
    items = list(zip(symbols, probabilities))
    items.sort(key=lambda x: x[1], reverse=True)

    codes = {symbol: "" for symbol, _ in items}
    steps = []

    def get_entropy(probabilities,n):
        return (-sum(p * math.log2(p) for p in probabilities))/math.log2(n)

    def get_average_length(encoding, probabilities, symbols):
        sum = 0
        for i in range(len(probabilities)):
            sum += len(encoding[symbols[i]]) * probabilities[i]
        return sum

    def divide_and_assign(symbols_probs, depth=0):
        if len(symbols_probs) == 1:
            return

        total_prob = sum(prob for _, prob in symbols_probs)
        left_sum = 0
        min_diff = np.inf
        split_index = -1

        for i, (_, prob) in enumerate(symbols_probs[:-1]):
            left_sum += prob
            right_sum = total_prob - left_sum
            diff = abs(left_sum - right_sum)
            
            if diff <= min_diff:
                min_diff = diff
                split_index = i

        left = symbols_probs[:split_index + 1]
        right = symbols_probs[split_index + 1:]

        for symbol, _ in left:
            codes[symbol] += "0"
        for symbol, _ in right:
            codes[symbol] += "1"

        steps.append({
            "depth": depth,
            "left": [s for s, _ in left],
            "right": [s for s, _ in right],
            "codes": dict(codes)
        })


        divide_and_assign(left, depth + 1)
        divide_and_assign(right, depth + 1)

    divide_and_assign(items)
    entropy = get_entropy(probabilities,2)
    average_length = get_average_length(codes, probabilities, symbols)
    efficiency = entropy / average_length
    return {"encoding": codes, "steps": steps, "entropy": entropy, "average_length": average_length, "efficiency": efficiency}

