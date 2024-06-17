from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch
from debts.models import File
from api import container

class FilesViewTests(APITestCase):
    def setUp(self):
        # Preparação para os testes, como criar instâncias de teste no banco de dados, se necessário.
        File.objects.create(name='test_file.txt', path='path/to/test_file.txt')

    @patch('api.views.StorageService')
    def test_create_file(self, mock_storage_service):
        mock_storage_service.generate_presigned_upload_url.return_value = ('http://presigned.url', 'path/to/file')
        with container.storage_service.override(mock_storage_service):
            url = reverse('files')
            data = {'name': 'new_file.txt'}
            response = self.client.post(url, data, format='json')
            mock_storage_service.generate_presigned_upload_url.assert_called_once_with('new_file.txt')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn('upload_url', response.data)
            self.assertEqual(File.objects.count(), 2)

    def test_create_file_without_name(self):
        url = reverse('files')
        data = {}  # Dados sem nome de arquivo
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_files(self):
        url = reverse('files')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Supondo que existe apenas 1 arquivo no setUp


class FileViewTests(APITestCase):
    def setUp(self):
        # Preparação para os testes
        self.file = File.objects.create(name='test_file.txt', path='test_file.txt')

    @patch('api.views.StorageService')
    def test_get_file(self, mock_storage_service):
        # Mock do StorageService para retornar uma URL presignada simulada para download
        mock_storage_service.generate_presigned_download_url.return_value = 'http://download.presigned.url'
        with container.storage_service.override(mock_storage_service):
            url = reverse('file', kwargs={'file_path': self.file.path})
            response = self.client.get(url)
            mock_storage_service.generate_presigned_download_url.assert_called_once_with(self.file.path)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn('download_url', response.data)
            self.assertEqual(response.data['download_url'], 'http://download.presigned.url')
