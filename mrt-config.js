module.exports = function(RED) {

  function MRrT_Configuration(config) {
    RED.nodes.createNode(this, config);
    this.name = config.name
    this.temperature = config.temperature
    this.profiles = config.profiles
    this.activities = config.activities
    var node = this
    this.current_profile = this.profiles[0] //#FIXME: deve pescare dallo storage su file
    this.setProfile = function(value){
      if (this.profiles.contains(value)){
        this.current_profile = value
        return true
      }else{ return false }
    }
  }
  RED.nodes.registerType("mrt-config",MRrT_Configuration);
}