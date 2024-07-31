from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Profile, Team, TeamCharacter
from gacha_main.serializers import CharacterSerializer, ItemSerializer

UserModel = get_user_model()

class TeamCharacterSerializer(serializers.ModelSerializer):
    character = CharacterSerializer(read_only=True)
    items = ItemSerializer(read_only=True, many=True)
    
    def create(self, validated_data):
        return TeamCharacter.objects.create(**validated_data)
    
    class Meta:
        model = TeamCharacter
        fields = "__all__"

class TeamSerializer(serializers.ModelSerializer):
    characters = TeamCharacterSerializer(read_only=True, many=True)
    class Meta:
        model = Team
        fields = "__all__"

class ProfileSerializer(serializers.ModelSerializer):
    characters = CharacterSerializer(read_only=True,  many=True)
    items = ItemSerializer(read_only=True,  many=True)
    teams = TeamSerializer(read_only=True, many=True)
    class Meta:
        model = Profile
        fields = ('user', 'characters', 'items', 'teams', 'avatar', 'blue_essence', 'orange_essence', 'token_character_basic', 'token_character_plus', 'token_character_premium', 'token_item_basic','token_item_plus','token_item_premium')
        
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    password = serializers.CharField(write_only=True)
    
    def create(self, validated_data):
        user = UserModel.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user
    
    class Meta:
        model = UserModel
        fields = "__all__"
        
class ObtainTokenPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(ObtainTokenPairSerializer, cls).get_token(user)
        
        token['username'] = user.username
        token['email'] = user.email
        
        return token