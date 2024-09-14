# Generated by Django 5.0.8 on 2024-08-17 04:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0004_alter_post_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='status',
            field=models.CharField(choices=[('Public', 'Public'), ('Hidden', 'Hidden'), ('Banned', 'Banned')], default='Draft', max_length=15),
        ),
    ]
