export const localhost = ()=>{
  return '192.168.0.201'
  // let interfaces = require('os').networkInterfaces();
  // for (let devName in interfaces) {
  //   let iface = interfaces[devName];
  //   for (let index in iface) {
  //     let alias = iface[index];
  //     if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
  //       return alias.address;
  //     }
  //   }
  // }
};
