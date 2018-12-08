module.exports = function(RED) {
  "use strict";
  var CronJob = require('cron').CronJob;
  function MrT_SetProfile(config) {
    RED.nodes.createNode(this, config);
    this.name = config.name
    this.config = RED.nodes.getNode(config.config);
    var node = this
    this.updateStatus = function(){
      var fill = "grey"
      if (this.config.isBoilerOn) fill = "yellow"
      this.status({fill:fill, shape:"dot", text:"Profile: " + this.config.current_profile})
    }
    this.cronjob = new CronJob('* * * * *', function(){
      console.log("Cron Event")
      node.updateStatus()
    });
    this.cronjob.start();
    this.updateStatus()
    this.on('input', function(msg){
      console.log(msg)
      if (this.config.setProfile(msg.payload)){ //Change profile
        this.updateStatus()
      }else{
        this.error("Profile " + msg.payload + " not recognized") //Generate exception
      }
    })
    this.on('close', function(){this.cronjob.stop()})
  }

  RED.nodes.registerType("mrt-set-profile",MrT_SetProfile);
}