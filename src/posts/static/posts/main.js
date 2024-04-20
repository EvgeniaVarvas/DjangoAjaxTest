
// const helloWorldBox = document.getElementById('hello_world')
const postBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const endBox = document.getElementById('end-box')
const loadMoreBtn = document.getElementById('load-more')

const postForm = document.getElementById('post-form')
const title = document.getElementById('id_title')
const content = document.getElementById('id_content')

const url = window.location.href


const csrf = document.getElementsByName('csrfmiddlewaretoken')
const alertBox = document.getElementById('alert-box')


const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const deleted = localStorage.getItem('title')
if(deleted){
    handleAlerts('danger', 'Post ${deleted} Deleted')
    
    localStorage.clear()
}

const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-form')]
    likeUnlikeForms.forEach(form => form.addEventListener('submit', e => {
            e.preventDefault()
            const clikedId = e.target.getAttribute('data-id')
            const likeBtn = document.getElementById(`like-btn-${clikedId}`)

            $.ajax({
                type: 'POST',
                url: "/like_unlike/",
                data: {
                    'csrfmiddlewaretoken': csrftoken,
                    'pk': clikedId,
                },
                success: function(response){
                    console.log(response)
                    likeBtn.textContent = response.liked ? `Unlike (${response.count})` : `Like (${response.count})`
                },
                error: function(error){
                    console.log(error)
                },
         })
    }))
}


// CardPost

function createPostCard(post) {
    return `
    <div class="card mb-2">
        <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.content}</p>
        </div>
        <div class="card-footer">
            <div class="row">
                <div class="col-1">
                    <a href="#" class="btn btn-primary">Details</a>
                </div>
                <div class="col-2">
                    <form class="like-form" data-id="${post.id}">
                        <button href="#" class="btn btn-primary" id="like-btn-${post.id}">
                            ${post.liked ? `Unlike (${post.count})` : `Like (${post.count})`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
}


let visible = 3

const getData = () => {
    $.ajax({
        type:'GET',
        url:`/data/${visible}/`,
        success: function(response){
            console.log(response)
            const data = response.data
            setTimeout(() => {
                spinnerBox.classList.add('not-visible')
                data.forEach(element => {
                    postBox.innerHTML += `
                    <div class="card mb-2">
                  
                        <div class="card-body">
                            <h5 class="card-title">${element.title}</h5>
                            <p class="card-text">${element.content}</p>
                    
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col-1">
                                    <a href="${url}${element.id}/" class="btn btn-primary">Details</a>
                                </div>
                                <div class="col-2">
                                <form class="like-form" data-id="${element.id}">
                                    <button href="#" class="btn btn-primary" id="like-btn-${element.id}">${element.liked ? `Unlike (${element.count})` : `Like (${element.count})`}</button>
                                </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                });
                likeUnlikePosts()
                
            }, 500);
            if (response.size === 0){
                endBox.textContent = 'No posts yet'
            }
            else if (response.size <= visible){
                loadMoreBtn.classList.add('not-visible')
                endBox.textContent = 'No more posts'
            }
        },
        error: function(error){
            
            console.log(error)
        }
    })
}

loadMoreBtn.addEventListener('click', () => {
    spinnerBox.classList.remove('not-visible')
    visible += 3
    getData()
})

// Form creation

postForm.addEventListener('submit', e => {
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: "",
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': title.value,
            'content': content.value
        },
        success: function(response){
            console.log(response)
            postBox.insertAdjacentHTML('afterbegin', `
            <div class="card mb-2">
            <div class="card-body">
                <h5 class="card-title">${response.title}</h5>
                <p class="card-text">${response.content}</p>
        
            </div>
            <div class="card-footer">
                <div class="row">
                    <div class="col-1">
                        <a href="#" class="btn btn-primary">Details</a>
                    </div>
                    <div class="col-2">
                    <form class="like-form" data-id="${response.id}">
                        <button href="#" class="btn btn-primary" id="like-btn-${response.id}">Like (0)</button>
                    </form>
                    </div>
                </div>
            </div>
        </div>`
        )
            likeUnlikePosts()
            $('#addPostModal').modal('hide')
            handleAlerts('success', 'Post created successfully')
            postForm.reset()
            
        },
        error: function(error){
            console.log(error)
            handleAlerts('danger', 'Error creating post')
        },
    });
});


getData()






