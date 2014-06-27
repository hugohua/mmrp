/**
 * 模块新增
 */
define(function(require, exports, module) {  
	
	var $ = require('jquery'),
		c = require('./mmrp.config.user'),
    	Fun = require('./mmrp.func');
	
	var layout_id = Fun.getUrlParam('layout_id') || 0;
	
	exports.getLayoutData = function(){
		var layout_obj = Fun.getDbData( '#js_layout_form' );
		var obj = {
			data: {
				table:"tb_layout",
				value:layout_obj,
				// value:{
					// layout_name:$('#js_layout_name').val(),
					// layout_thumbnail:$('#js_layout_thumbnail').val(),
					// layout_html:$('#js_layout_html').val(),
					// layout_css:$('#js_layout_css').val(),
					// layout_status:1,
				// },
				where:'layout_id = ' + layout_id
			}
		};
		return obj;
	};
	
	exports.setLayoutData = function(data){
		Fun.setDbData(data);
		//$("#js_layout_name").val(data.layout_name);									//组件中文名
		//$("#js_layout_thumbnail").val(data.layout_thumbnail);						//组件类别ID
		//$("#js_layout_html").val(data.layout_html);								//组件结构代码(HTML)
		//$("#js_layout_css").val(data.layout_css);			//组件结构代码(HTML)
		$("#js_layout_imgshow").show().attr('src',c.root + 'mod_img/' + data.layout_thumbnail);
	};
	
	
});
