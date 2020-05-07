const express = require('express')
const socket = require('socket.io')
// const cors = require('cors')
const bodyParser = require('body-parser')
const validator = require('express-validator')
const app = express()
const server = require('http').Server(app)
const io = socket(server)

const utils = require('./utils');
const mb = require('./components/modbus')

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

  mb.init();

  

  setInterval(function() {
    mb.getHR(102, 15, (data) => { 
      const numbers = data.data.map((toReturn => ((toReturn > 32767) ? toReturn - 65536 : toReturn)));
      const P_Pulmon = numbers[0];  // 102 = 40103
      const VC_Mezcla = numbers[6]; // 108 = 40109
      const FL_Mezcla = numbers[7]; // 109 = 40110
      socket.emit('chart', {P_Pulmon: P_Pulmon, VC_Mezcla: VC_Mezcla, FL_Mezcla: FL_Mezcla});
    })
    
  }, 100);
});



server.listen(port, () => {
  console.log('Listening on '+port)
  console.log('Open http://localhost:' + port)
})