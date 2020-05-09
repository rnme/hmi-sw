// create an empty modbus client
var ModbusRTU = require("modbus-serial");

var client = new ModbusRTU();

exports.init = () => {
  console.log(client , !client._port)
  if ( !client._port || !client._port.openFlag) {

    console.log(client.connectTCP("192.168.1.203", { port: 502 }));
    console.log(client.setID(0));
  }

}
const reconnect = () => {
  console.log(client.connectTCP("192.168.1.203", { port: 502 }));
  console.log(client.setID(0));
}


exports.getHR = (dir, offset, callback) => {
  if (client._port && !client._port.openFlag) {
    reconnect();
    return false;
  }

  client.readHoldingRegisters(dir, offset, (err, data) => {
    if(err){
      return;
    }
    //console.log(data.data);
    callback(data);
  });
}
  
exports.write = ( register, data) => {
  if (client._port && !client._port.openFlag) {
    reconnect();
    return false;
  }
  // write the values 0, 0xffff to registers starting at address 5
  // on device number 1.
  client.writeRegisters(register, Array.isArray(data) ? data : [data])
      .then(a=>console.log(a));
}