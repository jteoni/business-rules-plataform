from django.db.models import Model, CharField, DateTimeField


class File(Model):
    class Meta:
        app_label = 'debts'

    name = CharField(max_length=255)
    created_at = DateTimeField(auto_now_add=True)
    path = CharField(max_length=255)
    type = CharField(max_length=55, null=True, blank=True)

    def __str__(self) -> str:
            return self.name
