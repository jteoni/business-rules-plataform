from django.test import TestCase
from django.utils import timezone
from debts.models import File

class FileModelTest(TestCase):

    def setUp(self):
        # Setup run before every test method.
        self.file = File.objects.create(
            name='Test File',
            path='/path/to/file',
            type='text/plain'
        )

    def test_file_creation(self):
        # Test the file object is created successfully.
        self.assertTrue(isinstance(self.file, File))
        self.assertEqual(self.file.__str__(), 'Test File')

    def test_file_fields(self):
        # Test the field values of the created object.
        self.assertEqual(self.file.name, 'Test File')
        self.assertEqual(self.file.path, '/path/to/file')
        self.assertEqual(self.file.type, 'text/plain')
        # Check if `created_at` is approximately now, allowing a small delta for test execution time.
        self.assertTrue(timezone.now() - self.file.created_at < timezone.timedelta(seconds=1))

    def test_file_type_nullable(self):
        # Test that the `type` field can be null.
        file_without_type = File.objects.create(
            name='File Without Type',
            path='/path/no/type'
        )
        self.assertIsNone(file_without_type.type)

    def test_name_max_length(self):
        # Test if the `name` field enforces its max_length constraint.
        long_name = 'a' * 256  # 256 characters
        with self.assertRaises(Exception):
            File.objects.create(name=long_name, path='/path/to/long/name/file')

    def test_path_max_length(self):
        # Test if the `path` field enforces its max_length constraint.
        long_path = 'a' * 256  # 256 characters
        with self.assertRaises(Exception):
            File.objects.create(name='Long Path File', path=long_path)

    def test_type_max_length(self):
        # Test if the `type` field enforces its max_length constraint.
        long_type = 'a' * 56  # 56 characters
        with self.assertRaises(Exception):
            File.objects.create(name='Long Type File', path='/path/to/long/type', type=long_type)

    def test_file_update(self):
        # Test updating an existing file's name.
        self.file.name = 'Updated Test File'
        self.file.save()
        updated_file = File.objects.get(id=self.file.id)
        self.assertEqual(updated_file.name, 'Updated Test File')

    def test_file_deletion(self):
        # Test the deletion of a file.
        file_id = self.file.id
        self.file.delete()
        with self.assertRaises(File.DoesNotExist):
            File.objects.get(id=file_id)