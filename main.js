
const content = document.querySelector('.content')
let token = null


function run(){
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


    content.innerHTML = loginTemplate
    const loginButton = document.querySelector('#loginButton')
    loginButton.addEventListener('click', ()=>{
        login()
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
    content.innerHTML = contentMessages
}

function render(content){
    content.innerHTML = ""
    content.innerHTML = content
}

function login(){
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

async function fetchMessages(){



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

run()