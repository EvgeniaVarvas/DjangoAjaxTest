from django.db import models
from django.contrib.auth.models import User
from profiles.models import Profile
# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    liked = models.ManyToManyField(User, blank=True, related_name='likes')
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.title}'
    
    @property
    def liked_count(self):
        return self.liked.all().count()
    
    class Meta:
        ordering = ['-created_at']
