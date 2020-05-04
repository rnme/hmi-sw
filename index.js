const express = require('express')
const socket = require('socket.io')
// const cors = require('cors')
const bodyParser = require('body-parser')
const validator = require('express-validator')
const app = express()
const server = require('http').Server(app)
const io = socket(server)

const port = process.env.PORT || 3000
const route = require('./app/routes')

// app.use(cors())
app.use(express.static('public'));
app.use((req,res,next) => {
  req.io = io
  next()
})
app.use(bodyParser.json())
app.use(validator())
app.use(route)

io.on('connection', (socket) => {
  console.log('a user connected');

  setInterval(function() {
    socket.emit('chart', {line1: Math.random(),line2: Math.random(),line3: Math.random()});
  }, 100);
});



server.listen(port, () => {
  console.log('Listening on '+port)
})