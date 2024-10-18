from flask import request
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from encryption.aes_encrypt import encrypt_file, decrypt_file
import boto3
import os
from aws.s3_upload import upload_to_s3

ALLOWED_EXTENSIONS = {'docx', 'doc', 'pdf', 'txt'}  # Add other allowed types as needed

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# AES Encryption
def encrypt_file(file_data, key):
    iv = os.urandom(16) 
    cipher = Cipher(algorithms.AES(key), modes.GCM(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(file_data) + encryptor.finalize()
    return iv, ciphertext, encryptor.tag

# # AWS S3 Upload
# def upload_to_s3(file_name, file_data):
#     try:
#       s3 = boto3.client('s3')
#       bucket_name = 'docums3bucket'
#       s3.put_object(Bucket=bucket_name, Key=file_name, Body=file_data)
#       return f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
#     except Exception as e:
#         print(f"Failed to upload to S3: {str(e)}")
#         return {"error": "Failed to upload to S3"}


# Service to handle file encryption and upload
def encrypt_upload():
    print("upload endpoint hit!")
    
    if 'file' not in request.files:
        return {'error': 'No file part'}, 400

    file = request.files['file']
    
    if file.filename == '':
        return {'error': 'No selected file'}, 400
    
    if not allowed_file(file.filename):
        return {'error': 'File type not allowed'}, 400  # Reject unsupported file types
    
    file_data = file.read()
    print(f"File size: {len(file_data)} bytes")  # Log the size of the file data
    key = os.urandom(32)  # Generate a random 256-bit key
    iv, ciphertext,tag = encrypt_file(file_data, key)

    print(f"Encryption Key: {key.hex()}")
    print(f"IV: {iv.hex()}")
    print(f"Ciphertext (First 100 bytes): {ciphertext[:100].hex()}")
    
    # Upload encrypted file to S3
    s3_url = upload_to_s3(file.filename, ciphertext,'docums3bucket')
    
    return {
        's3_url': s3_url,
        'encryption_key': key.hex(),  # Return key in a readable format
        'iv': iv.hex(),  # Return IV for decryption later
        'tag': tag.hex()
    }


def decrypt_uploaded_file(iv_hex, ciphertext_hex, key_hex, tag_hex):
    iv = bytes.fromhex(iv_hex)  # Convert IV from hex to bytes
    ciphertext = bytes.fromhex(ciphertext_hex)  # Convert ciphertext from hex to bytes
    key = bytes.fromhex(key_hex)  # Convert key from hex to bytes
    tag = bytes.fromhex(tag_hex)
    
    decrypted_data = decrypt_file(iv, ciphertext, key, tag)
    print(f"Decrypted Data Size: {len(decrypted_data)} bytes") 
    return decrypted_data

def decrypt_file(iv, ciphertext, key, tag):
    # Create a cipher object using the provided key and IV
    cipher = Cipher(algorithms.AES(key), modes.GCM(iv, tag), backend=default_backend())
    decryptor = cipher.decryptor()
    
    # Decrypt the ciphertext
    decrypted_data = decryptor.update(ciphertext) + decryptor.finalize()
    return decrypted_data  # Return the decrypted data

def download_and_decrypt(file_name, key_hex, iv_hex):
    # Download file from S3
    s3 = boto3.client('s3')
    bucket_name = 'docums3bucket'
    try:
        encrypted_data = s3.get_object(Bucket=bucket_name, Key=file_name)['Body'].read()
        print(f"Downloaded {file_name} from S3.")
    except Exception as e:
        print(f"Failed to download file from S3: {str(e)}")
        return {"error": "Failed to download from S3"}

    # Convert hex to bytes
    key = bytes.fromhex(key_hex)
    iv = bytes.fromhex(iv_hex)

    # Decrypt the data
    decrypted_data = decrypt_file(iv, encrypted_data, key)

    return decrypted_data  # Return decrypted data or handle it as needed