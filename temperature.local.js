var sensorLib = require('node-dht-sensor');
sensorLib.initialize(11,17);

module.exports = {
	getTemperatureCelsius: function() {
		return sensorLib.read().temperature.toFixed(2);
	},
	getTemperatureFahrenheit: function() {
		return (sensorLib.read().temperature*(9/5)+32).toFixed(2);
	},
	getHumidity: function() {
		return sensorLib.read().humidity.toFixed(2);
	}
};
