import numpy as np

def shannon_fano(symbols, probabilities):
    """
    Shannon-Fano encoding function that records each step of the process.
    
    :param symbols: List of symbols
    :param probabilities: Corresponding probabilities
    :return: A dictionary with the final encoding and a list of steps
    """
    # Pair symbols with their probabilities and sort in descending order
    items = list(zip(symbols, probabilities))
    items.sort(key=lambda x: x[1], reverse=True)

    # Dictionary to store the final codes
    codes = {symbol: "" for symbol, _ in items}
    steps = []  # List to store step-by-step details

    def divide_and_assign(symbols_probs, depth=0):
        if len(symbols_probs) == 1:
            return

        # Compute the best split point
        total_prob = sum(p for _, p in symbols_probs)
        cumulative_prob = 0
        split_index = 0

        for i, (_, prob) in enumerate(symbols_probs):
            cumulative_prob += prob
            if cumulative_prob >= total_prob / 2:
                split_index = i
                break

        # Assign '0' to the left half and '1' to the right half
        left = symbols_probs[:split_index + 1]
        right = symbols_probs[split_index + 1:]

        for symbol, _ in left:
            codes[symbol] += "0"
        for symbol, _ in right:
            codes[symbol] += "1"

        # Store step information
        steps.append({
            "depth": depth,
            "left": [s for s, _ in left],
            "right": [s for s, _ in right],
            "codes": dict(codes)  # Copy to track changes over time
        })

        # Recursively divide the groups
        divide_and_assign(left, depth + 1)
        divide_and_assign(right, depth + 1)

    # Start the recursive division
    divide_and_assign(items)

    return {"encoding": codes, "steps": steps}

