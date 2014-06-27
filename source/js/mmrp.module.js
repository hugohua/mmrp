define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	c = require('./mmrp.config.user'),
    	Fun = require('./mmrp.func'),
    	//Box
    	ModAdd = require('./mmrp.module.add'),
    	ModEdit = require('./mmrp.module.edit'),
    	
    	upload = require('./mmrp.mod.uploader');
    
    require('jquery.pubsub')($);
    
    var model = {
    	mod_setp : '.js_mod_setp',//上一步 下一步按钮
		step_show	 : '#js_step_show',//显示上一步下一步的头部容器
    };
    
    /**
     * 上一步 下一步状态
     */
    var initStepStatus = function(){
    	var step = Fun.getUrlParam('step');
    	$.publish('mod/step',step);
    };
    
    /**
     * 更新上传图片
     */
    var initUploadImg = function(){
    	upload.createUploader('js_file_uploader','mod_img/',function(responseJSON){
			$("#js_mod_thumbnail").setValue(responseJSON.filename);
			$("#js_mod_imgshow").show().attr('src',c.root + 'mod_img/' + responseJSON.filename);
    	});
    };
    
    /**
   	 * 注册事件
   	 */
   	var Events  = {
   		/**
	   	 * 注册事件
	   	 */
   		subscribe:function(){
   			//订阅 获取模块
			$.subscribe('mod/step',$.proxy(function(topic,step){
				this.stepNextPre(step);
			},this))
   		},
   		
   		stepNextPre:function(step){
   			step = step || 1;
   			Fun.setUrlParam('step',step);
   			if(step && step == '1'){
   				$(model.step_show).removeClass('step_done_2').addClass('step_done_1');
   				$("#js_step_1").show();
   				$('#js_step_2').hide();
   			}else{
   				$(model.step_show).removeClass('step_done_1').addClass('step_done_2');
   				$("#js_step_1").hide();
   				$('#js_step_2').show();
   			}
			//$(model.step_show).toggleClass('step_done_1 step_done_2');
			//切换显示隐藏
			//$('#js_step_1,#js_step_2').toggle();
			//设置url
			
   		},
   		
    	/**
		 * 下一步  下一步 事件
		 */
		stepEvent: function(){
			var that = this;
			$(model.mod_setp).on("click",function(){
				var setp = $(this).attr('data-step');
				that.stepNextPre(setp);
				return false;
			});
		},
		
		init:function(){
			this.subscribe();
			this.stepEvent();
		}
    };
    
    
   	
	exports.init = function(){
		ModEdit.init();
		ModAdd.init();
		Events.init();
		initStepStatus();
		initUploadImg();
	};
    
    
})  