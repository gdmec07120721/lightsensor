var LightSensorLumen = function(lumen, timestamp) {
  this.value = lumen;
  this.timestamp = timestamp || new Date().getTime();
};

module.exports = LightSensorLumen;
