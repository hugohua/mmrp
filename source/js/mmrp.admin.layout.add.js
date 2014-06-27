/**
 * 模块新增
 */
define(function(require, exports, module) {  
	
	var $ = require('jquery'),
		c = require('./mmrp.config.user'),
		// Mustache = require('mustache'),
    	Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest'),
    	upload = require('./mmrp.mod.uploader'),
    	LayoutGetSet = require('./mmrp.admin.layout.getset');
	
	var msg = {
		add_success:'添加模板成功！',
		edit_success:'修改模板成功',
		error:'信息录入不完整，请检查后重新提交！'
	}
	
	var addSuccess = function(){
		alert(msg.add_success);
	};
	
	var editSuccess = function(){
		alert(msg.edit_success);
	}
	
	var layout_id = Fun.getUrlParam('layout_id');
	
	var initLayout = function(){
		if(layout_id){
			RestApi.getLayoutById(layout_id).success(function(data){
				if(data && data.data){
					LayoutGetSet.setLayoutData(data.data.value);
				}
			});
			$('#js_layout_add,#js_layout_edit').toggle();
		};//if
	};
	
	var Events = {
		
		/**
	     * 更新上传图片
	     */
    	initUploadImg : function(){
	    	upload.createUploader('js_file_uploader','mod_img/',function(responseJSON){
				$("#js_layout_thumbnail").val(responseJSON.filename);
				$("#js_layout_imgshow").show().attr('src',c.root + 'mod_img/' + responseJSON.filename);
	    	});
	    },
		
		addDataEvent:function(){
			$('#js_layout_add').on('click',function(){
				var data = LayoutGetSet.getLayoutData();
				var validate = Fun.validate('#js_layout_form');
				if (validate) {
					//上传
					RestApi.postAddData(data).success(function(t_data){
						if(t_data.success){
							addSuccess();
							//更新缓存配置文件
							RestApi.updateLocalStore('layouts');
						}
					});
				}else{
					alert(msg.error);
				}
				return false;
			});
		},
		
		editDataEvent:function(){
			$('#js_layout_edit').on('click',function(){
				var data = LayoutGetSet.getLayoutData();
				//修改
				if(layout_id){
					RestApi.postUpdata(data).success(function(t_data){
						if(t_data.success){
							editSuccess();
							//更新缓存配置文件
							RestApi.updateLocalStore('layouts');
						}
					});
				}
				return false;
			});
		},
		
		init:function(){
			this.initUploadImg();
			this.addDataEvent();
			this.editDataEvent();
		}
	};
	
	
	/**
	 * 初始化
	 */
	exports.init = function(){
		Fun.initGlobal();
		initLayout();
		Events.init();
		Fun.validateEvent('#js_layout_form')
	};
	
	
});
