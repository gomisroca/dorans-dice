from django.urls import path
from gacha_main.views import ItemList, ItemDetail, CharacterList, CharacterRoll, ItemRoll, BattleRoll

urlpatterns = [
    path('items/',  ItemList.as_view()),
    path('items/<int:pk>/',  ItemDetail.as_view()),
    path('characters/',  CharacterList.as_view()),
    path('roll/characters',  CharacterRoll.as_view()),
    path('roll/items',  ItemRoll.as_view()),
    path('roll/battle',  BattleRoll.as_view()),
]