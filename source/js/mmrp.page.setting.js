define(function(require, exports, module) {  
	
	var $ = require('jquery'),
	 	Mustache = require('mustache'),
    	Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest');
	
	var model = {
		
		mod_container		:"#js_mod_container",							//页面容器
		
		page_size			:"page_size",									//页面大小（宽、高） 缓存
		
		//配置修改
		mod_config			:"#js_mod_config",								//配置修改容器
		page_config_cont	:'#js_page_config',								//配置修改内容区域id
		width_input			:"#js_width_input",								//页面宽度输入框
		height_input		:"#js_height_input",							//页面高度输入框
		config_sumbit_btn	:"#js_config_sumbit",							//配置修改提交按钮
		config_close_btn	:"#js_config_close",							//配置修改关闭按钮
		
		config_tmpl 		:'#js_page_config_tmpl',									//页面html模板
	};
	
	var theme_id = Fun.getUrlParam("theme_id") || 0;

	
	/**
	 * 设置页面宽高
	 * @param {Object} data
	 */
	exports.setPageSize = function(page_width,page_height){
		$(model.width_input).setValue( page_width );
		$(model.height_input).setValue( page_height );
		console.info($(model.height_input),page_height,'page_height')
		//设置页面宽度
		$(model.mod_container).css({width:page_width+ 'px' , height:page_height +'px'});
	};
	
	/**
	 * 获取页面配置输入框的值
	 */
	var getGlobalConfigValue = function(){
		var obj = {
			text_size : $("#js_g_text_size_input").val(),
			text_color : $("#js_g_text_color_input").val(),
			link_size : $("#js_g_link_size_input").getValue(),
			link_color : $("#js_g_link_color_input").val(),
			foot_text_color : $("#js_g_foot_text_color_input").val(),
			foot_link_color : $("#js_ g_foot_link_color_input").val(),
			foot_bg_color : $("#js_g_foot_bg_input").val(),
			font_family : $("#js_g_font_family").getValue()
		};
		var sel_index = $("#js_g_font_family option[value='"+ obj.font_family +"']").index();
		obj['sel'+sel_index] = true;
		return obj;
	};
	
	
	/**
	 * 修改全局字体样式
	 */
	var setGlobalConfig = function(){
		var obj = getGlobalConfigValue(),
			
			$style = $("#js_config_style"),			//style css
			$input = $("#js_config_style_input"),
			$container =  $(model.mod_container),	//页面容器
			style = '', wrapper = '', wrapper_a = '',foot = '',foot_a='';
		
		//拼装css 样式
		obj.text_size && (wrapper += 'font-size:' + obj.text_size + 'px;');
		obj.text_color && (wrapper += 'color:' + obj.text_color + ';');
		obj.font_family && (wrapper += 'font-family:' + obj.font_family + ';');
		//文本链接
		obj.link_size && (wrapper_a += 'font-size:' + obj.link_size + 'px;');
		obj.link_color && (wrapper_a += 'color:' + obj.link_color + ';');
		//底部文字
		obj.foot_text_color && (foot += 'color:' + obj.foot_text_color + ';');
		obj.foot_bg_color && (foot += 'background:' + obj.foot_bg_color + ';');
		//底部链接
		obj.foot_link_color && (foot_a += 'color:' + obj.foot_link_color + ';');
		
		//存在值 则添加样式
		wrapper && (style += '.act_wrapper{'+ wrapper +'}');
		wrapper_a && (style += '.act_wrapper a{'+ wrapper_a +'}');
		foot && (style += '.mod_footer{'+ foot +'}') ;
		foot_a && (style += '.mod_footer a{'+ foot_a +'}');
		 
		//添加style样式
		if ($style.length) {
			$style.html(style).prependTo( $container );
			$input.val(JSON.stringify(obj)).prependTo( $container );
		}
		else {
			$("<style type='text/css' id='js_config_style' class='js_config_page' />").html(style).appendTo($container);
			$("<input type='hidden' id='js_config_style_input' class='js_config_page' />").val(JSON.stringify(obj)).appendTo($container);
		}
	};
	
	/**
	 * 初始化加载全局设置
	 */
	var initGlobalConfig = function(){
		var style = $("#js_config_style").text(),			//css样式
			input = $("#js_config_style_input").val(),		//输入框值
			tpl = $(model.config_tmpl).html(),				//模板
			data = {},
			c_html;
		
		//test data
		// input = '{"text_size":"22","text_color":"#ccc","link_size":"","link_color":"","foot_text_color":"","foot_link_color":"","foot_bg_color":"","font_family":"Tahoma"}';
		// style = '.act_wrapper{font-size:22px;color:#ccc;font-family:Tahoma;}';
		
		if (input) {
			data = JSON.parse(input);
			$("#js_config_style").html(style);
		};
		c_html = Mustache.to_html(tpl, data);
		$(model.page_config_cont).html(c_html);
	};

	
	var Events = {
		/**
		 * 打开配置修改弹出层后  初始化显示内容
		 */
		modalInit:function(){
			$(model.mod_config).on('show', function () {
				//判断是否是第一次打开
				if( !$(model.page_config_cont).attr('data-first') ){
					initGlobalConfig();
					$(model.page_config_cont).attr('data-first',true);
				};
			  
			});
		},
		
		/**
		 * 保存配置修改 
		 */
		submitData:function(){
			$(model.config_sumbit_btn).on('click.submit',function(){
				//设置全局字体样式等
				setGlobalConfig();
				//获取宽高
				var page_width = $(model.width_input).val(),
					page_height= $(model.height_input).val();
				//存在宽高 则更新样式及页面
				if(page_width && page_height){
					//设置页面宽高						
					exports.setPageSize(page_width,page_height);
						//存在主题 则更新
						if (theme_id) {
							//更新theme表
							var obj = {
								data: {
									table: "tb_theme",
									value: {
										theme_width: page_width,
										theme_height: page_height
									},
									where: "theme_id=" + theme_id
								}
							};
							//更新theme
							RestApi.postUpdata(obj);
					};
				};//end if
				
				$(model.config_close_btn).trigger("click");
			});
		},
		
		init:function(){
			this.modalInit();
			this.submitData();
		}
	};
	
	/**
	 * 获取全局设置样式 
	 */
	exports.getConfigStyle = function(){
		var style = $("#js_config_style").text();
		return style;
	}
	
	
	
	exports.init = function(){
		Events.init();
	}
	
});
