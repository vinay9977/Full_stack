# backend/shopease/views.py
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'ShopEase API is running',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'auth': '/auth/'
        }
    })