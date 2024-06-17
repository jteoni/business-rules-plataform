from django.test import TestCase
from unittest.mock import Mock
from debts.services import StorageService

# Test case for StorageService class
class TestStorageService(TestCase):
    def setUp(self):
        # Initialize test data
        self.bucket_name = 'test-bucket'
        self.file_name = 'test_file.txt'
        self.expiration = 3600
        self.bucket_client = Mock()  # Mocking the bucket client
        self.storage_service = StorageService(self.bucket_client, self.bucket_name)  # Creating instance of StorageService

    # Test method for generating presigned upload URL
    def test_generate_presigned_upload_url(self):
        expected_upload_url = 'http://presigned.upload.url'
        self.bucket_client.generate_presigned_url.return_value = expected_upload_url  # Mocking the return value of generate_presigned_url

        # Calling the method under test
        upload_url, path = self.storage_service.generate_presigned_upload_url(self.file_name, self.expiration)

        # Assertions
        self.bucket_client.generate_presigned_url.assert_called_once_with(
            'put_object',
            Params={'Bucket': self.bucket_name, 'Key': path},
            ExpiresIn=self.expiration
        )  # Checking if generate_presigned_url was called correctly

        self.assertEqual(upload_url, expected_upload_url)  # Checking if returned upload_url matches expected_upload_url
        self.assertTrue(path.endswith(self.file_name))  # Checking if the generated path ends with the file name

    # Test method for generating presigned download URL
    def test_generate_presigned_download_url(self):
        expected_download_url = 'http://presigned.download.url'
        self.bucket_client.generate_presigned_url.return_value = expected_download_url  # Mocking the return value of generate_presigned_url

        # Calling the method under test
        download_url = self.storage_service.generate_presigned_download_url(self.file_name, self.expiration)

        # Assertions
        self.bucket_client.generate_presigned_url.assert_called_once_with(
            'get_object',
            Params={'Bucket': self.bucket_name, 'Key': self.file_name},
            ExpiresIn=self.expiration
        )  # Checking if generate_presigned_url was called correctly

        self.assertEqual(download_url, expected_download_url)  # Checking if returned download_url matches expected_download_url
