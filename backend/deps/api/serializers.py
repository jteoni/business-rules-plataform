from django.db.models import fields
from rest_framework import serializers
from debts.models import File


class FileSerializer(serializers.ModelSerializer):
    path = serializers.CharField(required=False)
    class Meta:
        model = File
        fields = ('name', 'type', 'path')

class FileSerializerResponse(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ('name', 'type', 'created_at', 'path', 'id')

