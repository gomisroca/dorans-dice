import json
import requests
import random
import re
import os

from django.http import Http404
from django.conf import settings
from django.db.models import Q
from django.contrib.auth import get_user_model
UserModel = get_user_model()

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .permissions import CanViewCharacters, CanViewItems
from .serializers import ItemSerializer, CharacterSerializer
from users.serializers import UserSerializer
from .models import Item, Character

CLEANR = re.compile('<.*?>')
SKINR = re.compile('(\d+)(?!.*\d)')

class ItemList(APIView):
    queryset = Item.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    
    def get(self, request, format=None):
        items = Item.objects.all()
        if not items:
            self.fill_data()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        items = Item.objects.all()
        if request.data not in items:
            serializer = ItemSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def fill_data(self):
        with open(f'{settings.MEDIA_ROOT}/items/item.json', encoding='utf8') as item_file:
            data = item_file.read()
        items = (json.loads(data))['data']
        for item, values in items.items():
            if values['gold']['purchasable'] == True:
                image_str = f'{settings.BASE_URL}{settings.MEDIA_URL}items/images/{item}.png'
                chance = round(random.uniform(0, 50), 3)
                
                basic_item = {
                    'riot_id': item,
                    'name': values['name'],
                    'description': values['plaintext'],
                    'image': image_str,
                    'from_items': None,
                    'into_items': None,
                    'purchase_value': values['gold']['base'],
                    'total_value': values['gold']['total'],
                    'chance': chance,
                }
                
                if "from" in values:
                    basic_item['from_items'] = values['from']
                if "into" in values:
                    basic_item['into_items'] = values['into']
                
                requests.post('http://127.0.0.1:8000/gacha/items/', basic_item)

