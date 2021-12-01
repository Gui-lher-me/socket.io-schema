const express = require("express")
const path = require("path")

const app = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server)

const dotenv = require("dotenv")
dotenv.config();
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, "public"))
app.engine("html", require("ejs").renderFile)
app.set("view engine", "html")

app.use("/", (req, res) => {
    res.render("index.html")
})

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    socket.on('SEND_MESSAGE', (data) => {
        console.log(data)
    });

    socket.on('MSG_HELPER', (data) => {
        console.log(data)
        socket.broadcast.emit('MSG_HELPER', data)
    });

    socket.on('MSG_CCO', (data) => {
        console.log(data)
        socket.broadcast.emit('MSG_CCO', data)
    });
    
    socket.on('FILE_TRANSFER', (stream, data) => {
        console.log(data)
        io.to(data.id).emit('FILE_TRANSFER', stream, data)
    })
})

server.listen(port)

