module.exports = function(RED) {

  function MRrT_Configuration(config) {
    RED.nodes.createNode(this, config);
    this.name = config.name
    this.temperature = config.temperature
    this.profiles = config.profiles
    this.activities = config.activities
  }
  RED.nodes.registerType("mrt-config",MRrT_Configuration);
}