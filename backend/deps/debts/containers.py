"""Containers module."""

from dependency_injector import containers, providers
import boto3
from botocore.client import Config

from .services import StorageService


class Container(containers.DeclarativeContainer):

    config = providers.Configuration()

    session = providers.Resource(
        boto3.session.Session,
        aws_access_key_id=config.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=config.AWS_ACCESS_SECRET_KEY,
    )
    bucket_client = providers.Resource(
        session.provided.client.call(),
        service_name="s3",
        endpoint_url=config.AWS_ENDPOINT_URL,
        config=Config(signature_version="s3v4"),
    )

    storage_service = providers.Factory(
        StorageService,
        bucket_client=bucket_client,
        bucket_name=config.BUCKET_NAME
    )
