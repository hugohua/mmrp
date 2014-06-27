/**
 * 生成文件
 */
define(function(require, exports, module) {  
	var $ = require('jquery'),
    	Mustache = require('mustache'),
    	
    	localStore = require('./mmrp.localstore'),
    	
    	c = require('./mmrp.config.user'),
    	Fun = require('./mmrp.func'),
    	
    	RestApi = require('./mmrp.rest'),
    	
    	PageSetting = require('./mmrp.page.setting'),
    	LoadJs = require('./mmrp.mod.loadjs'),
    	BgFun = require('./mmrp.upload.bg.func');

	/**
	 * layout 布局 
	 */
	var layout_id = Fun.getUrlParam("layout_id"),
		template_id =  Fun.getUrlParam("template_id"),
		page_id = Fun.getUrlParam("id");
	
	var model = {
		body_container		:"#js_body_container",							//页面容器夫级元素
		drag_element	: 	'.js_drag_element',								//所有dom box都带有这个类
		act_content			:"#js_act_content",								//box操作区域容器
		act_bg				:"#js_act_bg",									//上传背景显示的容器ID
		style_pre			:"mod_style_",									//样式前缀
	}
	
	/***
	 * 设置模板html
	 * @param {Object} data = {style:style//页面所有css ;body:body//操作面板内的模块结构}
	 */
	var setTemplate = function(){
		var layout_data = localStore.getLayoutDataById(layout_id),			//tb_layout 表数据
			page_info = localStore.getPageDataById(page_id).data.value,				//tb_page 表数据
			source_data = exports.filterHtml(),
			
			html_tpl  = layout_data.layout_html,											//获取模板内容,
			style_str = layout_data.layout_css + source_data.box_style + source_data.mod_style + source_data.bg_style ,								//完整 页面所需的css
			layout_js = LoadJs.getModsJs(),												//页面需要的js
			must_data = $.extend({},page_info,layout_data,{javascript:layout_js,body:source_data.body_clear,page_id:page_id}),//合并数据
			html = Mustache.to_html(html_tpl, must_data),
			obj = {
				html:html,
				css:style_str
			};																	//完成的html文件
			// console.info(must_data,html)
		return obj;
	};
	
	/**
	 * 过滤css样式
	 * @param {Object} arr_css
	 */
	var filterBoxCss = function(css_data){
		var regexp = /font-weight:\s*normal\s*;|text-align:\s*inherit\s*;|text-decoration:\s*none\s*;|overflow-x:\s*visible\s*;|overflow-y:\s*visible\s*;|overflow:\s*visible\s*;/g,
			_css_data = css_data.replace(regexp,"");
		return _css_data;
	};
	
	/***
	 * 过滤html
	 * @param clear 是否需要过滤干净的结构  干净的结构用于生成文件 完整的结构用于存入DB
	 */
	exports.filterHtml = function(){
		// clear = clear || false;
		var $container = $(model.body_container),
			data = $container.html(),
			$data = $("<div />").append(data),
			pri_style_css = '',											//私有样式
			mod_style ='',												//mod样式
			box_style = '';												//模块style样式
		
		//删除多余dom
		$("#js_bg_grid_view,#js_x_view,#js_y_view",$data).remove();
		//删除ui产生的dom
		$(".ui-resizable-handle",$data).remove();
		$(".js_mod_pos",$data).remove();
		
		var $data_clear = $data.clone();
		
		//clear
		$(model.act_content,$data_clear).removeClass("ui-droppable").removeAttr("id");
		$(model.act_bg,$data_clear).removeAttr("id");
		$(".js_config_page",$data_clear).remove();						//删除多余页面设置信息
		
		$(model.drag_element,$data_clear).each(function(i){
			var $this = $(this),
				$child = $this.children('.js_box').first(),
				id = $this.attr("id"),
				pri_style = $this.find("style").text(),			//独立样式
				style = $this.attr("style");					//dom 的 style内样式
			
				
			box_style += '#' + id + '{' + style + '}';
			pri_style_css += pri_style;
			
			//加载JS脚本
			LoadJs.loadApiJs($this);
			//过滤干净的样式
			$('input[class^="js_pri"],style[class^="js_pri"],.js_iframe_t,.js_temp',$this).remove();
			$child.removeAttr("data-id data-mod-base-ids data-mod-id data-title data-url data-color data-img_url data-iframe_url data-mod-api data-mod-itemid data-link_target data-link_text data-pri-style contenteditable")
				  .removeClass('js_box');
				  
			//如果是本窗口打开 则去除_self
			$child.find("a[target]").each(function(){
				var $this = $(this),
					target = $this.attr("target");
				if(target === "_self"){
					$this.removeAttr("target");
				}
			});
			
			$child.attr("id",id).unwrap();
		});
		
		//完整dom结构也需要去掉外层
		$(model.drag_element,$data).each(function(i){
			var $this = $(this),
				id = $this.attr("id");
			$this.children('.js_box').first().attr("id",id).unwrap();
		});
		
//			template_style += $("#js_config_style").text();//全局样式
		//模块样式
		$('.js_mod_style',"head").each(function(){
			mod_style += $(this).text();
		});
		
		pri_style_css += PageSetting.getConfigStyle();
		//删除多余垃圾代码
		box_style = filterBoxCss(box_style);
		var code = {
			box_style:box_style,					//拖动区域的box 样式
			mod_style:mod_style + pri_style_css,					//组件样式 + 自定义样式
			//pri_style:pri_style_css,				// 自定义样式
			bg_style:BgFun.getBgStyle(),					//背景图样式
			body:$data.html(),						//拖动区域的html代码片段，包括背景图
			body_clear:$data_clear.html()			//包括背景的完整代码
		}
		return code;
	};
	
	/**
	 * 生成文件
	 * @param {Object} folder_dir ：生成路径
	 */
	exports.makeFile = function(folder){
		folder = folder ||  "release";
		
		var page_info = localStore.getPageDataById(page_id),
			layout_data = localStore.getLayoutDataById(layout_id),
			//用于图片替换
			img_src =  BgFun.getImgPath().absolute_path,
			real_src = c.real_img + page_info.data.value.page_directory + '/',
			
			file_data = setTemplate(),
			html_data = file_data.html,
			css_data = file_data.css,
			folder_dir = 'project/' + folder + '/' + page_info.data.value.page_directory;
		
		// console.info('makefile',page_info)
		//如果是临时文件夹的话则不需要替换
		if(folder.indexOf("_temp") === -1){
			html_data = Fun.replaceAll(html_data,img_src,real_src);
		};
		
		//生成文件
		var mkq = $.post(c.root + "mk_file.php", {
			folder: folder_dir,
			page_id:page_id,
			html: html_data,
			charset:layout_data.layout_charset,
			css:css_data
		});
		console.info(layout_data,"code.bg_style")
		return mkq;
		
	};
	
	
	
	
	
	
	exports.init = function(){
	};
	
});
