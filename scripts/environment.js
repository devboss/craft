const buildEnv = process.env.TARGET_ENVIRONMENT;
const nodeEnv = process.env.NODE_ENV || 'production';

console.log( 'In environment nodeEnv=' + nodeEnv + ' buildEnv=' + buildEnv );

const environment = {};
const baseUrls = {
    development: 'http://localhost:3000',
    cms: 'https://cms.rerum.app',
    staging: 'https://staging.laplanduk.co.uk',
    production: 'https://www.laplanduk.co.uk'
};

const baseUrl = baseUrls[ nodeEnv ];

environment.baseUrl = baseUrl;
environment.cssImagePath = baseUrl + '/images';

module.exports = environment;
