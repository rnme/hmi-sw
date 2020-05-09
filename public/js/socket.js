//Socket init
var socket = io();


/***
 * Evento que trae la info par las gráficas y los parámetors cada 0.1s
 */
socket.on('chart', (data) => {
  var time = new Date().getTime()
  
  P_Pulmon.append(time, data.P_Pulmon);
  VC_Mezcla.append(time, data.VC_Mezcla);
  FL_Mezcla.append(time, data.FL_Mezcla);
  
  vue_manajer.parameters = {...vue_manajer.parameters, ...data};
}) 

/***
 *Evento que trae los parámetros que llegan cada 1s 
 */
socket.on('parameters', (data) => {
  vue_manajer.parameters = {...vue_manajer.parameters, ...data};
}) 
