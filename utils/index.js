


const getHexFromBuffer = (buffer) => {
  return buffer.toString('hex');
}

const getHexFromIndex = (string, dir) => {
  const start = dir * 4;
  return string.substring(start, start + 4);
}
const getBinary = (hex) => {
  let toReturn = hex2bin(reverse(hex).substring(0,2));
  toReturn += hex2bin(reverse(hex).substring(2,4));
  return toReturn;
}

/***
 * Return an array with the binary content of a particular position 
 * in the buffer orderer as the directions we use on modbus.
 * @param buffer    buffer to get the data
 * @param position  offset to obtain the data in the buffer. Default 0 
 */
const getBinaryFromBuffer = (buffer, position = 0) => {
  return getBinary(getHexFromIndex(getHexFromBuffer(buffer),position)).split('');
}

/***
 * Return the integer value of an hex number. 
 * Numbers over 32767 are negatives.
 * @param hex   Hex number to transform
 */
const getInt = (hex) => {
  var toReturn = parseInt(hex,16);
  toReturn = (toReturn > 32767) ? toReturn - 65536 : toReturn;
  return toReturn;
}



const decimalToHex = (d, padding = 4) => {
  if (d < 0)
  {
    d =  d + 65535 + 1;
  }
  const hex = Number(d).toString(16);
  padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
  
  while (hex.length < padding) {
    hex = "0" + hex;
  }
  
  return '0x'+hex;
}


/***
 * Formatea un string binario para pasar le al PLC
 * posiciones-iniciales:  'abcdefghijklmnop'  o '0123456789abcdef'
 * posiciones-finales:    'hgfedcbaponmlkji'  o '76543210fedcba98'
 */
const binaryToWriteable = (binary) => {
  binary = completeBinary(binary)
  
  return reverse(binary.substring(0,8)) + reverse(binary.substring(8,16))
}

function completeBinary(binary) {
  if (binary.length < 16) {
    binary = binary + a.repeat( 16 - binary.length )
  } else if (binary.length > 16){
    binary = binary.match(/[\s\S]{1,16}/g) || [];
    binary = binary[0];
  }
  return binary
}

function reverse(string) {
  return string.split("").reverse().join("");
}
function hex2bin(hex) {
  return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}

module.exports = {
  getHexFromBuffer,
  getHexFromIndex,
  getBinary,
  getBinaryFromBuffer,
  getInt,
  decimalToHex,
  binaryToWriteable
}