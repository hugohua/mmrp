//上传模块JS
define(function(require, exports, module) {  
    var $ = require('jquery'),
    	localStore = require('localStore'),
    	ls = require('./mmrp.config.localstore'),
    	ModConfig = require('./mmrp.page.setting'),
    	c = require('./mmrp.config.user'),
    	Fun = require('./mmrp.func');
    
    var model = {
    	bg_style			:"#js_bg_style",								//背景css样式ID
		act_bg				:"#js_act_bg",									//上传背景显示的容器ID
		mod_container		:"#js_mod_container"							//页面容器
    };
    
    var page_id = Fun.getUrlParam("id");
    
    /***
	 * 获取预览背景
	 * return： css and html
	 */
	exports.getThemeCode = function(img_attr){
		// console.info(img_attr,'img_attr')
		var	page_width = 1002, 					//页面宽度
			page_height = 0,					//页面高度
			img_bg ="", 						//背景div 结构
			img_css = "",  						//背景 css 样式
			mod_cont_css = "",					//背景色和平铺背景
			bg_color = img_attr.bg_color, 		//背景色
			bg_rp = img_attr.bg_rp.name, 			//平铺背景
			img_arr = img_attr.bg_static;		//背景图
		
		for(var i in img_arr){
			img_bg += '<div class="' + img_arr[i]['class_name'] +'"></div> ';
			img_css += '.' + img_arr[i]['class_name'] + '{background:url("' + img_arr[i]['name'] + '") 50% 0 no-repeat;height:'+ img_arr[i]['height'] +'px}';
			page_height += img_arr[i]['height'];
		};
			
		//背景色
		bg_color &&	(mod_cont_css += 'background-color:' + bg_color +';');
		//平铺背景
		bg_rp && (mod_cont_css += 'background-image:url("' + bg_rp +'");background-repeat:repeat-x;');
		
		img_css += '.act_wrapper{'+ mod_cont_css +'}';
		
		//返回css 和 html
		var code = {
			style: img_css,
			body: img_bg,
			page_width: page_width,
			page_height:page_height
		};
		return code;
	};
	
	/***
	 * 设置背景到操作区域
	 * @param {Object} data :API 返回的JSON数据
	 */
	exports.setBgToContainer = function(tb_theme){
		var data = tb_theme.data.value,
			bg_list_arr = [], 
			bg_css = data.theme_css,
			bg_length = 0, 
			bg_code = '';
		//本地背景图
		if (data.theme_static) {
			bg_list_arr = JSON.parse(data.theme_static);
			
		}//网络图片
		else if(data.theme_remote_url){
			bg_list_arr = JSON.parse(data.theme_remote_url);
		};
		
		bg_length =bg_list_arr.length;
		//有数据时才进行操作
		if (bg_length) {
			for (var i = 1; i <= bg_length; i++) {
				bg_code += '<div class="bg_' + i + '"></div>';
			}
			$(model.act_bg).html(bg_code);
			$(model.bg_style).html(bg_css);
            $(model.mod_container).css({
                'width':data.theme_width,
                'height':data.theme_height
            })
		}
		console.info(tb_theme,data.theme_width,data.theme_height)
		
	};
	
	/**
	 * 获取图片路径 返回object 相对路径和绝对路径
	 */
	exports.getImgPath = function(){
		var page_info = localStore.getItem(ls.page_info_pre + page_id);
		
		return {
			//绝对路径 带网址
			absolute_path:c.root + "project/release_img/" + page_info.data.value.page_directory +"/",
			//相对路径 相对网站根目录
			relative_path:"project/release_img/" + page_info.data.value.page_directory +"/"
			//网络路径
		};
	};
	
	/**
	 * 获取背景图样式 
	 */
	exports.getBgStyle = function(){
		var style = $(model.bg_style).text();
		return style;
	};

});
