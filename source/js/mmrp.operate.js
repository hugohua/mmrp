define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	Fun = require('./mmrp.func'),
    	localStore = require('./mmrp.localstore'),
		c = require('./mmrp.config.user'),
    	//Box
    	BoxFun = require('./mmrp.mod.box.func'),
        BoxCpanel = require('./mmrp.mod.cpanel'),
        BoxAttr = require('./mmrp.mod.box.attr'),
        BoxEvent = require('./mmrp.mod.box.events'),
        BoxShort = require('./mmrp.mod.box.shortcuts'),
        BoxUndo = require('./mmrp.mod.box.undo'),
        BoxStyle = require('./mmrp.mod.box.style'),
        BoxJson = require('./mmrp.mod.box.jsonp'),
        ModList = require('./mmrp.tablist'),
        UploadBg = require('./mmrp.upload.bg'),
        PageSetting = require('./mmrp.page.setting'),
        Preview = require('./mmrp.preview'),
        Draft = require('./mmrp.save.draft'),
        SaveTmpl = require('./mmrp.save.template'),
        Publish = require('./mmrp.mod.publish'),
        //Events
        PopModals = require('./mmrp.mod.modals'),
        //Page
        BaseInfo = require('./mmrp.mod.base');
    
   	
   	require('jquery.contenteditable')($);
	
	var msg = {
		power_error_edit:'您没有修改其它用户页面的权限，请联系管理员开通！'
	};
	
	var model = {
		
		mod_container		:"#js_mod_container",							//页面容器
		act_content			:"#js_act_content",								//box操作区域容器
		style_pre			:"m_"									//样式前缀
		
	};
	
	var template_id = Fun.getUrlParam("template_id"),
		page_id = Fun.getUrlParam("id");
	
   	
   	var initTemplate = function(){
   		if(template_id){
   			RestApi.getTemplateById(template_id).success(function(data){
   				console.info('getTemplateById',data);
   				if(data && data.data && data.data.value){
   					initTemplateData(data.data.value);
   				}//if
			});
   		};
   	};
   	
   	/**
   	 * 加载page表数据 
   	 */
   	var initPage = function(){
   		if(page_id){
   			RestApi.getPageById(page_id).success(function(data){
   				localStore.setPageDataById(page_id,data);
   				//检测用户权限
   				checkEditPower(data.data.value.page_creator,data.data.value.page_authorizer);
   				BoxEvent.init();
   				BoxCpanel.init();
   			});
   		};//if
   	};
   	
   	/**
	 * 检查用户权限
	 * page_user_name:页面创建者
	 */
	var checkEditPower = function(page_user_name,page_authorizer){
		var req = Fun.checkPower();
		req.success(function(p_data){
			var user_power = parseInt(p_data.user_power,10),
				login_name = p_data.login_name,
				c_author = Fun.checkAuthorizer(page_authorizer);
			//录入员 并且 创建页面者不是录入员  则无权限
			console.info(user_power,login_name,page_user_name,c_author)
			if(user_power <= 10 && login_name !=page_user_name && !c_author){
				alert(msg.power_error_edit);
				window.location.href = "select_tp.htm";
			};//if
			
			
		});//getUserPower
	};
   	
   	
   	/***
	 * 
	 * 根据Json格式的数据加载Box
	 * @param {Object} data
	 */
	var initTemplateData = function(ajax_data){
		var data = ajax_data;
		var box_style = data.template_css; //css代码
		//说明存在数据
		if (box_style) {
			var box_data = data.template_html, //html代码
 				$box = $("<div />").append(box_data), 			//jquery html代码对象
				box_style_arr = box_style.split("}"); //根据"}"将字符串拆分为数组
//				ulog.info($box,box_data,"box")
			//页面设置 加载到操作区域
			$(".js_config_page",$box).appendTo($(model.mod_container));
			//$("#js_config_style",$box).appendTo($(model.mod_container));
			
			$(".js_box", $box).each(function(i){
				var id = box_style_arr[i].match(/\#([^{]+)/)[1], 				//模块的 类名 也是 id名
					style = box_style_arr[i].match(/\{([^\}]+)/)[1], 			//模块样式
					$this = $(this), 
					num = parseInt(id.replace(model.style_pre, ""), 10), 		//class id
 					mod_id = $this.attr("data-mod-id"),							//config.ids.mod_pre + 
 					mod_base_ids = $this.attr("data-mod-base-ids");
 					
				var $div = $("<div>", {
					id: id,
					"class": "edit_area js_drag_element",
					style: style
				}).append($this).appendTo($(model.act_content));
				
				if (mod_base_ids !== "0" && mod_base_ids != "" && mod_base_ids) {
					var mod_base = mod_base_ids.split(",");
					for (var m in mod_base) {
						ModList.setModBaseToHead(mod_base[m], $div);
					};//for
				};//if
				
				mod_id && ModList.setModToHead(mod_id,$div);
				
				$this.removeAttr('id');
				
				BoxEvent.addEvents($div);
				//设置计数器
				BoxFun.addCount(num);
				//模块计数器加1	
				BoxFun.setCount();
			});
		}
	};	
	

	/***
	 * 
	 * 加载用户编辑页面头部
	 */
	var showPageCtrl=function(){
		$("#pagectrl").html('<a href="javascript:;" class="mmrp_icon_prev" title="撤销">撤销</a><a href="javascript:;" class="mmrp_icon_next" title="重做">重做</a><a href="javascript:;" id="js_show_line" class="mmrp_icon_grid checked" title="显示网格线">网格</a><a href="javascript:;" id="js_show_assist" class="mmrp_icon_cursor checked" title="显示鼠标辅助线">鼠标辅助线</a><a href="javascript:;" id="js_show_cuts_link" class="mmrp_icon_cursor checked" title="显示快捷键">显示快捷键</a>');

		$("#mod_nav_sub").html('<ul class="mod_nav_sub"><li><a title="快捷键（Ctrl+B）" data-toggle="modal"  class="js_pop_btn" href="#J_mod_baseinfo" id="js_shift_i">页面信息(I)</a></li><li><a title="快捷键（Ctrl+B）" data-toggle="modal"  class="js_pop_btn" href="#js_mod_upload" id="js_shift_b">背景上传(B)</a></li><li><a title="快捷键（Ctrl+E）" data-toggle="modal"  class="js_pop_btn" href="#js_mod_config" id="js_shift_e">配置修改(E)</a></li><li><a title="快捷键（Ctrl+Q）" id="js_preview_btn" href="javascript:;">预览效果(Q)</a></li><li id="js_drop_list"><a href="javascript:;" class="js_save_draft_btn">保存草稿(S)</a><i class="arrow"></i><ul class="mod_nav_child"><li><a title="快捷键（Shift+S）" class="js_save_draft_btn" href="javascript:;">保存草稿(S)</a></li><li><a id="js_save_template_btn" href="javascript:;">保存模板</a></li></ul></li><li><a class="dis_op" id="js_publish_btn" href="javascript:;">内容发布</a></li></ul>');
	}   

	/**
	 * 初始化页面事件和效果 
	 */
	var initEvent = function(){
		BoxFun.guideShow();
		BoxFun.assistEvent();
	};
	
	
	
	exports.init = function(){
		
		Fun.initGlobal();
		
		initPage();
		showPageCtrl();
		initTemplate();
		
		ModList.init();
        //基本信息配置
        BaseInfo.init();

		PageSetting.init();
		Preview.init();
		Draft.init();
		PopModals.init();
		SaveTmpl.init();
		Publish.init();
		BoxShort.init();
		//获取css样式
		BoxStyle.init();
		BoxJson.init();
		initEvent();
		UploadBg.init();
		//初始化在线编辑工具栏
		$("body").fresheditor();
		//右键菜单
		$('body').bind('contextmenu', function(){
			return false;
		});
	};
    
    
})  