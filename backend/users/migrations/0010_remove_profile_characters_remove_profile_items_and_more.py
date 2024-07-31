# Generated by Django 4.2.9 on 2024-01-31 12:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gacha_main', '0005_alter_item_description_alter_item_name'),
        ('users', '0009_remove_profile_bio_remove_profile_birth_date_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='characters',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='items',
        ),
        migrations.AddField(
            model_name='profile',
            name='characters',
            field=models.ManyToManyField(to='gacha_main.character'),
        ),
        migrations.AddField(
            model_name='profile',
            name='items',
            field=models.ManyToManyField(to='gacha_main.item'),
        ),
    ]