from uuid import uuid4

class StorageService:
    def __init__(self, bucket_client, bucket_name):
        self.bucket_client = bucket_client
        self.bucket_name = bucket_name

    def generate_presigned_upload_url(self, file_name, expiration=3600):
        path = f'{uuid4()}_{file_name}'
        upload_url = self.bucket_client.generate_presigned_url(
            'put_object',
            Params={'Bucket': self.bucket_name, 'Key': path},
            ExpiresIn=expiration
        )
        return upload_url, path

    def generate_presigned_download_url(self, file_name, expiration=3600):
        download_url = self.bucket_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': self.bucket_name, 'Key': file_name},
            ExpiresIn=expiration
        )
        return download_url
    
    def get_file(self, file_path):
        return self.bucket_client.get_object(Bucket=self.bucket_name, Key=file_path)['Body']
