from django.contrib import admin
from .models import Item, Character

class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'chance')
    
class CharacterAdmin(admin.ModelAdmin):
    list_display = ('name', 'blurb', 'chance', 'skins')
    
admin.site.register(Item, ItemAdmin)
admin.site.register(Character, CharacterAdmin)