class ItemDetail(APIView):
    def get_object(self, pk):
        try:
            return Item.objects.get(pk=pk)
        except Item.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        item = self.get_object(pk)
        serializer = ItemSerializer(item)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        item = self.get_object(pk)
        serializer = ItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        item = self.get_object(pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CharacterList(APIView):
    queryset = Character.objects.all()
    # permission_classes = [CanViewCharacters]
    parser_classes = (MultiPartParser, FormParser)
    
    def get(self, request, format=None):
        characters = Character.objects.all()
        if not characters:
            self.fill_data()
        serializer = CharacterSerializer(characters, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        characters = Character.objects.all()
        if request.data not in characters:
            serializer = CharacterSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def fill_data(self):
        skin_dir = f'{settings.MEDIA_ROOT}/champions/premium'
        with open(f'{settings.MEDIA_ROOT}/champions/champion.json', encoding='utf8') as character_file:
            data = character_file.read()
        champions = (json.loads(data))['data']
        for champion, values in champions.items():
            centered_str = f'{settings.BASE_URL}{settings.MEDIA_URL}champions/centered/{champion}_0.jpg'
            loading_str = f'{settings.BASE_URL}{settings.MEDIA_URL}champions/loading/{champion}_0.jpg'
            tile_str = f'{settings.BASE_URL}{settings.MEDIA_URL}champions/tiles/{champion}_0.jpg'
            chance = round(random.uniform(0, 50), 3)
            
            skins = []
            for skin in os.listdir(skin_dir):
                if champion in skin:
                    skins.append(f'{settings.BASE_URL}{settings.MEDIA_URL}champions/premium/{skin}')
                    
            basic_champion = {
                'name': champion,
                'blurb': values['blurb'],
                'image_centered': centered_str,
                'image_loading': loading_str,
                'image_tile': tile_str,
                'chance': chance,
                'hp': values['stats']['hp'],
                'hpperlevel': values['stats']['hpperlevel'],
                'mp': values['stats']['mp'],
                'mpperlevel': values['stats']['mpperlevel'],
                'movespeed': values['stats']['movespeed'],
                'armor': values['stats']['armor'],
                'armorperlevel': values['stats']['armorperlevel'],
                'spellblock': values['stats']['spellblock'],
                'spellblockperlevel': values['stats']['spellblockperlevel'],
                'attackrange': values['stats']['attackrange'],
                'hpregen': values['stats']['hpregen'],
                'hpregenperlevel': values['stats']['hpregenperlevel'],
                'mpregen': values['stats']['mpregen'],
                'mpregenperlevel': values['stats']['mpregenperlevel'],
                'crit': values['stats']['crit'],
                'critperlevel': values['stats']['critperlevel'],
                'attackdamage': values['stats']['attackdamage'],
                'attackdamageperlevel': values['stats']['attackdamageperlevel'],
                'attackspeedperlevel': values['stats']['attackspeedperlevel'],
                'attackspeed': values['stats']['attackspeed'],
                'skins': skins
            }
            
            requests.post('http://127.0.0.1:8000/gacha/characters/', basic_champion)

class CharacterRoll(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        user = UserModel.objects.get(pk=request.user.id)
        category = request.data['category']
        premium_roll = random.uniform(0, 100)
        premium = False
        
        if category == 0:
            user.profile.token_character_basic -= 1
            wanted_characters = Character.objects.filter(chance__gte = 25)
            for character in wanted_characters:
                character.chance = float(character.chance) * 1.5
            unwanted_characters = Character.objects.filter(chance__lt = 25)
            for character in unwanted_characters:
                character.chance = float(character.chance) * 0.5
            characters = wanted_characters | unwanted_characters
            if premium_roll >= 99.5:
                premium = True
                
        if category == 1:
            user.profile.token_character_plus -= 1
            wanted_characters = Character.objects.filter(chance__lt = 25)
            for character in wanted_characters:
                character.chance = float(character.chance) * 1.5
            unwanted_characters = Character.objects.filter(chance__gte = 25)
            for character in unwanted_characters:
                character.chance = float(character.chance) * 0.5
            characters = wanted_characters | unwanted_characters
            if premium_roll >= 95:
                premium = True
                
        if category == 2:
            user.profile.token_character_premium -= 1
            characters = Character.objects.all()
            if premium_roll >= 80:
                premium = True
            
        user.save()
        char_weights = []
        char_names = []
        for character in characters:
            char_weights.append(float(character.chance))
            char_names.append(character.name)
            
        chosen_name = random.choices(char_names, weights=char_weights, k=1)
        for character in characters:
            if character.name == chosen_name[0]:
                if premium == True:
                    skin_weights = []
                    skin_names = []
                    for skin in character.skins:
                        skin_weights.append(float(character.chance))
                        skin_names.append(skin)
                    chosen_skin = random.choices(skin_names, weights=skin_weights, k=1)
                    
                    character.image_loading = chosen_skin[0]
                    
                    with open(f'{settings.MEDIA_ROOT}/champions/complete-data/{character.name}.json', encoding='utf8') as character_file:
                        data = character_file.read()
                    character_data = (json.loads(data))['data']
                    skins_data = character_data[character.name]['skins']
                    for skin in skins_data:
                        skin_num = re.findall(SKINR, chosen_skin[0])
                        if int(skin['num']) == int(skin_num[0]):
                            character.name = skin['name']
                            if character.__dict__ not in characters:
                                serializer = CharacterSerializer(data=character.__dict__)
                                if serializer.is_valid():
                                    serializer.save()
                                    return Response(serializer.data, status=status.HTTP_200_OK)
                                else:
                                    print(serializer.errors)
                            else:
                                serializer = CharacterSerializer(character.__dict__)
                                return Response(serializer.data, status=status.HTTP_200_OK)
                serializer = CharacterSerializer(character)
                return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ItemRoll(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        user = UserModel.objects.get(pk=request.user.id)
        category = request.data['category']
        items  = []
        if category == 0:
            user.profile.token_item_basic -= 1
            wanted_items = Item.objects.filter(chance__gte = 35)
            for item in items:
                item.chance = float(item.chance) * 1.5
            unwanted_items = Item.objects.filter(chance__lt = 35)
            for item in unwanted_items:
                item.chance = float(item.chance) * 0.5
                
        if category == 1:
            user.profile.token_item_plus -= 1
            c1 = Q(chance__gte = 15)
            c2 = Q(chance__lt = 35)
            wanted_items = Item.objects.filter(c1 & c2)
            for item in wanted_items:
                item.chance = float(item.chance) * 1.5

            c3 = Q(chance__lt = 15)
            c4 = Q(chance__gte = 35)
            unwanted_items = Item.objects.filter(c3 | c4)
            for item in unwanted_items:
                item.chance = float(item.chance) * 0.5
                
        if category == 2:
            user.profile.token_item_premium -= 1
            wanted_items = Item.objects.filter(chance__lt = 15)
            for item in wanted_items:
                item.chance = float(item.chance) * 1.5
            unwanted_items = Item.objects.filter(chance__gte = 15)
            for item in unwanted_items:
                item.chance = float(item.chance) * 0.5
                
        user.save()
        items = wanted_items | unwanted_items
        
        item_weights = []
        item_names = []
        for item in items:
            item_weights.append(float(item.chance))
            item_names.append(item.name)
        
        chosen_name = random.choices(item_names, weights=item_weights, k=1)
        for item in items:
            if item.name == chosen_name[0]:
                serializer = ItemSerializer(item)
                return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class BattleRoll(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        user = UserModel.objects.get(pk=request.user.id)
        
        type = random.randint(0,1)
        amount = random.randint(500, 5000)
        
        if type == 0:
            user.profile.orange_essence += amount
            data = {
                'essence_type': 'orange_essence',
                'essence_amount': amount
            }
        elif type == 1:
            user.profile.blue_essence += amount
            data = {
                'essence_type': 'blue_essence',
                'essence_amount': amount
            }
        user.save()
        return Response(data, status=status.HTTP_200_OK)
            
        