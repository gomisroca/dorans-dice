from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from gacha_main.models import Character, Item

class TeamCharacter(models.Model):
    id = models.AutoField(primary_key=True)
    character = models.ForeignKey(Character, on_delete=models.CASCADE)
    items = models.ManyToManyField(Item, blank=True)
    
    def get_items(self):
        return ", ".join([item.name for item in self.items.all()])
    get_items.short_description = 'Items'
    
    def __str__(self):
        return f"{self.character.name} ({self.items.count()} items)"

class Team(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    active = models.BooleanField(default=False)
    characters = models.ManyToManyField(TeamCharacter, blank=True)

    def get_characters(self):
        return ", ".join([str(character) for character in self.characters.all()])
    get_characters.short_description = 'Characters'
    
    def __str__(self) -> str:
        return self.name
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.CharField(blank=True)
    characters = models.ManyToManyField(Character, blank=True)
    items = models.ManyToManyField(Item, blank=True)
    teams = models.ManyToManyField(Team, blank=True)
    blue_essence = models.PositiveIntegerField(default=0)
    orange_essence = models.PositiveIntegerField(default=0)
    token_character_basic = models.PositiveIntegerField(default=0)
    token_character_plus = models.PositiveIntegerField(default=0)
    token_character_premium = models.PositiveIntegerField(default=0)
    token_item_basic = models.PositiveIntegerField(default=0)
    token_item_plus = models.PositiveIntegerField(default=0)
    token_item_premium = models.PositiveIntegerField(default=0)
    
    def get_characters(self):
        return ", ".join([character.name for character in self.characters.all()])
    
    def get_items(self):
        return ", ".join([item.name for item in self.items.all()])    
    def get_teams(self):
        return ", ".join([str(team) for team in self.teams.all()])
    
    get_teams.short_description = 'Teams'
    get_characters.short_description = 'Owned Champions'
    get_items.short_description = 'Owned Items'
    
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
