const client = require('prom-client');

const Registry = client.Registry;
const register = new Registry();

// Create metrics
const secondsCounter = new client.Counter({
    name: 'seconds_elapsed',
    help: 'Seconds elapsed since program was started',
    registers: [register]
});

const rngGauge = new client.Gauge({
    name: 'random_number',
    help: 'Just a random number between 0 and 100',
    registers: [register]
});

// Auto-update counter every second
setInterval(() => {
    secondsCounter.inc(1, new Date());
}, 1000)

// Update the random number on a per-request basis
function updateGauge() {
    const rand = Math.floor(Math.random() * 100);
    rngGauge.set(rand, new Date());
}

// Export the Prometheus-style metrics handler
module.exports.handler = function(request, response) {
    updateGauge()
    response.end(register.metrics())
}