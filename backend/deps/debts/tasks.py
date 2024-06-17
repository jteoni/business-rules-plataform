import csv
from celery import shared_task
from django.core.mail import send_mass_mail
from debts.services import StorageService
from debts.containers import Container
from time import sleep
from io import StringIO
from dependency_injector.wiring import inject, Provide
import pandas as pd


@shared_task
@inject
def send_batch_emails(
    path,
    storage_service: StorageService = Provide[Container.storage_service],
):
    file_url = storage_service.generate_presigned_download_url(path)
    df = pd.read_csv(file_url)
    df['message'] = (
        "Boleto disponível\n"
        "Olá " + df['name'] + "! "
        "Seu boleto no valor de $" + df['debtAmount'].astype(str) +
        " com vencimento em " + df['debtDueDate'].astype(str) + " está disponível."
    )
    messages = tuple(zip(
        ["Boleto disponível"] * len(df),
        df['message'],
        ["from@example.com"] * len(df),
        df['email'].apply(lambda x: [x]).tolist()
    ))

    send_mass_mail(messages, fail_silently=False)
