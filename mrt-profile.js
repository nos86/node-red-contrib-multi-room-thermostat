module.exports = function(RED) {

    function MRrT_SetProfile(config) {
      RED.nodes.createNode(this, config);
      this.name = config.name
      this.profile = config.profile
      this.on('input', function(msg){
        console.debug("Received " + msg.payload)
      })
    }
  
    RED.nodes.registerType("mrt-set-profile",MRrT_SetProfile);
  }