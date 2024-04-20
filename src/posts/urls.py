
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import (post_list_and_create, load_posts, 
                    post_detail, like_ulike_post,
                    post_detail_data, update_post, delete_post)

urlpatterns = [
    path('', post_list_and_create, name='main'),
    path('data/<int:pk>/', load_posts, name='load_posts'),
    path('like_unlike/', like_ulike_post, name='like_unlike'),
    path('<pk>/', post_detail, name='post_detail'),
    path('<pk>/data/', post_detail_data, name='post_detail_data'),
    path('<pk>/update/', update_post, name='post_update'),
    path('<pk>/delete/', delete_post, name='post_delete'),
    
]

