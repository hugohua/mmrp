define(function(require, exports, module) {  
	
	var $ = require('jquery'),
	 	Mustache = require('mustache'),
    	Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest'),
    	
    	localStore = require('./mmrp.localstore'),
    	
    	Make = require('./mmrp.make.file');
	
	
	var	page_id = Fun.getUrlParam("id"),
		template_id =  Fun.getUrlParam("template_id");
	
	
	/**
	 * 获取tb template 数据
	 * @param {Object} draft 0是草稿，1是发布
	 */
	exports.getTemplateData = function(draft){
		draft = draft || 0;
		var	template_parent_id = 0,
			page_info = localStore.getPageDataById(page_id),
			template_name = page_info.data.value.page_name,
			code = Make.filterHtml();
		//如果是发布，则parent id 为 tmplate_id
		draft || (template_parent_id = template_id);
		
		var obj = {
			data:{
				table:"tb_template",
				value:{
					template_parent_id:template_parent_id,
					template_name:template_name,
					template_html:code.body,
					template_css:code.box_style,						//组件 style标签内的样式
					template_modstyle:code.mod_style ,					//组件样式和自定义样式
					template_status:draft,								//0是草稿，1是发布
					template_creator: Fun.getUserName(),
					template_date: Fun.getNowTime()
				},
				where:"template_id=" + template_id
			}
		};
		// ulog.info(obj,"test-2011-7-27");
		return obj;
	};
	
	/**
	 * 存储数据并生成文件
	 */
	var saveDataToDb = function(draft){
		draft = draft || 0;
		var template_data = getTemplateData(draft),
			req;
		//更新数据库
		if (template_id && draft) {
			//发布
			req = RestApi.postUpdata(template_data).success(function(data){
				ulog.info(tmplate_data,tmplate_id);
			});
		}else{
			//本条数据 parant id为0
			tmplate_data.data.value.template_parent_id = 0;
			//更新本条数据
			RestApi.postUpdata(tmplate_data);
			
			var draftData = tmplate_data,
				template_parent_id = parseInt(tmplate_id);
				
			draftData.data.value.template_parent_id = template_parent_id;
			//保存草稿
			req = RestApi.postAddData(draftData);
			
		}
		ulog.info(Fun.getNowTime(),draft,tmplate_data);
		return req;
	};
	
	
	exports.init = function(){
		Events.init();
	}
	
});
