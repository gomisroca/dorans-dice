# Generated by Django 4.2.9 on 2024-01-29 13:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gacha_main', '0002_rename_description_character_blurb'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='character',
            name='imasdf',
        ),
        migrations.RemoveField(
            model_name='item',
            name='stats',
        ),
        migrations.RemoveField(
            model_name='item',
            name='type',
        ),
        migrations.AddField(
            model_name='item',
            name='value',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
