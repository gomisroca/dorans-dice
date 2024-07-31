from django.contrib.auth import get_user_model, authenticate, login, logout
from django.forms.models import model_to_dict

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import TeamCharacter, Team
from .serializers import UserSerializer, ObtainTokenPairSerializer, TeamCharacterSerializer

from gacha_main.models import Character, Item
from gacha_main.serializers import CharacterSerializer, ItemSerializer

UserModel = get_user_model()
    
class UserRegister(APIView):
    def post(self, request, format=None):
        print(request.data)
        users = UserModel.objects.all()
        if request.data not in users:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserGetToken(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = ObtainTokenPairSerializer

class UserLogin(APIView):
    def post(self, request, format=None):
        username = request.data["username"]
        password = request.data["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response('No such user.', status=status.HTTP_400_BAD_REQUEST)
        
class UserLogout(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class UserInfo(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try:
            user_data = UserSerializer(request.user).data
            return Response(user_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class UserGachaObject(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        try:
            user = UserModel.objects.get(pk=request.user.id)
            if request.data['object_type'] == 'character':
                character = Character.objects.get(pk=request.data['object_id'])
                user.profile.characters.add(character)
            elif request.data['object_type'] == 'item':
                item = Item.objects.get(pk=request.data['object_id'])
                user.profile.items.add(item)
            elif request.data['object_type'] == 'blue_essence':
                user.profile.blue_essence += request.data['object_amount']
            elif request.data['object_type'] == 'orange_essence':
                user.profile.orange_essence += request.data['object_amount']
            elif request.data['object_type'] == 'token_character_basic':
                user.profile.token_character_basic += 1
                user.profile.orange_essence -= 2500
            elif request.data['object_type'] == 'token_character_plus':
                user.profile.token_character_plus += 1
                user.profile.orange_essence -= 5000
            elif request.data['object_type'] == 'token_character_premium':
                user.profile.token_character_premium += 1
                user.profile.orange_essence -= 20000
            elif request.data['object_type'] == 'token_item_basic':
                user.profile.token_item_basic += 1
                user.profile.blue_essence -= 2500
            elif request.data['object_type'] == 'token_item_plus':
                user.profile.token_item_plus += 1
                user.profile.blue_essence -= 5000
            elif request.data['object_type'] == 'token_item_premium':
                user.profile.token_item_premium += 1
                user.profile.blue_essence -= 20000
            user.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, format=None):
        try:
            user = UserModel.objects.get(pk=request.user.id)
            
            if request.data['action_type'] == 'item_craft':
                crafted_item = Item.objects.get(pk=request.data['object_id'])
                crafted_item_serializer = ItemSerializer(crafted_item)
                
                if (user.profile.blue_essence - crafted_item_serializer['purchase_value'].value < 0):
                    raise Exception("ERR_USER_BE")
                else:
                    user.profile.blue_essence -= crafted_item_serializer['purchase_value'].value
                    
                print(crafted_item_serializer['from_items'].value)
                for item_riot_id in crafted_item_serializer['from_items'].value:
                    from_item =  Item.objects.get(riot_id=item_riot_id)
                    if user.profile.items.filter(riot_id=item_riot_id).count() > 0:
                        user.profile.items.remove(from_item)
                    
                
                    
                user.profile.items.add(crafted_item)
                
            user.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
class UserTeamCharacter(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        try:  
            user = UserModel.objects.get(pk=request.user.id)
            
            selected_team = request.data['team']
            selected_character = request.data['character']
            
            character = Character.objects.get(pk=selected_character['id'])
            team_char = TeamCharacter.objects.create(character=character)
            team = Team.objects.get(pk=selected_team['id'])
            
            if len(selected_team['characters']) >= 5:
                return Response(status=status.HTTP_200_OK)
            
            for character in selected_team['characters']:
                if (character['character']['name']) == selected_character['name']:
                    return Response(status=status.HTTP_200_OK)
                
            team.characters.add(team_char)
            user.save()
            user_data = UserSerializer(request.user).data
            return Response(user_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, format=None):
        try:  
            user = UserModel.objects.get(pk=request.user.id)
            
            selected_character = request.data['character']
            TeamCharacter.objects.get(pk=selected_character['id']).delete()
           
            user.save()
            user_data = UserSerializer(request.user).data
            return Response(user_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class UserCharacterItem(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        try:  
            user = UserModel.objects.get(pk=request.user.id)
            
            selected_item = request.data['item']
            selected_character = request.data['character']
            
            serialized_item = Item.objects.get(pk=selected_item['id'])
            serialized_character = TeamCharacter.objects.get(pk=selected_character['id'])
            
            serialized_character.items.add(serialized_item)
            
            user.save()
            user_data = UserSerializer(request.user).data
            return Response(user_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, format=None):
        try:
            user = UserModel.objects.get(pk=request.user.id)
            
            selected_item = request.data['item']
            selected_character = request.data['character']
            
            serialized_item = Item.objects.get(pk=selected_item['id'])
            serialized_character = TeamCharacter.objects.get(pk=selected_character['id'])
            
            serialized_character.items.remove(serialized_item)
           
            user.save()
            user_data = UserSerializer(request.user).data
            return Response(user_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)