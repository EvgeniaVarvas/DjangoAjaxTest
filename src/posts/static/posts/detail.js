const backBtn = document.getElementById('back-btn')
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')
const postBox = document.getElementById('post-box')



const url = window.location.href +'data/'

//updatePost
const updateUrl = window.location.href +'update/'
const updateForm = document.getElementById('update-form')

//deletePost
const deleteUrl = window.location.href +'delete/'
const deleteForm = document.getElementById('delete-form')


//spinner
const spinnerBox = document.getElementById('spinner-box')

const titleInput = document.getElementById('id_title')
const contentInput = document.getElementById('id_content')

const alertBox = document.getElementById('alert-box')
const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value

backBtn.addEventListener('click', ()=> {
    history.back()
})

$.ajax({
    type: 'GET',
    url: url,
    success: function(response){
        console.log(response)
        const data = response.data

        if(data.logged_in !== data.author){
            console.log('not logged in')
        }
        else{
            updateBtn.classList.remove('not-visible')
            deleteBtn.classList.remove('not-visible')
        }

        const titleEl = document.createElement('h5')
        titleEl.setAttribute('class', 'mt-3')
        titleEl.setAttribute('id', 'title')

        const contentEl = document.createElement('p')
        contentEl.setAttribute('class', 'mt-1')
        contentEl.setAttribute('id', 'content')
        
        titleEl.textContent = data.title
        contentEl.textContent = data.content


        postBox.appendChild(titleEl)
        postBox.appendChild(contentEl)

        titleInput.value = data.title
        contentInput.value = data.content
    },
    error: function(error){
        console.log(error)
    }
})

//update
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const title = document.getElementById('id_title')
    const content = document.getElementById('id_content')

    $.ajax({
        type: 'POST',
        url: updateUrl,
        data: {
            'csrfmiddlewaretoken': csrf,
            'title': titleInput.value,
            'content': contentInput.value
        },
        success: function(response){
            console.log(response)
            handleAlerts('success', 'Post updated successfully')
            title.textContent = response.title
            content.textContent = response.content
            $('#updateModal').modal('hide')
            
           
        },
        error: function(error){
            console.log(error)
            handleAlerts('danger', 'Error updating post')
        }
    })
})


deleteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: deleteUrl,
        data: {
            'csrfmiddlewaretoken': csrf
        },
        success: function(response){
            console.log(response)
            window.location.href = '/'
            localStorage.setItem('title', response.title)
        },
        error: function(error){
            console.log(error)
        }
    })
})