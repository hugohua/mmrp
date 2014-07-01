define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	Fun = require('./mmrp.func');
    	
    require('jquery.field')($);
   	
//   	var page_id = Fun.getUrlParam("id");
	
	// var model = {
		// page_name			: 	'#js_page_name',			//页面标题		
		// page_description	: 	'#js_page_description',		//页面描述
		// page_type			: 	'#js_page_type',			//活动类型,url类型
		// page_directory		: 	'#js_page_directory',		//页面路径
		// page_authorizer		: 	'#js_page_authorizer',			//编辑授权
		// page_authorizerValue:	'#js_page_authorizerValue',
		// page_date			: 	'#js_page_date'
	// }
	
   
   //获取需求信息
	exports.getPageInfo = function(){
		var page_obj = Fun.getDbData( '#js_form' );
		$.extend(page_obj, {'page_authorizer':$('#js_page_authorizerValue').val()});
		var obj =  {
			data: {
				table: "tb_page",
				value: page_obj,
				where:"page_id = "+ Fun.getUrlParam("page_id")
			}
		};
		return obj;
	}
	
	exports.setPageInfo = function(data){
		if(!data) return;
		Fun.setDbData(data);
		$('#js_page_authorizerValue').val(data.page_authorizer);
		// $(model.page_type).setValue(data.page_type);
		// $(model.page_name).val(data.page_name);
		// $(model.page_directory).val(data.page_directory);
		// $(model.page_description).val(data.page_description);
		// $(model.page_authorizerValue).val(data.page_authorizer);
		// $(model.page_date).text(data.page_start_date);
	};
   
    
    
})  