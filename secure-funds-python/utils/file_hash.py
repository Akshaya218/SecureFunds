import hashlib

def generate_file_hash(file_content: bytes):
    return hashlib.sha256(file_content).hexdigest()
