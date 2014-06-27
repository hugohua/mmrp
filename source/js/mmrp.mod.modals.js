define(function(require, exports, module) {  
    
    var $ = require('jquery');
    
	require('bootstrap.modal')($);
    require('bootstrap.transition')($);
   	
   	require('bootstrap.tab')($);
   	
   	
   	
   	var popEvent = function(){
   		$('.js_pop_container').modal('hide')
   	};
   	
   	
   	exports.init = function(){
   		// popEvent();
   	}
   	
    
})  