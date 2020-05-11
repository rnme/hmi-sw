const express = require('express')
const socket = require('socket.io')
var http = require('follow-redirects').http;
var fs = require('fs');
// const cors = require('cors')
const bodyParser = require('body-parser')
const validator = require('express-validator')
const app = express()
const server = require('http').Server(app)
const io = socket(server)

const utils = require('./utils');
const mb = require('./components/modbus')

const port = process.env.PORT || 3000;
const route = require('./app/routes');

const reportToDashboard = {
  "status": 0,//<integer; 0->OK, 1->ADVERTENCIA, 2->ALARMA>,
  "fr": 2,
  "ie": 3,
  "pause": 10,
  "vc": 20,
  "fio2": 120,
  "peep": 10
}



// app.use(cors())
app.use(express.static('public'));
app.use((req,res,next) => {
  req.io = io
  next()
})
app.use(bodyParser.json())
app.use(validator())
app.use(route)
mb.init();

setInterval(function() {
  mb.getHR(50, 69, (data) => { 
    if (data) {
      const numbers = data.data.map((toReturn => ((toReturn > 32767) ? toReturn - 65536 : toReturn)));
      const NRO_PACIENTE = numbers[14];
      const FR = numbers[1];
      const IE = numbers[2];
      const VC_sp = numbers[3];
      const PAUSA_INSP = numbers[4];
      const FiO2_sp = numbers[5];
      const P_PEEP = numbers[11];
      const [VALV_INSP, VALV_ESP, VALV_SEG, ALARMA_BOCINA] = utils.getBinaryFromBuffer(data.buffer, 51);

      const historica = utils.getBinaryFromBuffer(data.buffer, 49).indexOf('1') > 0;
      const falla = utils.getBinaryFromBuffer(data.buffer, 50).indexOf('1') > 0;;
        

      reportToDashboard.status = falla ? 2 : historica ? 1 : 0;
      reportToDashboard.fr     = FR;
      reportToDashboard.ie     = IE;
      reportToDashboard.vc     = VC_sp;
      reportToDashboard.pause  = PAUSA_INSP;
      reportToDashboard.fio2   = FiO2_sp;
      reportToDashboard.peep   = P_PEEP;
      
      sendReport(NRO_PACIENTE, reportToDashboard);
    }
  })


  
}, 5000);


