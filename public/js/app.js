//Socket init
var socket = io();

// var smoothie = new SmoothieChart();
// smoothie.streamTo(document.getElementById("firstCanvas"));

// Data
var line1 = new TimeSeries();
var line2 = new TimeSeries();
var line3 = new TimeSeries();

// Add a random value to each line every second
// setInterval(function() {
//   line1.append(new Date().getTime(), Math.random());
//   line2.append(new Date().getTime(), Math.random());
//   line3.append(new Date().getTime(), Math.random());
// }, 100);
socket.on('chart', (data) => {
  var time = new Date().getTime()
  line1.append(time, Math.random());
  line2.append(time, Math.random());
  line3.append(time, Math.random());
}) 

var color1 = 'rgb(60, 200, 200)';
    color2 = 'rgb(216, 111, 13)';
    color3 = 'rgb(42, 182, 14)';


var smoothie = new SmoothieChart({
  millisPerPixel : 5,
  labels: { fillStyle: color1 }
});
var smoothie2 = new SmoothieChart({
  millisPerPixel : 5,
  labels: { fillStyle: color2 }
});
var smoothie3 = new SmoothieChart({
  millisPerPixel : 5,
  labels: { fillStyle: color3 }
});

smoothie.addTimeSeries(line1,
  { strokeStyle: color1, lineWidth: 2 });
smoothie2.addTimeSeries(line2,
    { strokeStyle: color2, lineWidth: 2 });
smoothie3.addTimeSeries(line3,
    { strokeStyle: color3, lineWidth: 2 });

smoothie.streamTo(document.getElementById("firstCanvas"));
smoothie2.streamTo(document.getElementById("secondCanvas"));
smoothie3.streamTo(document.getElementById("thirdCanvas"));
document.getElementById("firstCanvas").setAttribute('width', document.getElementById("canvasContainer").offsetWidth+'px')
document.getElementById("secondCanvas").setAttribute('width', document.getElementById("canvasContainer").offsetWidth+'px')
document.getElementById("thirdCanvas").setAttribute('width', document.getElementById("canvasContainer").offsetWidth+'px')


var start = null;
var element = document.getElementById('firstCanvas');

function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  console.log(progress)
}

window.requestAnimationFrame(step);



var fps = 0;
