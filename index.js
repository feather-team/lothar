'use strict';

global.lothar = module.exports = require('../feather2');

lothar.cli.name = 'lothar';
lothar.cli.info = lothar.util.readJSON(__dirname + '/package.json');
lothar.require.prefixes.unshift('lothar');

lothar.config.merge({
    
});

lothar.on('conf:loaded', function(){
    lothar.config.set('namespace', lothar.config.get('project.modulename', ''));
});

lothar.on('conf:loaded', function(){
    var modulename = lothar.config.get('project.modulename'), name = lothar.config.get('project.name');     
    var isCommon = !modulename || modulename == 'common';     
       
    if(!name){      
        lothar.config.set('project.name', name = '_default');      
    }     
       
     //查找是否有common模块       
    if(isCommon){     
        lothar.info = {       
            config: {},     
            components: {},       
            map: {},      
            modules: {}       
        };        

    }else{        
        var root = lothar.project.getCachePath() + '/info/' + name
         + '.json';      

        if(lothar.util.exists(root)){        
            var info = lothar.util.read(root);       
               
            try{      
                lothar.info = (new Function('return ' + info))();     
            }catch(e){              
                lothar.log.error('Project\'s release info is not valid jsondata! Rerun common module please!');      
            }     
        }else{             
            lothar.log.error('Run common module first please!');     
        }     

        var info = lothar.info, config = lothar.config.get();

        lothar.config.set('template', info.config.template);            

        if(lothar.util.isEmpty(config.project.domain)){      
            lothar.config.set('project.domain', info.project.domain);        
        }     

        if(commonConfig.statics != config.statics){       
            lothar.log.warn('common module\'s statics[' + commonConfig.statics + '] is different from current module\'s statics[' + config.statics + ']!');      
        }     

        lothar.config.set('release', info);       

        var currentModifyTime = lothar.config.get('release.modules.' + modulename + '.modifyTime', 0);       
        var commonModifyTime = lothar.config.get('release.modules.common.modifyTime', 0);        

        if(commonModifyTime >= currentModifyTime){        
            lothar._argv.clean = true;       
            delete lothar._argv.c;       
        }     
    }    
});