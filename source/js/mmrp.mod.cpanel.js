define(function(require, exports, module) {  
    
    var $ = require('jquery'),
   		Mustache = require('mustache'),
    	BoxAttr = require('./mmrp.mod.box.attr'),
    	Fun = require('./mmrp.func'),
    	c = require('./mmrp.config.user'),
    	BoxJson = require('./mmrp.mod.box.jsonp'),
    	BoxFun = require('./mmrp.mod.box.func'),
    	localStore = require('./mmrp.localstore'),
    	upload = require('./mmrp.mod.uploader');
    
   	require('jquery.field')($);
   	
   	var model = {
   		box_container : "#js_act_content",		//Box容器
   		box_panel:"#js_pop_guide",		//弹出框
   		mod_setting:".js_mod_setting",	//属性设置区域
   		cancel_btn:"#js_close_panel",	//取消按钮
		sumbit_btn:"#js_size_sumbit",	//提交按钮
		mod_style:"#js_mod_style",		//样式设置容器
		mod_style_tmpl:'#js_mod_style_tmpl',	//样式设置容器模板
		box_sets:".js_setting"			//需要设置的模块class
   	}
   	
   	/***
	 * 格式化style，加上px单位
	 * @param {Object} style_obj
	 */
	var addUnitsStyle = function(style_obj,units){
		var units = (typeof(units) != 'undefined') ? units : "px";
		var new_style_obj = {};
		for(var st in style_obj){
			//如果是数字的话
			if( $.isNumeric(style_obj[st]) && style_obj[st] !== ""){
				new_style_obj[st] = style_obj[st] + units;
			}else{
				new_style_obj[st] = style_obj[st];
			}
		}
		return new_style_obj;
	};
	
	/**
	 * 获取属性设置框的值
	 */
	exports.getInputValue = function(){
		var $dom = BoxFun.hasSelect(),
			font_weight = $("#js_fontWeight").prop('checked') == true ? "bolder" : "normal" ,
			text_decoration = $("#js_txtUnderline").prop('checked') == true ? "underline" : "none" ;
			
		var style = {
			//位置大小等信息
			width:$("#js_width").getValue(),
			height:$("#js_height").getValue(),
			left:$("#js_left_pos").getValue(),
			top:$("#js_top_pos").getValue(),
			overflow:$("input[name='js_txtOverflow']").getValue(),
			//全局样式设置
			color:					$("#js_colorNum").val(),								//字体颜色			
			"font-size":			$("#js_fontSize").val(),								//字体大小
			"line-height":			$("#js_lineHeight").val(),								//字体行高
			"font-weight": 			font_weight,
			"font-family": 			$("#js_font_family").getValue(),						//字型
			"text-decoration":		text_decoration,
			"text-align":			$("input[name='js_txtAlign']").getValue(),
			
			position:"absolute"
		},
		json = {
			class_name:				$("#js_class_name").getValue(),
			type:					$("#js_type").getValue(),								//模块类型
			style: 					style,													//不带单位
			style_unite:			addUnitsStyle(style),									//带单位
			url:					$("#js_goAddress").getValue(),							//链接地址
			title:					$("#js_picUrl").getValue(),
			link_text:				$("#js_link_text").getValue(),
			img_url:				$("#js_img_url").getValue(),
			iframe_url:				$("#js_iframe_url").getValue(),			//iframe url
			link_target:			$("input[name='js_link_target']").getValue(),			//
			mod_name:				$("#js_type_s").text()
		};
		return json;
	};
	
	
	exports.setInputValue = function(data){
		var data = data,
			line_height = data.style["line-height"] || "",
			link_target = data.link_target || "_self",
			font_size = data.style["font-size"] || "";
		
		$("#js_class_name").setValue(data.class_name);
		$("#js_class_name_s").text(data.class_name);
		$("#js_type_s").text(data.mod_name);
		$("#js_type").setValue(data.type);
		$("#js_width").setValue(data.style.width);
		$("#js_height").setValue(data.style.height);
		$("#js_left_pos").setValue(data.style.left);
		$("#js_top_pos").setValue(data.style.top);
		$("input[name='js_txtOverflow']").setValue(data.style.overflow);
		//链接
		$("#js_goAddress").setValue(data.url);
		$("#js_picUrl").setValue(data.title);
		$("#js_link_text").setValue(data.link_text);
		$("input[name='js_link_target']").setValue(link_target);
		//图片
		$("#js_img_url").setValue(data.img_url);
		//iframe
		$("#js_iframe_url").setValue(data.iframe_url);
		
		$("#js_fontSize").val(font_size);
		$("#js_font_family").setValue(data.style["font-family"]);
		$("#js_lineHeight").val(line_height);
		
		$("#js_fontWeight").setValue(data.style["font-weight"] || "normal");
		// ulog.info(data.style["font-weight"],'data.style["font-weight"]')
		if(data.style["font-weight"] === "bolder"){
			$("#js_fontWeight").prop("checked",true);
		}
		$("#js_txtUnderline").setValue(data.style["text-decoration"] || "none");
		if(data.style["text-decoration"] === "underline"){
			$("#js_txtUnderline").prop("checked",true);
		}
		$("#js_colorNum").setValue(data.style.color || "");
		$("input[name='js_txtAlign']").setValue(data.style["text-align"] || "inherit");

		//设置class			
		Fun.setInputClass($("input[name='js_link_overflow']:checked"));
		Fun.setInputClass($("input[name='js_text_overflow']:checked"));
		Fun.setInputClass($("input[name='js_link_target']:checked"));
		Fun.setInputClass($("input[name='js_play_icon']:checked"));
		Fun.setInputClass($("input[name='js_txtAlign']:checked"));
		Fun.setInputClass($("#js_fontWeight"));
		Fun.setInputClass($("#js_txtUnderline"));
	};
    
    /**
	 * Box 控制面板事件
	 */
	var boxPanelEvents = function(){
		$(":input",model.mod_setting).on("input.cpanel click.cpanel", function(e){
			var $dom = BoxFun.hasSelect();
			BoxAttr.setAttr($dom, exports.getInputValue());
			Fun.setInputClass($(e.target));
			//console.info('gggg')
		});
		//开启Box面板拖动事件
		$(model.box_panel).draggable();
		
		//保存并关闭事件
		$(model.cancel_btn).on("click.cpanel",function(){
			var $dom = BoxFun.hasSelect();
			//设置$dom的属性
			BoxAttr.setAttr($dom, exports.getInputValue());
			//禁用编辑状态
			BoxFun.disabledEdit($dom);
			//隐藏操作面板
			exports.hidePanel();
			//设置连接替换
			replaceLink($dom);
			return false;
		});
		
	};
	
	
	/**
	 * 链接替换
	 * @param {JQ Object} $a:jq链接对象
	 */
	var replaceLink = function($dom){
		if ($dom.data("type") === "base_p") {
			$("a[href^='javascript']", $dom).each(function(){
				var $a = $(this), 
					href = $a.attr("href"), 
					_link = href.match(/javascript:window.open\('([^']+)/)[1];
				$a.attr({
					"href":_link,
					"target":"_blank"
				});
			})
		}
	};

	
	/**
	 * 隐藏属性设置框
	 */
	exports.hidePanel = function(){
		$(model.box_panel).hide();
	};
	
	/**
	 * 设置样式文本框
	 * @param {Object} values
	 */
	var setStyleData = function(values){
		var tpl = $(model.mod_style_tmpl).html(),
			c_html = Mustache.to_html(tpl, values);
        $(model.mod_style).html(c_html);
	};
	
	var showSwitchClass = function(switch_data){
		var data = JSON.parse(switch_data);
		if(data.data[0]['group'].length){
			var tpl = $('#js_switch_template').html(),
				html = Mustache.to_html(tpl, data);
			$('#js_mod_switch').html(html);
		};
	};
	
	
	
	/**
	 * 重置表单
	 */
	var resetModStyleForm = function(){
		$(":input",model.mod_style).clearForm();
	};
	
	/**
	 * 显示属性设置项
	 */
	var showPanelSetting = function(setnum){
		console.info(setnum)
		var setnum = JSON.parse(setnum);
		var id_pix = 'js_set_';
		//默认先隐藏所有设置项
		$(model.box_sets).hide();
		for(var i in setnum){
			var id = setnum[i]['id'],
				name = setnum[i]['name'],
				$panel = $('#'+id_pix+id);
			$panel.show();
			name && $panel.children('legend').text(name);
		}	
	};
	
	/**
	 * 设置弹出层位置
	 * data:$dom 内数据
	 */
	var setPanelPosotion = function(data){
		//TODO 弹出层位置不准确
		//$(model.box_container)[0].opos || BoxFun.setParentOffset(true);
		var ops = $(model.box_container)[0].opos,			//父容器页面偏移量
			page_width = $(document).width(),			//页面宽度
			page_height = $(document).height(),			//页面高度
			pop_width = 620,							//弹出框宽度
			box_width = data.style.width,				//box宽度
			left = ops[0] + parseInt(data.style.left,10) + parseInt(box_width,10) + 20  , 		  //容器左偏移量
			top = ops[1] + parseInt(data.style.top,10) - 250,									 //容器上偏移量
			change = page_width - left;
		console.info(left,change,ops,data.style,box_width)
		//如果太高了
		if(top<0){
			top = 100;
		}
		//如果右侧不足以放下容器
		if(change<pop_width){
			left = ops[0] + parseInt(data.style.left,10) - 650;
			if(left<=0){
				left = Math.abs(left);
			}
		};
		$(model.box_panel).css({left:left,top:top}).show();	
	};
	
	/**
	 * 显示属性设置框
	 * @param {Object} values:
	 */
	exports.showPanel = function($dom){
		var dom_id = $dom.attr("id") ,
			data = BoxAttr.getAttr($dom),
			$box = $dom.find(".js_box:first"),
			type = $dom.data("type"),
			mod_id = $box.attr("data-mod-id"),
			setting_num = $dom.data('mod_setting'),
			setting_switch = $dom.data('mod_switch_class'),
			style_class_name = $box.attr("data-pri-style") ? ("js_" + $box.attr("data-pri-style")) : ("js_pri_" + dom_id),
			style_josn = JSON.parse($(model.box_container).find("input." + style_class_name).val() || '{}');

		//如果是同一个box，则不更新
		if( $("#js_class_name").val() === data.class_name  && ($(model.box_panel).is(":visible"))) return;
		
		exports.setInputValue(data);
		//设置显示位置
		setPanelPosotion(data);
		//设置样式设置框值
		style_josn && setStyleData(style_josn);
		//设置api数据
		BoxJson.showApiVal($dom);
		//设置属性设置列表
		setting_num && showPanelSetting(setting_num);
		//设置模块显示设置
		showSettringByType(type);
		//设置样式切换
		setting_switch && showSwitchClass(setting_switch);
	};
	
	/***
	 * 根据模块类型 显示 不同的设置框 满足更细化的设置 
	 */
	var showSettringByType = function(type){
		$('#js_link_text_l').show();
		switch(type){
			case 'base_poster':
			$('#js_link_text_l').hide();
			break;
		}
	};
	
		/**
	 * 切换class类
	 * @param {Object} sclass : 切换类名
	 * @param {Object} oldclass：原有在标签上的类名
	 */
	var switchClass = function(addclass,  removeclass){
		var $dom = BoxFun.hasSelect(),
			$mod = $dom.children(".js_box").first().children(), 
			aclass = addclass, rclass = removeclass;
		$mod.removeClass(rclass).addClass(aclass);
	};
	
	var Events = {
		imgTab:function(){
			/**
			 * 初始化tabs事件
			 */
			$("#js_set_5").on("click.tabs",'a',function(){
				var $this  = $(this),
					id = $this.attr("href");
				$this.addClass("selected").siblings("a").removeClass("selected");
				$(id).show().siblings(".js_u_tab").hide();
				return false;
			})
		},
		/**
		 * 上传图片插件和Tab事件
		 * //需要page信息
		 */
		uploadImg:function(){
			var page_id = Fun.getUrlParam("id"),
				page_info = localStore.getPageDataById(page_id),
				path = "project/release_img/" + page_info.data.value.page_directory +"/";
				
			upload.createUploader('js_drop_img_bg',path,function(responseJSON){
				if(!responseJSON.error){
					var img_url = c.root + responseJSON.directory + responseJSON.filename;
					$("#js_img_url").val(img_url).trigger('click');
					//非本地调试 调用同步图片api
					$.get(c.synImg(responseJSON));
				}
	    	});
		},
		/**
		 * 新增一行数据 或 减少一行数据
		 */
		appendRemoveDataEvent : function(){
			//新增事件
			$(model.box_panel).on('click.add',"#js_append_data_btn",function(){
				var $dom = BoxFun.hasSelect(),
					$clone = $dom.find(".js_clone:first").length ? $dom.find(".js_clone:first") : $dom.find("li:first");
				$clone.after($clone.clone())
			});
			//删除事件
			$(model.box_panel).on('click.del',"#js_remove_data_btn",function(){
				var $dom = BoxFun.hasSelect(),
					$clone = $dom.find(".js_clone:first").length ? $dom.find(".js_clone:first") : $dom.find("li:first");
				$clone.next().remove();
			});
		},
		
		/***
		 * 初始化切换事件
		 */
		switchClassEvent : function(){
			$("#js_mod_switch").on("change.switchclass",'input[type="radio"]',function(e){
				var $this = $(this),
					r_class = $this.attr("data-remove-class") || "",
					a_class = $this.attr("data-add-class") || "";			//切换的class
				switchClass(a_class,r_class);
				Fun.setInputClass($this);
			});
		},
		
		
		init:function(){
			this.imgTab();
			this.uploadImg();
			this.appendRemoveDataEvent();
			this.switchClassEvent();
		}
		
	}
	
	/**
	 * 初始化事件
	 */
	exports.init = function(){
		console.info('cpanel.init')
		boxPanelEvents();
		Events.init();
	};
	
});