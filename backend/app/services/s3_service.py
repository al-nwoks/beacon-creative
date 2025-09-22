import logging
import uuid
from typing import Optional
from fastapi import HTTPException, status
import boto3
from botocore.exceptions import ClientError
import os

logger = logging.getLogger(__name__)

class S3Service:
    def __init__(self):
        self.client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION'),
            endpoint_url=os.getenv('AWS_S3_ENDPOINT_URL')
        )
        self.bucket_name = os.getenv('AWS_S3_BUCKET_NAME')

    async def upload_file(self, file_content: bytes, file_name: str, content_type: str) -> str:
        """
        Upload a file to S3 and return the public URL
        """
        try:
            # Generate unique filename
            file_ext = os.path.splitext(file_name)[1]
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            
            # Upload file
            self.client.put_object(
                Bucket=self.bucket_name,
                Key=unique_filename,
                Body=file_content,
                ContentType=content_type,
                ACL='public-read'  # Adjust based on your security requirements
            )
            
            # Generate public URL
            if os.getenv('AWS_S3_ENDPOINT_URL'):
                url = f"{os.getenv('AWS_S3_ENDPOINT_URL')}/{self.bucket_name}/{unique_filename}"
            else:
                url = f"https://{self.bucket_name}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{unique_filename}"
            
            logger.info(f"File uploaded successfully to {url}")
            return url
            
        except ClientError as e:
            logger.error(f"Failed to upload file to S3: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload file"
            )
        except Exception as e:
            logger.error(f"Unexpected error uploading file: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="File upload failed"
            )

    async def delete_file(self, file_url: str) -> bool:
        """
        Delete a file from S3
        """
        try:
            # Extract key from URL
            key = file_url.split('/')[-1]
            self.client.delete_object(
                Bucket=self.bucket_name,
                Key=key
            )
            logger.info(f"File deleted successfully: {file_url}")
            return True
        except ClientError as e:
            logger.error(f"Failed to delete file from S3: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error deleting file: {str(e)}")
            return False