from django.db.models import fields
from rest_framework import serializers
from debts.models import File

# Serializer for handling file data during file upload
class FileSerializer(serializers.ModelSerializer):
    path = serializers.CharField(required=False)  # Optional field for file path

    class Meta:
        model = File
        fields = ('name', 'type', 'path')  # Fields to include in the serializer

# Serializer for formatting file data in API responses
class FileSerializerResponse(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ('name', 'type', 'created_at', 'path', 'id')