io.on('connection', (socket) => {
  console.log('a user connected');

  mb.init();

  setInterval(function() {
    mb.getHR(101, 18, (data) => { 
      if (data) {
        const [VALV_INSP, VALV_ESP, VALV_SEG, ALARMA_BOCINA] = utils.getBinaryFromBuffer(data.buffer, 0);
        const numbers = data.data.map((toReturn => ((toReturn > 32767) ? toReturn - 65536 : toReturn)));
        const P_Pulmon = numbers[1];      // 102 = 40103
        const P_Linea = numbers[2];       // 103 = 40104
        const FL_O2 = numbers[3];         // 104 = 40105
        const FL_Aire = numbers[4];       // 105 = 40106
        const VC_O2 = numbers[5];         // 106 = 40107
        const VC_Aire = numbers[6];       // 107 = 40108
        const VC_inst = numbers[7];       // 108 = 40109
        const FL_Mezcla = numbers[8];     // 109 = 40110
        const VC_max = numbers[14];       // 115 
        const FiO2_inst = numbers[16];    // 117 
        const Crs = numbers[17];          // 118 
        socket.emit('chart', {
          P_Pulmon,
          P_Linea,
          FL_O2,
          FL_Aire,
          VC_O2,
          VC_Aire,
          VC_inst,
          FL_Mezcla,
          VALV_INSP,
          VALV_ESP,
          VALV_SEG,
          ALARMA_BOCINA,
          VC_max,
          FiO2_inst,
          Crs,
        });
      }
    }) 
    mb.getHR(59, 2, (data) => { 
      if (data) {
        const numbers = data.data.map((toReturn => ((toReturn > 32767) ? toReturn - 65536 : toReturn)));
        const Q_02_10 = numbers[0];      // 59
        const Q_Aire_10 = numbers[1];       // 60 
        socket.emit('q_values', {
          Q_02_10,
          Q_Aire_10,
        });
      }
    }) 
  }, 100);

  setInterval(function() {
    mb.getHR(50, 67, (data) => { 
      if (data) {
        const [INICIO, PARADA_EMERGENCIA, CONFIRM, OFF_ALAR, ACK_ALAR, DELAY_ALAR] = utils.getBinaryFromBuffer(data.buffer, 0);
        const [Hist_Falla_1_1, Hist_Falla_1_2, Hist_Falla_2_1, Hist_Falla_2_2, Hist_Falla_3_2, Hist_Falla_3_1, Hist_Falla_4, Hist_Falla_5_1, Hist_Falla_5_2, Hist_Falla_6, Hist_Falla_7, Hist_Falla_8, Hist_ALAR_13, Hist_ALAR_14, Hist_ALAR_15, Hist_ALAR_16] = utils.getBinaryFromBuffer(data.buffer, 49);
        const [Falla_1_1, Falla_1_2, Falla_2_1, Falla_2_2, Falla_3_2, Falla_3_1, Falla_4, Falla_5_1, Falla_5_2, Falla_6, Falla_7, Falla_8, ALAR_13, ALAR_14, ALAR_15, ALAR_16] = utils.getBinaryFromBuffer(data.buffer, 50);
        const numbers = data.data.map((toReturn => ((toReturn > 32767) ? toReturn - 65536 : toReturn)));
        const T_INSP = numbers[6];
        const T_ESP = numbers[7];
        const Q_MZ_sp = numbers[8];
        const Q_02_sp = numbers[9];        //grafica
        const Q_AM_sp = numbers[10];
        const VC_O2_sp = numbers[12];
        const VC_Aire_sp = numbers[13];
        const NRO_PACIENTE = numbers[14];
        const DIF_VOLUMEN_CORRIENTE_MAX = numbers[40];
        const PRESIÓN_PEEP_MIN = numbers[41];
        const DIF_VOLUMEN_CORRIENTE_MIN = numbers[42];
        const FiO2_calculado = numbers[60];
        const P_pulmon_max = numbers[61];
        const P_pulmon_pl = numbers[62];
        const P_AutoPEEP = numbers[63];
        const P_pulmon_min = numbers[64];
        const Q_MZ_max = numbers[66];
        const FR = numbers[1];
        const IE = numbers[2];
        const VC_sp = numbers[3];
        const PAUSA_INSP = numbers[4];
        const FiO2_sp = numbers[5];
        const P_PEEP = numbers[11];
        

        socket.emit('parameters', {
          T_INSP, T_ESP, Q_MZ_sp, Q_02_sp, Q_AM_sp, VC_O2_sp, VC_Aire_sp, NRO_PACIENTE, DIF_VOLUMEN_CORRIENTE_MAX, 
          PRESIÓN_PEEP_MIN, DIF_VOLUMEN_CORRIENTE_MIN, FiO2_calculado, P_pulmon_max, P_pulmon_pl, 
          P_AutoPEEP, P_pulmon_min, Q_MZ_max, INICIO, PARADA_EMERGENCIA, CONFIRM, OFF_ALAR, ACK_ALAR, DELAY_ALAR,
          FR, IE, VC_sp, PAUSA_INSP, FiO2_sp, P_PEEP,
        });
      }
    })


    
  }, 1000);
});



const sendReport = (NRO_PACIENTE, body) => {
  

  var options = {
    'method': 'POST',
    'hostname': 'ec2-54-157-41-149.compute-1.amazonaws.com',
    'port': 5000,
    'path': `/ventilators/${NRO_PACIENTE || 1}/measurements`,
    'headers': {
      'Content-Type': 'application/json'
    },
    'maxRedirects': 20
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  var postData = JSON.stringify(body);

  req.write(postData);

  req.end();
}

server.listen(port, () => {
  console.log('Listening on '+port)
  console.log('Open http://localhost:' + port)
})