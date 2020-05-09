

//Constantes
const MILLIS_PER_PIXEL = 10;
const CHART_FONT_SIZE = 18;

//Colores
const COLOR_P = 'rgb(255, 202, 0)';
const COLOR_F = 'rgb(69, 199, 43)';
const COLOR_V = 'rgb(60, 200, 200)';



// Data
var P_Pulmon = new TimeSeries();
var VC_Mezcla = new TimeSeries();
var FL_Mezcla = new TimeSeries();

// Configuración de gráficas
var chart_p = new SmoothieChart({
  millisPerPixel : MILLIS_PER_PIXEL,
  labels: { fillStyle: COLOR_P, fontSize: CHART_FONT_SIZE, fontFamily: "Arial", precision:0 },
  title: {text:'Preisión (cmH2O)', fillStyle: COLOR_P, verticalAlign: 'top', fontSize: CHART_FONT_SIZE, fontFamily: "Arial"},
  maxValue: 100,
  minValue: 0,
  grid:{strokeStyle:'transparent'},
});
var chart_f = new SmoothieChart({
  millisPerPixel : MILLIS_PER_PIXEL,
  labels: { fillStyle: COLOR_F, fontSize: CHART_FONT_SIZE, fontFamily: "Arial", precision:0 },
  title: {text:'Flujo (L/m)', fillStyle: COLOR_F, verticalAlign: 'top', fontSize: CHART_FONT_SIZE, fontFamily: "Arial"},
  maxValue: 80,
  minValue: 0,
  grid:{strokeStyle:'transparent'},
});
var chart_v = new SmoothieChart({
  millisPerPixel : MILLIS_PER_PIXEL,
  labels: { fillStyle: COLOR_V, fontSize: CHART_FONT_SIZE, fontFamily: "Arial", precision:0 },
  title: {text:'Volumen (mL)', fillStyle: COLOR_V, verticalAlign: 'top', fontSize: CHART_FONT_SIZE, fontFamily: "Arial"},
  maxValue: 1000,
  minValue: 0,
  grid:{strokeStyle:'transparent'},
});


// Asignación de una línea por gráfica
chart_p.addTimeSeries(P_Pulmon,
  { strokeStyle: COLOR_P, lineWidth: 2 });
chart_f.addTimeSeries(FL_Mezcla,
  { strokeStyle: COLOR_F, lineWidth: 2 });
chart_v.addTimeSeries(VC_Mezcla,
  { strokeStyle: COLOR_V, lineWidth: 2 });

chart_p.streamTo(document.getElementById("firstCanvas"));
chart_f.streamTo(document.getElementById("secondCanvas"));
chart_v.streamTo(document.getElementById("thirdCanvas"));
document.getElementById("firstCanvas").setAttribute('width', document.getElementById("canvasContainer").offsetWidth+'px')
document.getElementById("secondCanvas").setAttribute('width', document.getElementById("canvasContainer").offsetWidth+'px')
document.getElementById("thirdCanvas").setAttribute('width', document.getElementById("canvasContainer").offsetWidth+'px')


// setInterval( () => {

// }, 100)
