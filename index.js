'use strict';

global.lothar = module.exports = require('feather2-lang');

lothar.cli.name = 'lothar';
lothar.cli.info = lothar.util.readJSON(__dirname + '/package.json');
lothar.require.prefixes.unshift('lothar');
lothar.config.merge({
    server: {
        type: 'php',
        rewrite: 'index.php'
    }
});

lothar.config.get('postprocessor').push('analyse');
lothar.config.get('postpackager').push('position', 'runtime');