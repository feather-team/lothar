'use strict';

global.lothar = module.exports = require('feather2-lang');

lothar.cli.name = 'lothar';
lothar.cli.info = lothar.util.readJSON(__dirname + '/package.json');
lothar.cli.version = function(){        
    console.log(('Version: ' + feather.cli.info.version).bold.red);
};
lothar.require.prefixes.unshift('lothar');
lothar.config.merge({
    server: {
        type: 'php',
        rewrite: 'index.php'
    }
});
lothar.config.set('template', {
    suffix: 'html',
    tags: {
        raw: ['{!!', '!!}'],
        content: ['{{', '}}'],
        escapedContent: ['{{{', '}}}']
    }
})

lothar.config.get('postprocessor').push('analyse');
lothar.config.get('postpackager').push('position', 'runtime');