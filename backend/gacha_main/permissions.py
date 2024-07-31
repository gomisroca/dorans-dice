from rest_framework import permissions

class CanViewCharacters(permissions.BasePermission):
    def has_permission(self, request, view):
        if  request.method == 'GET' and request.user.is_authenticated and request.user.has_perm('gacha_main.view_character'):
            return True
        return False
        
class CanViewItems(permissions.BasePermission):
    def has_permission(self, request, view):
        if  request.method == 'GET' and request.user.is_authenticated and request.user.has_perm('gacha_main.view_item'):
            return True
        return False