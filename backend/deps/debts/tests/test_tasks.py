import csv
from unittest import TestCase, mock
from celery import shared_task
from django.core.mail import send_mass_mail
from debts.services import StorageService
from debts.containers import Container
from time import sleep
from debts.tasks import send_batch_emails
from dependency_injector.wiring import inject, Provide

class TestSendBatchEmails(TestCase):
    @mock.patch('debts.services.StorageService')
    @mock.patch('django.core.mail.send_mass_mail')
    def test_send_batch_emails(self, mock_send_mass_mail, mock_storage_service):
        # Mock the storage service
        mock_file = mock.MagicMock()
        mock_file.__enter__.return_value = mock_file
        mock_file.__exit__.return_value = None
        mock_reader = csv.reader(['name,email,debtAmount,debtDueDate\nJohn Doe,johndoe@example.com,100,2022-01-01'])
        mock_file.return_value = mock_reader
        mock_storage_service.return_value.get_file.return_value = mock_file

        # Call the task
        send_batch_emails('/path/to/file.csv')

        # Assert that the storage service was called with the correct path
        mock_storage_service.return_value.get_file.assert_called_once_with('/path/to/file.csv')

        # Assert that send_mass_mail was called with the correct arguments
        mock_send_mass_mail.assert_called_once_with((
            ("Boleto disponível", "Olá John Doe!\nSeu boleto no valor de $100 com vencimento em 2022-01-01 está disponível.", "from@example.com", ["johndoe@example.com"]),
        ), fail_silently=False)