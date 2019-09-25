import graphene
from .models import Track
from graphene_django import DjangoObjectType

class TrackType(DjangoObjectType):
  class Meta:
    model = Track

class Query(graphene.ObjectType):
  tracks = graphene.List(TrackType)
  
  def resolve_tracks(self, info):
    return Track.objects.all()

class CreateTrack(graphene.Mutation):
  track = graphene.Field(TrackType)
  
  class Arguments:
    title = graphene.String()
    description = graphene.String()
    url = graphene.String()
    
  def mutate(self, info, **kwargs):
    user = info.context.user
    if user.is_anonymous:
      raise Exception('Login to add a track')
    title = kwargs.get('title')
    description = kwargs.get('description')
    url = kwargs.get('url')
    track = Track(title=title, description=description, url=url, posted_by=user)
    track.save()
    return CreateTrack(track=track)

class UpdateTrack(graphene.Mutation):
  track = graphene.Field(TrackType)
  
  class Arguments:
    track_id=graphene.Int(required=True)
    title = graphene.String()
    description = graphene.String()
    url=graphene.String()
    
  def mutate(self, info, **kwargs):
    user = info.context.user
    track = Track.objects.get(id=kwargs.get('track_id'))
    if track.posted_by != user:
      raise Exception('Unauthorized')
    track.title = kwargs.get('title')
    track.description = kwargs.get('description')
    track.url = kwargs.get('url')
    
    track.save()
    return UpdateTrack(track=track)

class DeleteTrack(graphene.Mutation):
  track_id = graphene.Int()

  class Arguments:
    track_id = graphene.Int(required=True)
  
  def mutate(self, info, track_id):
    user = info.context.user
    track = Track.objects.get(id=track_id)
    
    if track.posted_by != user:
      raise Exception('Not yours!')
    track.delete()
    return DeleteTrack(track_id=track_id)
  

class Mutation(graphene.ObjectType):
  create_track = CreateTrack.Field()
  update_track = UpdateTrack.Field()
  delete_track=DeleteTrack.Field()