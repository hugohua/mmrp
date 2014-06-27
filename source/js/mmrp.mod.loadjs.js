define(function(require, exports, module) {  
    
    var $ = require('jquery');
    
    var model = {
   		mod_container		:"#js_mod_container",							//页面容器
   	};	
    	
    /**
	 * 加载js
	 */
	exports.loadApiJs = function($dom){
		var $mod = $dom.children(".js_box").children(),
			mod_js = $mod.attr("data-js"),
			$container =  $(model.mod_container);
		console.info($mod)	
		//如果存在js	
		if(mod_js){
			//添加js标签 代码
			if (!$("#js_mod_js").length) {
				$("<div id='js_mod_js' class='js_config_page' style='display:none' />").appendTo($container);
			};
			
			var page_js = $("#js_mod_js").html();
			//判断js里是否有同样的内容
			if(page_js.indexOf(mod_js) === -1){
				$("#js_mod_js").append(mod_js);
			};
			$mod.removeAttr("data-js");
		};
	};
	
	/**
	 * 获取所有JS内容 
	 */
	exports.getModsJs = function(){
		var data = $('#js_mod_js').html();
		return data;
	};
    
})  