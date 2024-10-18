from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os

# AES Encryption
def encrypt_file(file_data, key):
    iv = os.urandom(16)  # Generate a random IV (16 bytes for AES)
    cipher = Cipher(algorithms.AES(key), modes.GCM(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(file_data) + encryptor.finalize()
    return iv, ciphertext,encryptor.tag   # Return IV and ciphertext

# AES Decryption
def decrypt_file(iv, ciphertext, key,tag):
    cipher = Cipher(algorithms.AES(key), modes.GCM(iv,tag), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_data = decryptor.update(ciphertext) + decryptor.finalize()
    return decrypted_data

# Example usage
if __name__ == "__main__":
    # Generate a random key (32 bytes for AES-256)
    key = os.urandom(32)
    
    # Sample data to encrypt
    data = b"Sensitive data that needs to be encrypted"
    
    # Encrypt the data
    iv, encrypted_data ,tag= encrypt_file(data, key)
    print(f"IV: {iv.hex()}")
    print(f"Encrypted: {encrypted_data.hex()}")
    print(f"Tag: {tag.hex()}")
    
    # Decrypt the data
    decrypted_data = decrypt_file(iv, encrypted_data, key, tag)
    print(f"Decrypted: {decrypted_data.decode()}")
