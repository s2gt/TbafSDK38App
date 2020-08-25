import _ from 'lodash';
dev = require('./development.js');
prod = require('./production.js');

import Config from './Config';

const ENVS = {
    dev,
    prod,
}

function setEnvVariables(env = 'dev') {
    let currentEnv = ENVS[env];

    _.forEach(Object.keys(currentEnv), (key) => {
        _.set(Config, key, currentEnv[key]);
    });
}

export default setEnvVariables;