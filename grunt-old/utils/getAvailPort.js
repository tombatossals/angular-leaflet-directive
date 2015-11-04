var exec =  require('shelljs').exec;

var isWin = /^win/.test(process.platform);

var isPortOpen =  function(port){
  var cmd;
  if(isWin)
  	cmd = 'netstat -an | find /i ":' + port + '" | find /i "listening"';
  else
  	cmd = 'lsof -i:' + port + " | tail -n 1 | awk '{print $2}'";
  var portResponse = exec(cmd, {silent:true}).output;
  return portResponse? false: true;
}

module.exports = function(startPort){
  while (!isPortOpen(startPort)){
    startPort += 1;
  }

  return startPort;
}
