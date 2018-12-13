module.exports = function(RED) {
    "use strict";
    //var CronJob = require('cron').CronJob;
    function MrThermostat(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name
        this.config = RED.nodes.getNode(config.config)
        this.positive_hysteresis = Math.abs(parseFloat(config.positive_hysteresis)) || 0;
        this.negative_hysteresis = Math.abs(parseFloat(config.negative_hysteresis)) || 0;
        this.minimum_heating_time = Math.abs(parseFloat(config.minimum_heating_time)) || 0;
        this.profiles = this.config.profiles
        this.temp_profiles = config.temp_profiles
        this.heater_status = false
        this.heating_since = null
        this.node_status = {fill: 'blue', shape: 'dot', text: 'Loading'}
        var node = this
        this.status(this.node_status)
        this.updateStatus = function(){
            var fill = "grey"
            if (this.config.isBoilerOn) fill = "yellow"
            this.status({fill:fill, shape:"dot", text:"Profile: " + this.config.current_profile})
        }
        /*this.cronjob = new CronJob('* * * * *', function(){
            console.log("Cron Event")
            node.updateStatus()
        });
        this.cronjob.start();
        this.updateStatus()*/
        this.getCurrentSetpoint = function(){
            var currentProfile = this.config.current_profile
            var profile = this.temp_profiles.filter((obj) => {return obj.name==currentProfile})
            if (profile.length==0){
                node.warn("Unable to find profile " + currentProfile + ' in node ' + this.name)
                return this.config.temperature
            }else{
                profile = profile[0]
                if (profile.setpoints.length == 0){
                    return this.config.temperature
                }else{
                    var date = new Date()
                    var minutes = date.getHours() * 60 + date.getMinutes()
                    var temp = profile.setpoints.filter((obj) => {return minutes >= obj.time})
                    if (temp.length > 0 ){ 
                        return temp.slice(-1)[0].temperature
                    }else{ 
                        return profile.setpoints.slice(-1)[0].temperature}
                }
            }
    
        }
        this.on('input', function(msg){
            var msg_target = Object.assign(RED.util.cloneMessage(msg), {"topic":"state"});
            var msg_heater = Object.assign(RED.util.cloneMessage(msg), {"topic":"heater"});
            switch (msg.topic.toLowerCase()) {
                case "currenttemperature":
                case "":
                case undefined:
                    if (typeof msg.payload === "string") {
                        msg.payload = parseFloat(msg.payload);
                    }
                    if (isNaN(msg.payload)) {
                        this.warn("Non numeric input");            
                    } else {
                        var setPoint = this.getCurrentSetpoint()
                        if (this.heater_status == false & msg.payload<setPoint-this.negative_hysteresis){
                            this.heater_status = true
                            this.heating_since = new Date()
                        }else if(this.heater_status & msg.payload>setPoint+this.positive_hysteresis){
                            if ((new Date()-this.heating_since)>=(60000*this.minimum_heating_time)){ //Transform minute to milliseconds
                                this.heater_status = false
                            }
                        }
                        this.node_status.fill = (this.heater_status ? 'yellow' : 'grey')
                        this.node_status.text = 'CUR: '+msg.payload + '° | SET: ' + setPoint + '°'
                        msg_target.payload = setPoint
                        if (this.config.isBoilerOn){
                            this.node_status.shape = 'dot'
                            msg_heater.payload = this.heater_status
                        }else{
                            this.node_status.shape = 'ring'
                            msg_heater.payload = false
                        }
                        this.status(this.node_status)
                        this.send([msg_target, msg_heater]);
                    }
                    break
                case "sethysteresisplus":
                case "sethysteresisminus":
                    if (typeof msg.payload === "string") {msg.payload = parseFloat(msg.payload);}
                    if (typeof msg.payload === "number") {
                        if (msg.payload.toLowerCase() == "sethysteresisplus"){
                            this.positive_hysteresis = msg.payload
                        }else{
                            this.negative_hysteresis = msg.payload
                        }
                    } else { this.warn("Payload of "+ msg.topic + " must be a number")}
                    break;
                default:
                    this.warn("invalid topic >"+msg.topic+"< - set msg.topic to e.g. 'currentTemperature'");
            }
        })
      //this.on('close', function(){this.cronjob.stop()})
    }
    RED.nodes.registerType("mrt-thermostat",MrThermostat);
  }