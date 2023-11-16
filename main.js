
const content = document.querySelector('.content')
const refreshButton = document.querySelector('#refreshButton')

let token = null

refreshButton.addEventListener('click', ()=>{
    run()
})



function run()
{
    if(!token){
        renderLoginForm()
    }else{
        fetchMessages().then(messages=>{
            renderMessages(messages)
        })

    }
}

function renderLoginForm()
{
    let loginTemplate = `<div class="login form-control">
                            <h2>Login form</h2>
                            <input type="text" id="username" class="form-control" placeholder="username">
                            <input type="password" name="" id="password" class="form-control" placeholder="password">
                            <button class="btn btn-success" id="loginButton">Log in</button>
                        </div>`


    render(loginTemplate)
    const loginButton = document.querySelector('#loginButton')
    loginButton.addEventListener('click', ()=>{
        login()
    })


}
function login()
{
    const username = document.querySelector('#username')
    const password = document.querySelector('#password')

    let body = {
        username : username.value,
        password : password.value
    }

    let params = {
        headers : {"Content-type":"application/json"},
        method : "POST",
        body : JSON.stringify(body)
    }


    fetch('https://b1messenger.imatrythis.tk/login', params)
        .then(response=>response.json())
        .then(data =>{
            if(data.message == "Invalid credentials.")
            {
                renderLoginForm()
            }else{
                token = data.token
                run()
            }


        })

}
function generateMessage(message)
{
    let messageTemplate = `    <div class="row">
                                <hr>
                                    <p><strong>${message.author.username} :</strong> ${message.content}  </p>
                                <hr>
                            </div>`

    return messageTemplate
}

function renderMessages(tableauMessages)
{
    let contentMessages=""

    tableauMessages.forEach(message=>{

        contentMessages += generateMessage(message)
    })

    let messagesAndMessageForm = contentMessages + generateMessageForm()

    render(messagesAndMessageForm)

    const postMessage = document.querySelector('#postMessage')
    const postMessageButton = document.querySelector('#postMessageButton')

    postMessageButton.addEventListener('click', ()=>{
        sendMessage(postMessage.value)
    })

}

function render(pageContent)
{
    content.innerHTML = ""
    content.innerHTML = pageContent
}

async function fetchMessages()
{

    let params = {
        headers : {"Content-type":"application/json",
                    "Authorization":`Bearer ${token}`},
        method : "GET"
    }


  return await fetch('https://b1messenger.imatrythis.tk/api/messages', params)
        .then(response=>response.json())
        .then(data =>{
            if(data.message == "Invalid credentials.")
            {
                renderLoginForm()
            }else{
               return data
            }


        })
}

function generateMessageForm()
{
    let messageFormTemplate = `<div class="form-control">
                                    <input class="form-control" type="text" name="" id="postMessage" placeholder="your message">
                                    <button class="btn btn-success form-control" id="postMessageButton">Envoyer</button>
                                </div>`
    return messageFormTemplate
}

function sendMessage(messageToSend)
{
    let body = {
        content:messageToSend
    }

    let params = {
        headers : {"Content-type":"application/json", "Authorization": `Bearer ${token}`},
        method : "POST",
        body : JSON.stringify(body)
    }


    fetch('https://b1messenger.imatrythis.tk/api/messages/new', params)
        .then(response=>response.json())
        .then(data =>{
            if(data.message == "Invalid credentials.")
            {
                renderLoginForm()
            }else{
               if(data == "OK"){
                   run()
               }else{
                   alert('problem')
                   run()
               }

            }


        })
}

run()