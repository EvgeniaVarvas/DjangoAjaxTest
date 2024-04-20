from django.shortcuts import render
from .models import Post
from django.http import JsonResponse
from .forms import PostForm
from profiles.models import Profile


# Create your views here.
def post_list_and_create(request):
    form = PostForm(request.POST or None)
    # qs = Post.objects.all()
    # if request.is_ajax():
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            instance = form.save(commit=False)
            instance.author = author
            instance.save()
            return JsonResponse({
                'title': instance.title,
                'content': instance.content,
                'author': instance.author.user.username,
                'id': instance.id,
                'created_at': instance.created_at.strftime('%b %d %Y, %I:%M %p')})
    context = {
        'form': form,
    }
    return render(request, 'posts/main.html', context)

def post_detail(request, pk):
    obj = Post.objects.get(pk=pk)
    form = PostForm()
    context = {
        'obj': obj,
        'form': form,
    }
    return render(request, 'posts/detail.html', context)

def post_detail_data(request, pk):
    obj = Post.objects.get(pk=pk)
    data = {
        'id': obj.id,
        'title': obj.title,
        'content': obj.content,
        'author': obj.author.user.username,
        'logged_in': request.user.username,
    }
    return JsonResponse({'data': data})    

def load_posts(request, pk):
    if request.method == 'GET':
        visible = 3
        upper_bound = pk
        lower_bound = upper_bound - visible
        size = Post.objects.all().count()
        # size = Post.objects.filter(id__range=(lower_bound, upper_bound)).count()
        qs = Post.objects.all()
        data = []
        for q in qs:
            item = {
                'id': q.id,
                'title': q.title, 
                'content': q.content,
                'liked': True if request.user in q.liked.all() else False,
                'count': q.liked_count,
                'author': q.author.user.username}
            data.append(item)
        return JsonResponse({'data': data[lower_bound:upper_bound], 'size': size})

def like_ulike_post(request):
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)
        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)
        return JsonResponse({'liked': liked, 'count': obj.liked_count})  


def update_post(request, pk):
        obj = Post.objects.get(pk=pk)
        if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
            new_title = request.POST.get('title')
            new_content = request.POST.get('content')
            obj.title = new_title
            obj.content = new_content
            obj.save()
            return JsonResponse({'title': new_title, 'content': new_content})

def delete_post(request, pk):
    obj = Post.objects.get(pk=pk)
    if request.method == 'POST':
        obj.delete()
        return JsonResponse({})
  
    
