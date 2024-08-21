from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MessageViewSet, NoteViewSet

router = DefaultRouter()
router.register(r'messages', MessageViewSet)
router.register(r'notes', NoteViewSet) 

urlpatterns = [
    path('', include(router.urls)),
]
