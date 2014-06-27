/**
 * @author hugohua
 */
define(function(require, exports, module) {  
	var $ = require('jquery'),
    	Draft = require('./mmrp.query.draft'),    	
    	Fun = require('./mmrp.func'),
    	Historys = require('./mmrp.query.history'),
    	user = require('./mmrp.config.user');

	exports.init = function(){
		Fun.initGlobal();
		console.info('init')
		Draft.init();
		Historys.init();
		$("#js_link_tmp").attr("href","view-source:"+user.root+"img/help/page_tmp.html");
	};

	
});
