from django.contrib import admin
from .models import Profile, Team, TeamCharacter

class ProfileAdmin(admin.ModelAdmin):
    list_display = ( 'user', 'avatar', 'blue_essence', 'orange_essence', 'get_characters', 'get_items', 'get_teams')
    
admin.site.register(Profile, ProfileAdmin)

class TeamAdmin(admin.ModelAdmin):
    list_display = ( 'id', 'user', 'name', 'active', 'get_characters')
admin.site.register(Team, TeamAdmin)

class TeamCharacterAdmin(admin.ModelAdmin):
    list_display = ( 'id', 'character', 'get_items')
admin.site.register(TeamCharacter, TeamCharacterAdmin)