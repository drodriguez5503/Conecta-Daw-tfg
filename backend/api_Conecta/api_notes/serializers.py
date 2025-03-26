from rest_framework import serializers
from .models import Note, Tag, Link

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'title', 'content', 'createdAt', 'modifiedAt', 'author', 'tags', 'links', 'project')

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')

class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = ('id', 'originNote', 'destinationNote')