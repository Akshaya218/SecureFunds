import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

def upload_to_s3(file_name, file_data, bucket_name='docums3bucket'):
    try:
        s3 = boto3.client('s3')

        # Log the file name and size before upload
        print(f"Uploading file '{file_name}' to bucket '{bucket_name}'")
        print(f"File size: {len(file_data)} bytes")

        response = s3.put_object(Bucket=bucket_name, Key=file_name, Body=file_data)

        # Log S3 response
        print(f"S3 Response: {response}")
        
        # Check if the response indicates success
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            print(f"File '{file_name}' uploaded successfully.")
            return f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
        else:
            print(f"Failed to upload file '{file_name}'. S3 responded with: {response}")
            return {"error": "Failed to upload to S3"}
    
    except NoCredentialsError:
        print("Error: AWS credentials not available.")
        return {"error": "AWS credentials not available"}
    
    except PartialCredentialsError:
        print("Error: Incomplete AWS credentials.")
        return {"error": "Incomplete AWS credentials"}
    
    except Exception as e:
        print(f"Failed to upload to S3: {str(e)}")
        return {"error": "Failed to upload to S3"}
