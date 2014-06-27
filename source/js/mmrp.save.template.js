/**
 * 保存为模板
 */
define(function(require, exports, module) {  
	var $ = require('jquery');
    	
    	Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest');

	/**
	 * layout 布局 
	 */
	var page_id = Fun.getUrlParam("id");
	
	var model = {
		save_template_btn	:"#js_save_template_btn",						//保存模板
	};
	
	var msg = {
		confirm:'确定要保存模板吗？',
		save_success : '模板保存成功'
	}
	
	var Events = {
		
		/**
		 * 保存草稿 
		 */
		saveTemplate:function(){
			$(model.save_template_btn).on('click.save',function(){
				if (confirm(msg.confirm)) {
					var obj = {
						data: {
							table: "tb_page",
							value: {page_is_template: 1},
							where: "page_id = " + page_id
						}
					};
					RestApi.postUpdata(obj).success(function(t_data){
						t_data.success &&	alert(msg.save_success);
					});
				};//if 
			});
		},
		
		init:function(){
			this.saveTemplate();
		}
		
	};
	
	
	
	
	
	exports.init = function(){
		Events.init();
	};
	
});
