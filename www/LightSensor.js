var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    utils = require('cordova/utils'),
    LightSensorLumen = require('./LightSensorLumen'),
    LightSensorError = require('./LightSensorError'),

    timers = {},
    LightSensor = {
        getCurrentLumen:function(successCallback, errorCallback, options) {
            argscheck.checkArgs('fFO', 'LightSensor.getCurrentLumen', arguments);

            var win = function(result) {
                var ch = new LightSensorLumen(result.value, result.timestamp);
                successCallback(ch);
            };
            var fail = errorCallback && function(code) {
                var ce = new LightSensorError(code);
                errorCallback(ce);
            };

            // Get environment light lumen
            exec(win, fail, "LightSensor", "getLumen", [options]);
        },

        watchLumen:function(successCallback, errorCallback, options) {
            argscheck.checkArgs('fFO', 'LightSensor.watchLumen', arguments);
            // Default interval (100 msec)
            var frequency = (options !== undefined && options.frequency !== undefined) ? options.frequency : 100;
            var filter = (options !== undefined && options.filter !== undefined) ? options.filter : 0;

            var id = utils.createUUID();
            if (filter > 0) {
                // is an iOS request for watch by filter, no timer needed
                timers[id] = "iOS";
                LightSensor.getCurrentLumen(successCallback, errorCallback, options);
            } else {
                // Start watch timer to get environment light lumens
                timers[id] = window.setInterval(function() {
                    LightSensor.getCurrentLumen(successCallback, errorCallback);
                }, frequency);
            }

            return id;
        },

        clearWatch:function(id) {
            // Stop javascript timer & remove from timer list
            if (id && timers[id]) {
                if (timers[id] != "iOS") {
                    clearInterval(timers[id]);
                } else {
                    // is iOS watch by filter so call into device to stop
                    exec(null, null, "LightSensor", "stopLumen", []);
                }
                delete timers[id];
            }
        }
    };

module.exports = LightSensor;
