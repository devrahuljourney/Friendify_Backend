const { Server } = require("socket.io");

function initializeSocketServer(server) {
    const localhost = "http://localhost:3000";
    const originUrl = "https://friendify-alpha.vercel.app";

    const io = new Server(server, {
        cors: {
            origin: [localhost, originUrl],
            methods: ["GET", "POST"] ,
            transports: ['websocket', 'polling'],
            credentials: true,
        },
        allowEIO3: true
    });

    io.on('connection', (socket) => {  
        console.log("User is Connected");

        socket.on('disconnect', () => {
            console.log("user disconnected");
        });

        socket.on("likePost", (data) => {
            const {userId , postId } = data
            io.emit("updatePost", userId); 
            console.log(data);
        });

        socket.on("commentPost", (data) => {
            io.emit("updatePost", data); 
            console.log(data);
        });
    });
}

module.exports = initializeSocketServer;
