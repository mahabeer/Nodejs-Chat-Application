const express = require("express");
const app = express();


const PORT = process.env.PORT || 3000;


app.use(express.static("public/"));

let server = app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`);
});

//Socket.io
const io = require("socket.io")(server);

io.on("connection",socket=>{
    //Listening Message
    let newuser;
    socket.on("joined",user=>{
        socket.broadcast.emit("joined",user);
        newuser = user;
    })
    socket.on("message",data=>{
        data.time = Date();
        data.position = "left";
        socket.broadcast.emit("message",data);
    });

    socket.on("typing", user=>{
        socket.broadcast.emit("typing",user);
    });

    socket.on("disconnect",()=>{
       socket.broadcast.emit("offline",newuser);
    })
});

io.on("disconnect",socket=>{
    socket.broadcast.emit("disconnect")
})