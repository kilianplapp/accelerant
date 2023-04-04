import base64

# def deobfuscate(obfuscated_str):
#     key = "1KxIeFm2bC5xxEk89XGLVwRuDIRCqq0xlQRfYmiWkGXOPzFFsITZwp5RwMe6RWtn"
#     result = ''
#     decoded_str = base64.b64decode(obfuscated_str).decode('utf-8')
#     for i in range(len(decoded_str)):
#         key_char = key[i % len(key)]
#         key_int = ord(key_char)
#         result += chr(key_int ^ ord(decoded_str[i]))
#     return result

from Crypto.PublicKey import RSA

def decrypt_with_keyfile(keyfile, encrypted_string):
    with open(keyfile, "rb") as keyfile:
        key = RSA.import_key(keyfile.read())
    encrypted_bytes = base64.b64decode(encrypted_string.encode())
    decrypted_bytes = key.decrypt(encrypted_bytes)
    return decrypted_bytes.decode()
