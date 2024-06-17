from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch
from debts.models import File
from api import container

# Test case for testing the FilesView API endpoints
class FilesViewTests(APITestCase):
    def setUp(self):
        # Setting up initial data for tests, such as creating a test file instance in the database
        File.objects.create(name='test_file.txt', path='path/to/test_file.txt')

    @patch('api.views.StorageService')
    def test_create_file(self, mock_storage_service):
        # Mocking the StorageService to return a simulated presigned upload URL
        mock_storage_service.generate_presigned_upload_url.return_value = ('http://presigned.url', 'path/to/file')
        with container.storage_service.override(mock_storage_service):
            url = reverse('files')  # Generating the URL for 'files' endpoint
            data = {'name': 'new_file.txt'}  # Data for creating a new file
            response = self.client.post(url, data, format='json')  # Making POST request to create a new file
            mock_storage_service.generate_presigned_upload_url.assert_called_once_with('new_file.txt')  # Checking if StorageService method was called correctly
            self.assertEqual(response.status_code, status.HTTP_200_OK)  # Asserting that response status is 200 OK
            self.assertIn('upload_url', response.data)  # Checking if 'upload_url' is present in response data
            self.assertEqual(File.objects.count(), 2)  # Asserting that number of files in database has increased to 2

    def test_create_file_without_name(self):
        # Testing creation of file without providing a name
        url = reverse('files')  # Generating the URL for 'files' endpoint
        data = {}  # Data without file name
        response = self.client.post(url, data, format='json')  # Making POST request without file name
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  # Asserting that response status is 400 BAD REQUEST

    def test_list_files(self):
        # Testing listing of files
        url = reverse('files')  # Generating the URL for 'files' endpoint
        response = self.client.get(url)  # Making GET request to retrieve list of files

        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Asserting that response status is 200 OK
        self.assertEqual(len(response.data), 1)  # Assuming there is only 1 file created in setUp

# Test case for testing the FileView API endpoints
class FileViewTests(APITestCase):
    def setUp(self):
        # Setting up initial data for tests
        self.file = File.objects.create(name='test_file.txt', path='test_file.txt')

    @patch('api.views.StorageService')
    def test_get_file(self, mock_storage_service):
        # Mocking the StorageService to return a simulated presigned download URL
        mock_storage_service.generate_presigned_download_url.return_value = 'http://download.presigned.url'
        with container.storage_service.override(mock_storage_service):
            url = reverse('file', kwargs={'file_path': self.file.path})  # Generating the URL for 'file' endpoint with file path as a parameter
            response = self.client.get(url)  # Making GET request to retrieve file details
            mock_storage_service.generate_presigned_download_url.assert_called_once_with(self.file.path)  # Checking if StorageService method was called correctly
            self.assertEqual(response.status_code, status.HTTP_200_OK)  # Asserting that response status is 200 OK
            self.assertIn('download_url', response.data)  # Checking if 'download_url' is present in response data
            self.assertEqual(response.data['download_url'], 'http://download.presigned.url')  # Asserting the value of 'download_url' in response
