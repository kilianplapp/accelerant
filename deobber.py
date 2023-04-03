input = input("Enter the accelerant string: ")

import base64
import json
def deobfuscate(obfuscated_str):
    key = "1KxIeFm2bC5xxEk89XGLVwRuDIRCqq0xlQRfYmiWkGXOPzFFsITZwp5RwMe6RWtn"
    result = ''
    decoded_str = base64.b64decode(obfuscated_str).decode('utf-8')
    for i in range(len(decoded_str)):
        key_char = key[i % len(key)]
        key_int = ord(key_char)
        result += chr(key_int ^ ord(decoded_str[i]))
    return result

accelerant = json.loads(deobfuscate(input))
print('\n')
with open('accelerant.json', 'w') as f:
    json.dump(accelerant, f, indent=4)
print(accelerant)