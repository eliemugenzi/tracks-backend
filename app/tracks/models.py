from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

class Track(models.Model):
  title = models.CharField(max_length=255)
  description = models.TextField(blank=True)
  url = models.URLField()
  created_at = models.DateTimeField(auto_now_add=True)
  posted_by=models.ForeignKey(get_user_model(),null=True,on_delete=models.CASCADE)
  
  def __str__(self):
    return self.title

class Like(models.Model):
  user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
  track = models.ForeignKey('tracks.Track', related_name='likes',on_delete=models.CASCADE)
  