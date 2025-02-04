#Extraído de https://towardsdatascience.com/the-sardinas-patterson-algorithm-in-simple-python-9718242752c3/

def generate_cn(c, n):
    if n == 0:
        return set(c)
    else:
        # create a set to hold our new elements
        cn = set()

        # generate c_(n-1)
        cn_minus_1 = generate_cn(c, n-1)

        for u in c:
            for v in cn_minus_1:
                if (len(u) > len(v)) and u.find(v) == 0:
                    cn.add(u[len(v):])
        for u in cn_minus_1:
            for v in c:
                if len(u) > len(v) and u.find(v) == 0:
                    cn.add(u[len(v):])
        return cn

def generate_c_infinity(c):
    cs = []
    c_infinity = set()
    n = 1
    cn = generate_cn(c, n)
    print('c_{}'.format(n), cn)
    while len(cn) > 0:
        if cn in cs:
            print('Cycle detected. Halting algorithm.')
            break
        else:
            cs.append(cn)
            c_infinity = c_infinity.union(cn)
            n += 1
            cn = generate_cn(c, n)
            print('c_{}'.format(n), c_infinity)
    return c_infinity


def sardinas_patterson_theorem(c):
    c_infinity = generate_c_infinity(c)
    return len(c.intersection(c_infinity)) == 0
def check_decodability(c):
    if sardinas_patterson_theorem(c):
        print(c, 'is uniquely decodable')
    else:
        print(c, 'is not uniquely decodable')
