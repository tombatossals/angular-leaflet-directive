var exec =  require('shelljs').exec;

var isPortOpen =  function(port){
  var portResponse = exec('lsof -i:' + port + " | tail -n 1 | awk '{print $2}'", {silent:true}).output;
  return portResponse? false: true;
}

module.exports = function(startPort){
  while (!isPortOpen(startPort)){
    startPort += 1;
  }

  return startPort;
}
