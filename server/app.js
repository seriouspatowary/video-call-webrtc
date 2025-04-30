const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const io = new Server({
    cors:true,
});
const app = express();

app.use(bodyParser.json());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket) => {

    socket.on("join-room", (data) => {
        const { roomId, emailId } = data;
        console.log("User", emailId, 'Joined Room', roomId);

        emailToSocketMapping.set(emailId, socket.id);
        socketToEmailMapping.set(socket.id, emailId);

        console.log("Current email to socket map:", [...emailToSocketMapping.entries()]);
        console.log("Current socket to email map:", [...socketToEmailMapping.entries()]);

        socket.join(roomId);
        socket.emit("joined-particular-room", { roomId });
        socket.broadcast.to(roomId).emit("user-joined", { emailId });
    });

   


    socket.on("call-user", data => {
    const { emailId, offer } = data;
    const fromEmail = socketToEmailMapping.get(socket.id);
    const socketId = emailToSocketMapping.get(emailId);

    console.log("Calling user:", emailId, "From:", fromEmail, "Socket ID:", socketId);
    console.log("Emitting incoming-call to user:", emailId);
    if (socketId) {
        socket.to(socketId).emit('incoming-call', { from: fromEmail, offer });
    } else {
        console.log("No socket ID found for user:", emailId);
    }
});


    socket.on("call-accepted", data => {

    const { emailId, ans } = data;
    const socketId = emailToSocketMapping.get(emailId);

    console.log("Call accepted by:", emailId, "Answer:", ans, "Socket ID:", socketId);

    if (socketId) {
        io.to(socketId).emit('call-accepted', { ans }); // 👈 use io.to() instead of socket.to()
    } else {
        console.log("No socket ID found for user:", emailId);
    }
});

    
    
});


app.listen(8000, () => {
    console.log("Http server is running on port:8000")
})
io.listen(8001);