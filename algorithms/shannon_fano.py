import numpy as np

def shannon_fano(symbols, probabilities):
    """ Recursively divide symbols into two groups with approximately equal probability sum. """
    if len(symbols) == 1:
        return {symbols[0]: ""}

    sorted_indices = np.argsort(probabilities)[::-1]
    symbols = [symbols[i] for i in sorted_indices]
    probabilities = [probabilities[i] for i in sorted_indices]

    total = sum(probabilities)
    split_index = 0
    sum1, sum2 = 0, total
    for i in range(len(probabilities)):
        sum1 += probabilities[i]
        sum2 -= probabilities[i]
        if sum1 >= sum2:
            split_index = i
            break

    left = shannon_fano(symbols[:split_index + 1], probabilities[:split_index + 1])
    right = shannon_fano(symbols[split_index + 1:], probabilities[split_index + 1:])

    for key in left:
        left[key] = "0" + left[key]
    for key in right:
        right[key] = "1" + right[key]

    return {**left, **right}
