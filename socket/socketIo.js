// const { Server } = require("socket.io");

// function initializeSocketServer(server) {
//     const localhost = "http://localhost:3000";
//     const originUrl = "https://friendify-alpha.vercel.app";

//     const io = new Server(server, {
//         cors: {
//             origin: [localhost, originUrl],
//             methods: ["GET", "POST"] ,
//             // transports: ['websocket', 'polling'],
//             credentials: true,
//         }
//         // ,
//         // allowEIO3: true
//     });

//     io.on('connection', (socket) => {  
//         console.log("User is Connected");

//         socket.on('disconnect', () => {
//             console.log("user disconnected");
//         });

//         socket.on("likePost", (data) => {
//             const {userId , postId } = data
//             console.log("user and post id" , userId, postId);
//             io.emit("updatePost", userId); 
            
//         });

//         socket.on("newComment", (data) => {
//             io.emit("updatePost", data); 
//             console.log(data);
//         });

//         socket.on('sendMessage' , async (data) => {
//             const { message} = data;
//             console.log("sendmessage socket ", data)
//             io.emit('receiveMessage',data);
//         })
//     });
//     return io;
// }

// module.exports = initializeSocketServer;


const { Server } = require("socket.io");

function initializeSocketServer(server) {
    const localhost = "http://localhost:3000";
    const originUrl = "https://friendify-alpha.vercel.app";

    const io = new Server(server, {
        cors: {
            origin: [localhost, originUrl],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {  
        console.log("User is Connected");

        socket.on('disconnect', () => {
            console.log("User disconnected");
        });

        socket.on("likePost", (data) => {
            const { userId, postId } = data;
            console.log("User and Post ID", userId, postId);
            io.emit("updatePost", userId); 
        });

        socket.on("newComment", (data) => {
            io.emit("updatePost", data); 
            console.log(data);
        });

        socket.on('sendMessage', (data) => {
            console.log("sendMessage socket", data);
            io.emit('receiveMessage', data);
        });
    });

    return io;
}

module.exports = initializeSocketServer;
