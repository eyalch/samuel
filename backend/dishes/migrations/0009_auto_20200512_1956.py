# Generated by Django 3.0.6 on 2020-05-12 19:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dishes', '0008_todayorder'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='scheduleddish',
            options={'ordering': ['dish'], 'verbose_name_plural': 'scheduled dishes'},
        ),
    ]
