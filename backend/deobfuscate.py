import base64
from Crypto.Cipher import AES

def decrypt(encrypted_message, key):
    # Convert the key from string to bytes
    key = key.encode('utf-8')
    # Decode the base64-encoded message
    encrypted_message = base64.b64decode(encrypted_message)
    # Create an AES cipher object with 128-bit key size
    cipher = AES.new(key, AES.MODE_CBC, IV=b'0000000000000000')
    # Decrypt the message and remove padding
    decrypted_message = cipher.decrypt(encrypted_message).rstrip(b"\0")
    # Convert the decrypted message from bytes to string
    decrypted_message = decrypted_message.decode('utf-8')
    # Return the decrypted message
    return decrypted_message
