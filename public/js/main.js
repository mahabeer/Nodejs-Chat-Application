const socket = io();
let user;

do {
    user = prompt("Please enter you name");
}
while(!user);

const msg_form = document.querySelector("#msg_form");
const msg = document.querySelector("#msg");
const message_container = document.querySelector("#message_container");
const typingtext = document.querySelector("#typing");

if(user!=='')
{
    socket.emit("joined",user);
}

socket.on("joined",user=>{
    sendMessage(user,"Joined the chat");
     //scroll to top
     scrolltoBottom();
});


msg_form.addEventListener("submit",(e)=>{
    e.preventDefault();
    let data = {
        user:user,
        text:msg.value,
        position:"right"
    }
    //appending messages
    appendMessages(data);
    msg.value='';
    //scroll to top
    scrolltoBottom();
    //broadcasting messages
    boradcastMessage(data);
});

function appendMessages(data)
{
    let div = document.createElement("div");
    div.classList.add("messages",data.position);
    div.innerHTML=`<h4>${data.user} : ${moment(data.time).format("LT")}</h4>
    <p>${data.text}</p>`;
    message_container.appendChild(div);
}

function boradcastMessage(data)
{
    socket.emit("message",data);
}

socket.on("message",data=>{
    appendMessages(data);
     //scroll to top
     scrolltoBottom();
});


socket.on("offline",user=>{
    sendMessage(user,"Left the chat");
     //scroll to top
     scrolltoBottom();
})

msg.addEventListener("keyup", ()=>{
    socket.emit("typing",user);
});
let timerid=null;
function debounce(func,timer)
{
    if(!timerid)
    {
        clearTimeout(timerid);
    }
    timerid = setTimeout(()=>{
        func();
    },timer);
}
socket.on("typing", user=>{
    typingtext.innerText = `${user} is typing....`;
    debounce(function(){
        typingtext.innerText='';
    },1000)
});

function sendMessage(user,status) {
    let div = document.createElement("div");
    div.classList.add("messages","left");
    if(status==="Joined the chat")
    {
        div.innerHTML=`<p class="joined_chat"><i class="fa fa-plus"></i> ${moment().format("LT")} : ${user} ${status}</p>`;
    }
    else
    {
        div.innerHTML=`<p class="left_chat"><i class="fa fa-minus"></i> ${moment().format("LT")} : ${user} ${status}</p>`;
    }
    
    message_container.appendChild(div);
}
function scrolltoBottom()
{
    message_container.scrollTop = message_container.scrollHeight;
}