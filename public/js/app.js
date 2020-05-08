//Socket init
var socket = io();

// var smoothie = new SmoothieChart();
// smoothie.streamTo(document.getElementById("firstCanvas"));

// Data
var P_Pulmon = new TimeSeries();
var VC_Mezcla = new TimeSeries();
var FL_Mezcla = new TimeSeries();

// Add a random value to each line every second
// setInterval(function() {
//   P_Pulmon.append(new Date().getTime(), Math.random());
//   VC_Mezcla.append(new Date().getTime(), Math.random());
//   FL_Mezcla.append(new Date().getTime(), Math.random());
// }, 100);
socket.on('chart', (data) => {
  var time = new Date().getTime()
  
  P_Pulmon.append(time, data.P_Pulmon);
  VC_Mezcla.append(time, data.VC_Mezcla);
  FL_Mezcla.append(time, data.FL_Mezcla);
  
  vue_manajer.parameters = {...vue_manajer.parameters, ...data};
}) 

socket.on('parameters', (data) => {
  vue_manajer.parameters = {...vue_manajer.parameters, ...data};
}) 

var color1 = 'rgb(60, 200, 200)';
    color2 = 'rgb(216, 111, 13)';
    color3 = 'rgb(42, 182, 14)';


var smoothie = new SmoothieChart({
  millisPerPixel : 5,
  labels: { fillStyle: color1, fontSize: 18 },
  title: {text:'P Pulmon (cmH2O)', fillStyle: color1, verticalAlign: 'top', fontSize: 18},
  maxValue: 100,
  minValue: 0,
});
var smoothie2 = new SmoothieChart({
  millisPerPixel : 5,
  labels: { fillStyle: color2, fontSize: 18 },
  title: {text:'VC Mezcla (mL)', fillStyle: color2, verticalAlign: 'top', fontSize: 18},
  maxValue: 1000,
  minValue: 0,
});
var smoothie3 = new SmoothieChart({
  millisPerPixel : 5,
  labels: { fillStyle: color3, fontSize: 18 },
  title: {text:'FL Mezcla (L/m)', fillStyle: color3, verticalAlign: 'top', fontSize: 18},
  maxValue: 80,
  minValue: 0,
});

smoothie.addTimeSeries(P_Pulmon,
  { strokeStyle: color1, lineWidth: 2 });
smoothie2.addTimeSeries(VC_Mezcla,
  { strokeStyle: color2, lineWidth: 2 });
smoothie3.addTimeSeries(FL_Mezcla,
  { strokeStyle: color3, lineWidth: 2 });

smoothie.streamTo(document.getElementById("firstCanvas"));
smoothie2.streamTo(document.getElementById("secondCanvas"));
smoothie3.streamTo(document.getElementById("thirdCanvas"));
document.getElementById("firstCanvas").setAttribute('width', document.getElementById("canvasContainer").offsetWidth+'px')
document.getElementById("secondCanvas").setAttribute('width', document.getElementById("canvasContainer").offsetWidth+'px')
document.getElementById("thirdCanvas").setAttribute('width', document.getElementById("canvasContainer").offsetWidth+'px')


