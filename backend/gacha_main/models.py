from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import ArrayField
import re

CLEANR = re.compile('<.*?>') 
def validate_clean(value: str):
    cleantext = re.sub(CLEANR, '', value)
    return cleantext

class Item(models.Model):
    riot_id = models.IntegerField()
    name = models.CharField(max_length=120)
    description = models.TextField()
    image = models.TextField()
    purchase_value = models.IntegerField()
    total_value = models.IntegerField()
    from_items = ArrayField(models.TextField(), blank=True, null=True)
    into_items = ArrayField(models.TextField(), blank=True, null=True)
    chance = models.DecimalField(max_digits=5, decimal_places=3)

    def __str__(self):
        return f"{self.name} - {self.chance}"
    
    def save(self, *args, **kwargs):
        self.name = validate_clean(self.name)
        self.description = validate_clean(self.description)
        super(Item, self).save(*args, **kwargs)

class Character(models.Model):
    name = models.CharField(max_length=120)
    blurb = models.TextField()
    image_centered = models.TextField()
    image_loading = models.TextField()
    image_tile = models.TextField()
    chance = models.DecimalField(max_digits=5, decimal_places=3)
    hp = models.FloatField(default=0.0)
    hpperlevel = models.FloatField(default=0.0)
    mp = models.FloatField(default=0.0)
    mpperlevel = models.FloatField(default=0.0)
    movespeed = models.FloatField(default=0.0)
    armor = models.FloatField(default=0.0)
    armorperlevel = models.FloatField(default=0.0)
    spellblock = models.FloatField(default=0.0)
    spellblockperlevel = models.FloatField(default=0.0)
    attackrange = models.FloatField(default=0.0)
    hpregen = models.FloatField(default=0.0)
    hpregenperlevel = models.FloatField(default=0.0)
    mpregen = models.FloatField(default=0.0)
    mpregenperlevel = models.FloatField(default=0.0)
    crit = models.FloatField(default=0.0)
    critperlevel = models.FloatField(default=0.0)
    attackdamage = models.FloatField(default=0.0)
    attackdamageperlevel = models.FloatField(default=0.0)
    attackspeedperlevel = models.FloatField(default=0.0)
    attackspeed = models.FloatField(default=0.0)
    skins = ArrayField(models.TextField(), blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} - {self.chance}"