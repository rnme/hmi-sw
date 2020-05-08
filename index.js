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
    mb.getHR(101, 15, (data) => { 
      const [VALV_INSP, VALV_ESP, VALV_SEG, ALARMA_BOCINA] = utils.getBinaryFromBuffer(data.buffer, 0);
      const numbers = data.data.map((toReturn => ((toReturn > 32767) ? toReturn - 65536 : toReturn)));
      const P_Pulmon = numbers[1];      // 102 = 40103
      const P_Linea = numbers[2];       // 103 = 40104
      const FL_O2 = numbers[3];         // 104 = 40105
      const FL_Aire = numbers[4];       // 105 = 40106
      const VC_O2 = numbers[5];         // 106 = 40107
      const VC_Aire = numbers[6];       // 107 = 40108
      const VC_Mezcla = numbers[7];     // 108 = 40109
      const FL_Mezcla = numbers[8];     // 109 = 40110
      socket.emit('chart', {
        P_Pulmon,
        P_Linea,
        FL_O2,
        FL_Aire,
        VC_O2,
        VC_Aire,
        VC_Mezcla,
        FL_Mezcla,
        VALV_INSP,
        VALV_ESP,
        VALV_SEG,
        ALARMA_BOCINA
      });
    })
    
  }, 100);


  setInterval(function() {
    mb.getHR(50, 67, (data) => { 
      const [INICIO, PARADA_EMERGENCIA, CONFIRM, OFF_ALAR, ACK_ALAR, DELAY_ALAR, Cmd_V_Insp, Cmd_V_Esp, Cmd_V_Seg] = utils.getBinaryFromBuffer(data.buffer, 0);
      const numbers = data.data.map((toReturn => ((toReturn > 32767) ? toReturn - 65536 : toReturn)));
      const T_INSP = numbers[6];
      const T_ESP = numbers[7];
      const Q_MZ_sp = numbers[8];
      const Q_02_sp = numbers[9];
      const Q_AM_sp = numbers[10];
      const VC_O2_sp = numbers[12];
      const VC_Aire_sp = numbers[13];
      const DIF_VOLUMEN_CORRIENTE_MAX = numbers[40];
      const PRESIÓN_PEEP_MIN = numbers[41];
      const DIF_VOLUMEN_CORRIENTE_MIN = numbers[42];
      const FiO2_calculado = numbers[60];
      const P_pulmon_max = numbers[61];
      const P_pulmon_pl = numbers[62];
      const P_AutoPEEP = numbers[63];
      const P_pulmon_min = numbers[64];
      const VC_max = numbers[65];
      const Q_MZ_max = numbers[66];
      
      socket.emit('parameters', {
        T_INSP, T_ESP, Q_MZ_sp, Q_02_sp, Q_AM_sp, VC_O2_sp, VC_Aire_sp, DIF_VOLUMEN_CORRIENTE_MAX, 
        PRESIÓN_PEEP_MIN, DIF_VOLUMEN_CORRIENTE_MIN, FiO2_calculado, P_pulmon_max, P_pulmon_pl, 
        P_AutoPEEP, P_pulmon_min, VC_max, Q_MZ_max 
      });
    })
    
  }, 1000);
});



server.listen(port, () => {
  console.log('Listening on '+port)
  console.log('Open http://localhost:' + port)
})