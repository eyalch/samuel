# Generated by Django 3.0.2 on 2020-01-21 22:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dishes', '0007_auto_20200106_0126'),
    ]

    operations = [
        migrations.CreateModel(
            name='TodayOrder',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('dishes.order',),
        ),
    ]