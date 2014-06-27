/**
 * 生成文件
 */
define(function(require, exports, module) {  
	var $ = require('jquery');
    	
    	Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest'),
    	Template = require('./mmrp.mod.template');

	/**
	 * layout 布局 
	 */
	var layout_id = Fun.getUrlParam("layout_id"),
		template_id =  Fun.getUrlParam("template_id"),
		page_id = Fun.getUrlParam("id");
	
	var model = {
		drop_list			:'#js_drop_list',
		save_draft_btn		:".js_save_draft_btn",							//保存草稿
	};
	
	var msg = {
		save_success : '草稿保存成功'
	}
	
	var Events = {
		/**
		 * 下拉效果
		 */
		dropDownEvent:function(){
			$(".arrow",model.drop_list).on("click.drop",function(){
				$(this).next().toggleClass("mod_nav_child_open");
			return false;
			});
			
			$("a",model.drop_list).click(function() {
				$("ul",model.drop_list).removeClass('mod_nav_child_open');
			});
		},
		
		/**
		 * 保存草稿 
		 */
		saveDraft:function(){
			$(model.save_draft_btn,model.drop_list).on('click.save',function(){
				var template_data = Template.getTemplateData();
				RestApi.saveDraft(template_id,template_data).success(function(data){
					//保存草稿成功!
					if(!data.error){
						alert(msg.save_success)
					}
				});
			});
		},
		
		init:function(){
			this.dropDownEvent();
			this.saveDraft();
		}
		
	};
	
	
	
	
	
	exports.init = function(){
		Events.init();
	};
	
});
