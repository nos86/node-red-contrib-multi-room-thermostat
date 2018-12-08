module.exports = function(RED) {

  function MRrT_Configuration(config) {
    RED.nodes.createNode(this, config);
    this.name = config.name
    this.temperature = config.temperature
    this.profiles = config.profiles
    this.activities = config.activities
    var node = this
    this.current_profile = this.profiles[0] //#FIXME: deve pescare dallo storage su file
    this.isBoilerOn = false
    this.setProfile = function(value){
      if (this.profiles.contains(value)){
        this.current_profile = value
        return true
      }else{ return false }
    }
    this.updateBoilerStatus = function(){
      var date = new Date();
      var minutes = (date.getHours() * 60 + date.getMinutes()) * 60 + date.getSeconds()
      for (var i=0; i < this.activities.length; i++){
        if (minutes > this.activities[i].from * 60 & minutes < this.activities[i].to * 60){
          this.isBoilerOn = true
          return true
        }
      };
      this.isBoilerOn = false
      return false
    }
  }
  RED.nodes.registerType("mrt-config",MRrT_Configuration);
}