import hashlib

# Define a list of input values to hash
inputs = []
for i in range(11111111,100000000):
    inputs.append(str(i))

# Compute the SHA-512 hash for each input and store in a lookup table
hash_table = {}
for input in inputs:
    print(input)
    hash = hashlib.sha512(input.encode()).hexdigest()
    hash_table[input] = hash