

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
  maxValue: 60,
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


window.addEventListener('load', () => {
  const firstCanvas = document.getElementById("firstCanvas");
  const secondCanvas = document.getElementById("secondCanvas");
  const thirdCanvas = document.getElementById("thirdCanvas");
  let windowHeight = window.innerHeight;
  const canvasContainerWidth = document.getElementById("canvasContainer").offsetWidth;
  
  windowHeight = (windowHeight < 500) ? windowHeight * 1.4 : windowHeight;
  
  chart_p.streamTo(firstCanvas);
  chart_f.streamTo(secondCanvas);
  chart_v.streamTo(thirdCanvas);
  firstCanvas.setAttribute('width', canvasContainerWidth+'px')
  secondCanvas.setAttribute('width', canvasContainerWidth+'px')
  thirdCanvas.setAttribute('width', canvasContainerWidth+'px')
  firstCanvas.setAttribute('height', windowHeight/4+'px')
  secondCanvas.setAttribute('height', windowHeight/4+'px')
  thirdCanvas.setAttribute('height', windowHeight/4+'px')
})


