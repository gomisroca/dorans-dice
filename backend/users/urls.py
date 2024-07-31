from django.urls import path
from users.views import UserRegister, UserLogout, UserGetToken, UserGachaObject, UserInfo, UserTeamCharacter, UserCharacterItem
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView


urlpatterns = [
    path('register/', UserRegister.as_view(), name='register'),
    path('login/', UserGetToken.as_view(), name='jwt_login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='jwt_refresh'),
    path('logout/', UserLogout.as_view(), name='jwt_logout'),
    path('gacha/', UserGachaObject.as_view(), name='user_gacha'),
    path('info/', UserInfo.as_view(), name='user_info'),
    path('team/', UserTeamCharacter.as_view(), name='user_team_character'),
    path('team/character/', UserCharacterItem.as_view(), name='user_character_item'),
]