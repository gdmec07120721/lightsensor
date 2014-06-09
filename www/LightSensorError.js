var LightSensorError = function(err) {
    this.code = (err !== undefined ? err : null);
};

LightSensorError.LIGHTSENSOR_INTERNAL_ERR = 0;
LightSensorError.LIGHTSENSOR_NOT_SUPPORTED = 20;

module.exports = LightSensorError;
