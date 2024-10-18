def file_to_hex(file_path):
    with open(file_path, 'rb') as f:  # Open the file in binary mode
        file_data = f.read()  # Read the file contents
    return file_data.hex()  # Convert bytes to hex string

# Example usage
if __name__ == "__main__":
    # Replace 'path_to_your_downloaded_file' with the actual path to your encrypted file
    hex_data = file_to_hex(r"C:\Users\HP\Downloads\2031004 BPM ASSIGNMENT 1.pdf")
    print(hex_data)  # This will print the hex string
