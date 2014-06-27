define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	localStore = require('./mmrp.localstore'),
    	Mustache = require('mustache'),
    	c = require('./mmrp.config.user'),
    	BoxFun = require('./mmrp.mod.box.func'),
    	BoxEvent = require('./mmrp.mod.box.events'),
    	RestApi = require('./mmrp.rest');
    
   	require('jquery.ui')($);
   	
   	var model = {
   		mod_base_pub:'mod_base_pub_',//基础样式前缀
   		mod_pub:'mod_pub_',//样式前缀
   		
   		//添加模块容器
		drag_container		:"#js_draggable",
		style_pre	:"m_",									//样式前缀
		act_content			:"#js_act_content",								//box操作区域容器
		drag_element		:".js_drag_element",							//Box公共class

		/**
		 * 默认拖动模块的样式
		 */
		boxcss:{
			position:"absolute",
			overflow:"visible"
		},
		basecss:{
			width:"200px",
			height:"100px"
		}
	};
	
	var getCateList = function(){
		
		var _succ = function(data){
			data.data.value[0].cate_1 = true;
			listCate(data.data);
			getModList();
		}
		
		var data = localStore.getModCateList();
		if(data){
			_succ(data);
		}else{
			RestApi.getCateList().success(function(data){
				if(data && data.data){
					_succ(data);
					localStore.setModCateList(data);
				}
			});
		};//id
		
	};
	
	
	var listCate = function(data){
		var tpl = $('#js_cate_tmpl').html(),
			html = Mustache.to_html(tpl, data);
		$('#js_tabs_sidebar').prepend(html);
		
		var tpl2 = $('#js_cate_tmpl_2').html(),
			html2 = Mustache.to_html(tpl2, data);
		$('#js_tabs_sidebar2').html(html2);
	};
	
	/**
	 * 获取模块列表
	 */
	var getModList = function(){
		/**
		 *  获取数据后的回调函数
		 */
		var _getSuccess = function(data){
			var data = data.data.value;
			for(var i in data){
				var $li = modLiData(data[i]);
				addEvent($li);
			};
		};
		//模块列表
		var data = localStore.getModData();
		if(data){
			_getSuccess(data);
		}else{
			RestApi.getModListByCate(-1).success(function(data){
				_getSuccess(data);
				localStore.setModData(data);
			});
		};
	};
	
	/**
	 * 获取基础模块数据 写入缓存 
	 */
	var getModBaseList = function(){
		var data = localStore.getModBaseData();
		if(!data){
			RestApi.getBaseModData().success(function(data){
				localStore.setModBaseData(data.data.value);
			})
		}
	};

	/**
	 * 设置Li标签
	 * 单条模块记录
	 */
	var modLiData = function(li_data){
		var data = li_data,
			img_data = data.mod_thumbnail || "http://tacs.oa.com/img.php?150x80",
			img_path = c.root + "mod_img/",			//默认图片路径
			img_url = img_path + img_data,
			str = '<span>'+ data.mod_name + '</span>';
		if(img_data.indexOf('http://') !== -1){
			img_url = img_data;
		}
		var $li = $("<li />",{
				"class":"js_drag",
				"data-img":img_url,
				"title":data.mod_name
			})
			.css("background-image","url("+ img_url +")")
			.data("data",data)				//css
			.append(str)
			.appendTo(model.drag_container + '_' + data.mod_category);
		return $li;
	};
	
	/**
	 * 给Li添加事件
	 * @param {Object} $li
	 */
	var addEvent = function($li){
		$li.draggable({
			revert: 'invalid', // when not dropped, the item will revert back to its initial position
			helper: function(event){
				var img = $(this).attr("data-img");
				return $('<img />',{
					src :img
				});
			},
			cursor: 'move'
		});
	};
	
	/**
	 * 添加模块到操作面板
	 */
	var addModToContent = function(ui){
		var $li = $(ui.draggable),
			data = $li.data("data"),
			mod_id = model.mod_pub + data.mod_id,
			type = data.mod_type,
			mod_base_ids = data.mod_base_style_ids,
			html_code = data.mod_html;
		
		//模块计数器加1	
		BoxFun.setCount();
		//重新设置定位
		BoxFun.setParentOffset(true);
		//html结构添加到操作面板
		var $div = $("<div />",{
			id:model.style_pre + BoxFun.getCount(),
		})//.data("type",type)
		  //.data("mod_name",data.mod_name)
		  //.data("html_template",html_template)
		  .addClass("edit_area js_drag_element")
		  .css({
			"left":ui.offset.left - $(model.act_content)[0].opos[0],
			"top":ui.offset.top - $(model.act_content)[0].opos[1],
		}).css(model.boxcss)
		  .append('<div class="js_box" data-mod-id="'+ data.mod_id +'" data-mod-base-ids="'+ mod_base_ids +'">'+html_code+'</div>')
		  .appendTo(model.act_content);
		
		//iframe模块 需要新增一个空div进行覆盖 方便拖动
		if(type == "base_iframe"){
			$div.css(model.basecss).find("iframe").before("<div class='js_iframe_t'></div>");
		}else if(type === "base_link" || type === "base_p" || type === "base_img"){
			$div.css(model.basecss);
		};
		
		//将基础模块添加进操作页面
		if(mod_base_ids !== "0" && mod_base_ids !=="" && mod_base_ids){
			//ID arr		
			var mod_base = mod_base_ids.split(",");
			for (var m in mod_base) {
				exports.setModBaseToHead(mod_base[m],$div);
			};
		};
		//将独立样式添加进操作页面
		exports.setModToHead(data.mod_id,$div);
		//设置计数器
		//RestApi.updateModFrequency(data.mod_id,1);
		return $div;
	};
	
	
	/**
	 * 根据ID将独立样式插入至head
	 */
	exports.setModToHead = function(mod_id,$dom){
		var mod_pre_id = model.mod_pub + mod_id,
			data = localStore.getModDataById(mod_id);
		console.info(mod_pre_id,mod_id,"setModToHead",model.mod_pub,$dom.data('type'),mod_id,data);	
		//先获取缓存的数据，数据不存在，则获取DB的数据
		if (data) {
			addModStyleToHead({
				mod_id: mod_pre_id,
				css_code: data.mod_css
			});
			$dom.data("type",data.mod_type)
				.data("data_type",data.mod_data_type)
				.data("html_template",data.mod_html_template)
				.data("mod_name",data.mod_name)
				.data("mod_setting",data.mod_setting)
				.data("mod_switch_class",data.mod_switch_class);
			console.info($dom.data('type'))
		}
		else {
			RestApi.getModDataById(mod_id).success(function(data_ajax){
				
				var data = data_ajax.data.value;
				addModStyleToHead({
					mod_id: mod_pre_id,
					css_code: data.mod_css
				});
				$dom.data("type",data.mod_type)
				.data("html_template",data.mod_html_template)
				.data("mod_name",data.mod_name)
				.data("mod_setting",data.mod_setting)
				.data("mod_switch_class",data.mod_switch_class);
				
				console.info(data.mod_type,'datadatadata',$dom.data('type'))
			});
			
		}
	};
	
	/**
	 * 根据ID将基础样式插入至head
	 */
	exports.setModBaseToHead = function(mod_id,$dom){
		var mod_pre_id = model.mod_base_pub + mod_id,
			data = localStore.getModBaseDataById(mod_id);
			
		if (data) {
			addModStyleToHead({
				mod_id: mod_pre_id,
				css_code: data.mod_style_base,
				mod_style: 'js_mod_style'
			});
		}
		else {
			RestApi.getBaseModDataById(mod_id).success(function(data_ajax){
				//localStore.setItem(mod_pre_id,data_ajax);
				addModStyleToHead({
					mod_id: mod_pre_id,
					css_code: data_ajax.data.value.mod_style_base,
					mod_style: 'js_mod_style'
				});
			});
		}
	};
	
	
	/**
	 * 根据模块ID添加样式到head上
	 * @param {Object} {mod_id,css_code}
	 */
	var addModStyleToHead = function(obj){
		var obj = obj;
		//代码添加到head标签
		var $style = $("#"+obj.mod_id);
		//空标签
		if( !$style.length ){
			$("<style />",{
				id:obj.mod_id,
				"class":'js_mod_style',
				"data-num":1
			}).append(obj.css_code).appendTo("head");
		}else{
			console.info(obj.mod_id,$style)
			//更新计数器
			BoxFun.updateStyleNum(obj.mod_id)
		};
	};
	
	
	var addEventForContainer = function(){
		$(model.act_content).droppable({
			accept: '.js_drag',
//			activeClass: 'ui-state-highlight',
			drop: function(ev, ui){
				var $div = addModToContent(ui);
				BoxEvent.addEvents($div);
			}
		});
	};
	
	var addModEvent = function($div){
		//添加拖动事件
		$div.draggable({
			containment: $(model.act_content),
		});
		$div.bind({
			mousedown:function(){
				return false;
			}
		})
	};
	
	/**
	 * ,侧边栏效果
	 */
	var sidebarEvent = function(){
		$("#js_tabs_sidebar").on("click.sidebar",'.btn_tab',function(){
			$("#js_mod_add_container").toggleClass('open');
		});
		
		$("#js_tabs_sidebar").on("click.sidebar",'li:not(:last-child)',function(){
			var $this = $(this),
				id = $this.attr("data-id");
			$this.addClass("on").siblings().removeClass("on");
			$('#'+id).show().siblings().hide();	
			$("#js_mod_add_container").removeClass('open');
			return false;
				
		});
	};
	
	exports.init = function(){
		getCateList();
		getModBaseList();
		addEventForContainer();
		sidebarEvent();
	};
})  