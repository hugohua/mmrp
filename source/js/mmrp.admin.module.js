define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	c = require('./mmrp.config.user'),
    	Fun = require('./mmrp.func'),
    	//Box
    	ModAdd = require('./mmrp.admin.module.add'),
    	ModEdit = require('./mmrp.admin.module.edit'),
    	
    	upload = require('./mmrp.mod.uploader');
    
    require('jquery.pubsub')($);
    
    var mod_id  = Fun.getUrlParam('mod_id');
    
    var model = {
    };
    
    /**
     * 上传图片事件
     */
    var initUploadImg = function(){
    	upload.createUploader('js_file_uploader','mod_img/',function(responseJSON){
			$("#js_mod_thumbnail").setValue(responseJSON.filename);
			$("#js_mod_imgshow").show().attr('src',c.root + 'mod_img/' + responseJSON.filename);
    	});
    };
    
    /**
     * 初始化按钮 
     */
	var initActionBtn = function(){
		mod_id &&	$('#js_mod_submit_btn,#js_mod_edit_btn').toggle();
	};
   	
	exports.init = function(){
		ModEdit.init();
		ModAdd.init();
		initActionBtn();
		// Events.init();
		// initStepStatus();
		initUploadImg();
		Fun.validateEvent('#js_mod_base');
		// inintModAction();
	};
    
    
})  