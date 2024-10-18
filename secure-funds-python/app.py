from flask import Flask, jsonify, request, make_response  # type: ignore
from services.encryption_Service import encrypt_upload, decrypt_uploaded_file
import os

app = Flask(__name__)

# Upload folder configuration
UPLOAD_FOLDER = 'D:/SecureFunds/uploads'  # Set to a valid directory path on your system

# Ensure the directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Main route for the homepage
@app.route('/')
def home():
    return "Welcome to the Secure Funds Encryption API. Use /upload to upload files."

# Upload route
@app.route('/upload', methods=['POST'])
def upload_file():
    response = encrypt_upload()  # Call the encryption and upload service
    return jsonify(response), 200 if 's3_url' in response else 400

    # if 'file' not in request.files:
    #     return jsonify({'error': 'No file part in the request'}), 400
    
    # file = request.files['file']
    
    # if file.filename == '':
    #     return jsonify({'error': 'No file selected'}), 400
    
    # # Save file to upload folder
    # file.save(os.path.join(UPLOAD_FOLDER, file.filename))
    
    # # Return success response (You can replace this with actual S3 URL if using AWS S3)
    # return jsonify({'message': 'File uploaded successfully', 's3_url': 'https://example.com/' + file.filename}), 200

# Ping route for checking server health
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'Server is running'}), 200

# Decrypt route
@app.route('/decrypt', methods=['POST'])
def decrypt_file_route():
    try:
        data = request.json
        iv_hex = data.get('iv')
        ciphertext_hex = data.get('ciphertext')
        key_hex = data.get('key')
        
        if not iv_hex or not ciphertext_hex or not key_hex:
            return jsonify({'error': 'Missing IV, ciphertext, or key'}), 400
        
        # Decrypt the file
        decrypted_data = decrypt_uploaded_file(iv_hex, ciphertext_hex, key_hex)
        
        return jsonify({'decrypted_data': decrypted_data.decode()})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/download/<file_name>', methods=['GET'])
def download_file(file_name):
    # Get the encryption key and IV from your storage (database, file, etc.)
    key_hex = request.args.get('key')  # Assume you pass the key as a query parameter
    iv_hex = request.args.get('iv')  # Pass IV as a query parameter

    decrypted_data = download_and_decrypt(file_name, key_hex, iv_hex)
    
    if isinstance(decrypted_data, dict) and 'error' in decrypted_data:
        return jsonify(decrypted_data), 400

    return jsonify({'decrypted_data': decrypted_data.decode()}), 200

# Ensure the server is started only once
if __name__ == '__main__':
    app.run(debug=True,port=5002)
