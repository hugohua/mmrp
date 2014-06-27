define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	Mustache = require('mustache'),
    	Fun = require('./mmrp.func'),
    	c = require('./mmrp.config.user'),
    	BoxFun = require('./mmrp.mod.box.func'),
    	LoadJs = require('./mmrp.mod.loadjs'),
    	RestApi = require('./mmrp.rest');
    
   	require('jquery.ui')($);
   	
   	var model = {
   		get_success:'#js_gui_suc',
   		mod_setting:"#js_mod_setting",	//属性设置区域
   		api_btn:"#js_api_btn",			//api 数据获取按钮
		api_input:"#js_api_input",		//api item id
		api_url_input:'#js_api_url_input'//api url 输入框
		
   	};
   	
   	var page_id = Fun.getUrlParam("page_id"),
		template_id = Fun.getUrlParam("template_id");
   	
   	/**
   	 * 获取数据后调用 
   	 */
   	var getDataSuccess = function(){
		$(model.get_success).addClass("shown");
		setTimeout(function(){
			$(model.get_success).removeClass("shown");
		}, 1000)
	};
	
	/**
	 * 设置url,如果是数字，则自动补齐URL
	 */
	var changeUrl = function(url,type,mod_id){
		var real_url = parseInt($.trim(url),10) ,
			mod_id = mod_id,								//模块ID
			url_type = "";									//获取数据cgi类型
		//如果是数字的话
		if( $.isNumeric(real_url) ){
			real_url = c.mod_data_api + url_type + "type="+ type +"&modid="+ mod_id +"&pageid="+ page_id +"&itemid="+ url;
		}else{
			real_url = url;
		}
		return real_url;
	};
	
	/**
	 * 获取模块数据
	 * @param {Object} url
	 */
	var getModApiData = function(url,$dom){
		var type = $dom.data("type"),
			data_type = $dom.data('data_type'),
			$box = $dom.find('.js_box:first'),
			mod_id = $box.attr("data-mod-id"),
			api_url = changeUrl(url,type,mod_id);
		
		console.info(api_url,data_type,"api");
		
		$.ajax({
			url:api_url,
			success:function(data){
				if(data){
					console.info('success',data);
					//显示成功提示信息
					getDataSuccess();
					//设置模块数据
					setModData(data,$dom);
					//设置api 属性
					setApiAttr($box,api_url);
					//加载JS脚本
					LoadJs.loadApiJs($dom);
				};
			}
		});//ajax
	};//getModApiData
	
	
	/**
	 * 设置模块数据
	 * @param {Object} data
	 * @param {Object} $dom
	 * @param {Object} clone
	 */
	var setModData = function(data, $dom){
//		ulog.info(data,"setModData");
		var $box = $dom.find(".js_box:first"),
			id = $dom.attr("id"),							//模块ID
			mod_itemid = $dom.attr("data-mod-itemid"),		//获取数据成功的模块ID
			tpl = $dom.data("html_template"),
			data_type = parseInt($dom.data("data_type"),10),
			c_html = data_type ?  data : Mustache.to_html(tpl, data);		//如果data_type是0 则是html  否则是json
		console.info(data_type,'data')
		//是否存在独立样式设置
    	//样式和输入框
		$style_input = mod_itemid ? $dom.find(".js_pri_m_"+ mod_itemid) : $dom.find("style.js_pri_"+ id);
        //替换新的数据
        $box.html(c_html);
        //插入独立样式
        $box.prepend($style_input);
		
	};
	
	/**
	 * 设置api url 
	 */
	var setApiAttr = function($box,api_url){
		$box.attr({
			"data-mod-itemid":$(model.api_input).val(),
			"data-mod-api":api_url
		});
	};
	
	
	exports.showApiVal = function($dom){
		var $box = $dom.children(".js_box:first"),
			type = $dom.data('type'),
			pure_id = $dom.attr("id").replace("m_",""),
			item_id = $box.attr("data-mod-itemid") || pure_id,
			mod_id = $box.attr("data-mod-id"),
			mod_api = $box.attr("data-mod-api") || changeUrl(pure_id,type,mod_id);
			
		$(model.api_input).val(item_id);
		$(model.api_url_input).val(mod_api);
	};
	
	
	var Events = {
		/**
		 * 改版url链接 
		 */
		changeUrl:function(){
			$(model.mod_setting).on("input",model.api_input,function(){
				console.info('good')
				var $dom = BoxFun.hasSelect(),								//选中的模块
					$box = $dom.children(".js_box:first"),					//模块容器
					mod_id = $box.attr("data-mod-id"),						//获取数据的模块id
					val = $(this).val(),									//输入框内本身的id值
					type = $dom.data("type");								//模块类型
					
				$box.attr("data-mod-itemid",val);
				$(model.api_url_input).effect("highlight",1000).val( changeUrl(val,type,mod_id) );
			});
		},
		
		getModData:function(){
			$(model.mod_setting).on('click',model.api_btn,function(){
				var $dom = BoxFun.hasSelect(),
					url = $(model.api_url_input).val();
				getModApiData(url,$dom);
			});
		},
		
		init:function(){
			console.info('initBoxJSON');
			this.changeUrl();
			this.getModData();
		}
	};
	
	exports.init = function(){
		Events.init();
	};
	
})  