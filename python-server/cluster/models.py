from django.db import models

# Create your models here.

class Users(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'