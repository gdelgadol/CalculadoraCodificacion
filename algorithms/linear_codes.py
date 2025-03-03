import galois
import numpy as np

def max_detection(minimum_weight):
    return (minimum_weight - 1)

def max_correction(minimum_weight):
    return (minimum_weight - 1) // 2

def generate_codes(P, n, gen_matrix_raw):
    D_big = P**n
    GF = galois.GF(P**n)
    gen_matrix = GF(gen_matrix_raw).row_reduce()
    print(gen_matrix)

    k, n = gen_matrix.shape
    r = n - k
    P = gen_matrix[:, k:]
    P_transpose = P.T
    neg_P_transpose = -P_transpose
    identity_r = np.eye(r, dtype=int)
    H = np.hstack((neg_P_transpose, identity_r))
    H = GF(H)
    print(H)

    codes = []
    min_weight = float('inf')
    z_concise = [GF(list(con)) for con in np.ndindex((D_big,) * len(gen_matrix))]
    for z in z_concise:
        z_con = z.tolist()
        codeword = z @ gen_matrix
        weight = sum([1 for i in codeword if i != 0])
        if weight < min_weight and weight != 0:
            min_weight = weight
        codeword.tolist()
        codes.append({"z_con": str(z_con), "codeword": str(codeword), "weight": str(weight)})
    max_detect = max_detection(min_weight)
    max_correct = max_correction(min_weight)
    return {
            "codes": codes, 
            "min_weight": min_weight, 
            "max_detect": max_detect, 
            "max_correct": max_correct,
            "sis_matrix": gen_matrix.tolist(),
            "H_matrix": H.tolist()
            }


    


    
    
    