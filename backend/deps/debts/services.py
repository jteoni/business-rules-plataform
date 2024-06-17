from uuid import uuid4

class StorageService:
    def __init__(self, bucket_client, bucket_name):
        """
        Initializes the StorageService with a bucket client and bucket name.

        :param bucket_client: The client for interacting with the storage bucket.
        :param bucket_name: The name of the storage bucket.
        """
        self.bucket_client = bucket_client
        self.bucket_name = bucket_name

    def generate_presigned_upload_url(self, file_name, expiration=3600):
        """
        Generates a presigned URL for uploading a file to the storage bucket.

        :param file_name: The name of the file to be uploaded.
        :param expiration: The expiration time (in seconds) for the presigned URL. Default is 3600 seconds (1 hour).
        :return: Tuple containing the presigned upload URL and the generated file path.
        """
        path = f'{uuid4()}_{file_name}'  # Generating a unique path for the file
        upload_url = self.bucket_client.generate_presigned_url(
            'put_object',
            Params={'Bucket': self.bucket_name, 'Key': path},
            ExpiresIn=expiration
        )  # Generating presigned URL for uploading the file
        return upload_url, path  # Returning the presigned upload URL and the generated file path

    def generate_presigned_download_url(self, file_name, expiration=3600):
        """
        Generates a presigned URL for downloading a file from the storage bucket.

        :param file_name: The name of the file to be downloaded.
        :param expiration: The expiration time (in seconds) for the presigned URL. Default is 3600 seconds (1 hour).
        :return: The presigned download URL.
        """
        download_url = self.bucket_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': self.bucket_name, 'Key': file_name},
            ExpiresIn=expiration
        )  # Generating presigned URL for downloading the file
        return download_url  # Returning the presigned download URL
    
    def get_file(self, file_path):
        """
        Retrieves a file object from the storage bucket.

        :param file_path: The path of the file to retrieve.
        :return: The file object.
        """
        return self.bucket_client.get_object(Bucket=self.bucket_name, Key=file_path)['Body']
