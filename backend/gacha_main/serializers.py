from rest_framework import serializers
from .models import Item, Character

class ItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'riot_id', 'name', 'description', 'image', 'purchase_value', 'total_value', 'from_items', 'into_items', 'chance')
        
    # def validate_name(self, value):
    #     if value['not_valid']:
    #         raise serializers.ValidationError("Not valid")
    #     return value
        
class CharacterSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Character
        fields = ('id', 'name', 'blurb', 'image_centered', 'image_loading', 'image_tile', 'chance', 'hp', 'hpperlevel', 'mp', 'mpperlevel', 'movespeed', 'armor', 'armorperlevel', 'spellblock', 'spellblockperlevel', 'attackrange', 'hpregen', 'hpregenperlevel', 'mpregen', 'mpregenperlevel', 'crit', 'critperlevel', 'attackdamage', 'attackdamageperlevel', 'attackspeed', 'attackspeedperlevel', 'skins')