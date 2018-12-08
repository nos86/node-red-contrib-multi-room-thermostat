module.exports = function(RED) {

  function MRrT_Configuration(config) {
    RED.nodes.createNode(this, config);
    this.name = config.name
    this.temperature = config.temperature
    this.profiles = config.profiles
    //this.activities = config.activities
    this.on('input', function(msg){
      console.debug("Received " + msg.payload)
    })
  }

  RED.nodes.registerType("mrt-config",MRrT_Configuration);
}