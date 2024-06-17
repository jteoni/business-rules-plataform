from django.urls import path
from api.views import FilesView, FileView


urlpatterns = [
    path('files', FilesView.as_view(), name='files'),
    path('files/<str:file_path>', FileView.as_view(), name='file'),
]
