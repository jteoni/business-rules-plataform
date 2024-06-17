from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from dependency_injector.wiring import inject, Provide

# Importing necessary components from custom modules
from debts.containers import Container
from debts.services import StorageService
from debts.models import File
from debts.tasks import send_batch_emails
from .serializers import FileSerializer, FileSerializerResponse

# View for handling operations related to multiple files
class FilesView(APIView):
    @inject  # Using dependency injection to inject StorageService
    def post(
            self,
            request,
            storage_service: StorageService = Provide[Container.storage_service],
        ):
        """
        Handle POST requests to upload a file.

        Validates the file data, generates a presigned URL for upload,
        sends batch emails asynchronously, and saves the file.

        Returns the presigned upload URL upon success.
        """
        file = FileSerializer(data=request.data)
        if file.is_valid():
            file_name = file.validated_data.get('name')
            upload_url, path = storage_service.generate_presigned_upload_url(file_name)
            send_batch_emails.apply_async(args=[path], countdown=30)
            file.save(path=path)
            return Response({'upload_url': upload_url })
        return Response(file.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """
        Handle GET requests to fetch all files.

        Retrieves all files from the database using File model,
        serializes them, and returns a response containing
        the list of files and their count.
        """
        files = File.objects.all()
        serializer = FileSerializerResponse(files, many=True)
        return Response({
            'files': serializer.data,
            'count': files.count(),
        })

# View for handling operations related to a single file
class FileView(APIView):
    @inject  # Using dependency injection to inject StorageService
    def get(
        self,
        request,
        file_path,
        storage_service: StorageService = Provide[Container.storage_service],
    ):
        """
        Handle GET requests to download a file.

        Generates a presigned URL for downloading the specified file
        and returns the download URL in the response.
        """
        file = storage_service.generate_presigned_download_url(file_path)
        return Response({'download_url': file })
