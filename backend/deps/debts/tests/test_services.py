from django.test import TestCase
from unittest.mock import Mock
from debts.services import StorageService


class TestStorageService(TestCase):
    def setUp(self):
        self.bucket_name = 'test-bucket'
        self.file_name = 'test_file.txt'
        self.expiration = 3600
        self.bucket_client = Mock()
        self.storage_service = StorageService(self.bucket_client, self.bucket_name)

    def test_generate_presigned_upload_url(self):
        expected_upload_url = 'http://presigned.upload.url'
        self.bucket_client.generate_presigned_url.return_value = expected_upload_url

        upload_url, path = self.storage_service.generate_presigned_upload_url(self.file_name, self.expiration)

        self.bucket_client.generate_presigned_url.assert_called_once_with(
            'put_object',
            Params={'Bucket': self.bucket_name, 'Key': path},
            ExpiresIn=self.expiration
        )

        self.assertEqual(upload_url, expected_upload_url)
        self.assertTrue(path.endswith(self.file_name))

    def test_generate_presigned_download_url(self):
        expected_download_url = 'http://presigned.download.url'
        self.bucket_client.generate_presigned_url.return_value = expected_download_url
        download_url = self.storage_service.generate_presigned_download_url(self.file_name, self.expiration)

        self.bucket_client.generate_presigned_url.assert_called_once_with(
            'get_object',
            Params={'Bucket': self.bucket_name, 'Key': self.file_name},
            ExpiresIn=self.expiration
        )

        self.assertEqual(download_url, expected_download_url)
