define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	//BoxStyle = require('./mmrp.mod.box.style');
    	shortcut = require('shortcut');
    
   	require('jquery.contenteditable')($);
   	require('jquery.pubsub')($);
   	
   	var model = {
   		box_container : "#js_act_content",		//Box容器
   		box:'.js_box',//所有box都带有这个类 
   		drag_element:'.js_drag_element',//所有dom box都带有这个类
   		
   		y_view:'#js_y_view',//辅助线
   		x_view:'#js_x_view',
   		
   		mod_base_pub:'mod_base_pub_',//基础样式前缀
   		mod_pub:'mod_pub_',//样式前缀
   		
   		box_panel:"#js_pop_guide",		//弹出框
   		style_pre	:"m_"									//样式前缀
   	};
   	
   	var count = 0,
   		count_arr = [];
   		
   	/**
	 * 添加ctrl+V 事件
	 */
	var addCtrlVEvent = function(){
		shortcut.remove("ctrl+v");
		shortcut.add("ctrl+v",function(){
			var $dom = exports.hasSelect();
			exports.multiClone($dom);
			return false;
		}, { 'type': 'keydown', 'propagate': false,'disable_in_input':true });
	};	
	
	/**
	 * 设置计数器 
	 */
	exports.addCount = function(num){
		count_arr.push(num);
	};
   	
   	
	/***
	 * 设置容器的相对位置
	 */
	exports.setParentOffset = function(reset){
		reset = reset || false;
		var $container = $(model.box_container);
		
		//删除父元素定位值
		reset && delete $container[0].opos;
		
		//若无pos值
		if( typeof($container[0].opos) == "undefined"){
			var parent_offset = $container.offset();
			$container[0].opos = [parent_offset.left, parent_offset.top];
		}
	};//setParentOffset
   	
   	/**
	 * 设置计数器
	 */
	exports.setCount = function(){
		count++
		var num_arr = count_arr;
		for(var i in num_arr){
			if(num_arr[i] === count){
				exports.setCount();
			}
		};
	};
	
	
	/***
	 * 获取Box创建过的数目，用于设置ID
	 */
	exports.getCount = function(){
		return count;
	};
	
	/**
	 * 辅助线跟随鼠标 
	 */
	exports.guideShow = function(){
		$(model.box_container).on({
			mousemove:function(e){
				exports.setParentOffset();
				$(model.y_view).css('left', e.pageX - this.opos[0]);
    			$(model.x_view).css('top', e.pageY - this.opos[1]);
			}
		})
	};
	
	/**
	 * 右侧辅助性操作
	 */
	exports.assistEvent = function(){
		//显示鼠标辅助线
		$("#js_show_assist").toggle(
		  function () {
		    $(this).removeClass("checked");
			$("#js_x_view,#js_y_view").hide();
		  },
		  function () {
		    $(this).addClass("checked");
			$("#js_x_view,#js_y_view").show();
		  }
		);
		//显示网格线
		$("#js_show_line").toggle(
		  function () {
		    $(this).removeClass("checked");
			$("#js_bg_grid_view").hide();
		  },
		  function () {
		    $(this).addClass("checked");
			$("#js_bg_grid_view").show();
		  }
		);
		
		$('#js_show_cuts_link').on('click',function(){
			$('#js_short_cuts').show();
		})
	};
	
	/***
	 * 判断是否选中，选中则返回该对象
	 */
	exports.hasSelect = function(){
		//选中状态 是  editing_area_cls 类
		var $dom = $('.editing_area',model.box_container).first();
		if($dom.length === 1){
			return $dom;
		}
		console.info($dom)
		return $();
	};
	
	/**
	 * 更新样式计数器 用于样式和基础样式 
	 * num 默认值是1
	 */
	exports.updateStyleNum = function(id,num){
		var num = num || 1,
			$style = $('#'+id),
			real_num = $style.attr('data-num');//现有数量
		//负数 并且现有数量为小于等于1
		if( (num<0) && (real_num<=1) ){
			$style.remove();
		};
		console.info(num,real_num,id,$style)
		$style.attr('data-num',function(index,attr){
			
			return parseInt(num,10) + parseInt(attr,10);
		})
	};
	
	/***
	 * 深复制一个Box
	 * @param {Object} $dom : 需要复制的dom节点
	 */
	exports.clone = function($dom){
		var $container = $(model.box_container),
			$dom_clone = $dom.clone(true),
			OFFSET = 10;
		
		//计数器加 1 	
		exports.setCount();
		//获取新增后的ID
		var	new_id = model.style_pre + exports.getCount();
		//移除被复制对象的选中的状态
		$dom.removeClass("editing_area").removeClass("ui-multidraggable");
		//设置id 位置等信息
		$dom_clone.attr("id",new_id).css({
			left: function(index, value){
				//ulog.info(index,value,"left")
				return parseFloat(value) + OFFSET;
			},
			top: function(index, value){
				return parseFloat(value);
			},
			position:"absolute"
			
		}).addClass("editing_area");
		
		//TODO jquery 本身带有取消的func
		//取消juqery ui 事件
		$dom_clone.children(".ui-resizable-handle").remove();
		$dom_clone.removeData("draggable").removeData("multidraggable").removeData("resizable").unbind();
		
		//更新样式计数器
		var $box = $dom_clone.children(model.box),
			mod_base_ids = $box.attr("data-mod-base-ids"),//基础样式id
			mod_id = $box.attr("data-mod-id");//模块样式id
		
		$('input[type="hidden"],style',$box).remove();	
		
		//循环更新基础样式表计数器
		if(mod_base_ids){
			var mod_base_arr = mod_base_ids.split(',');
			for(var m in mod_base_arr){
				exports.updateStyleNum(model.mod_base_pub+mod_base_arr[m])
			}
			
		};
		//更新计数器
		mod_id && exports.updateStyleNum(model.mod_pub+mod_id);
		
		// exports.addEvents($dom_clone);
		//添加进操作面板
		$dom_clone.appendTo($container);
		
		//添加box事件( 因 seajs require循环运用问题 不能直接require box.events 文件)
		$.publish('mod/addevent',$dom_clone);
		
	};
	
	/**
	 * 多个复制
	 */
	exports.multiClone = function($dom){
		if(!$dom.length) return;
		//先判断是否是多个复制
		if ($dom.hasClass("ui-multidraggable")) {
			console.info($dom.siblings(".ui-multidraggable"))
			$dom.siblings(".ui-multidraggable").each(function(){
				exports.clone($(this));
			});
		};
		//再复制选中Box
		exports.clone($dom);
	};
		
	/***
	 * 删除一个Box
	 * @param {Object} $dom
	 */
	exports.remove = function($dom){
		var $box = $dom.children(model.box),
			mod_id = model.mod_pub + $box.attr("data-mod-id"),
			mod_base_ids = $box.attr("data-mod-base-ids");
		
		//删除样式
		exports.updateStyleNum(mod_id,-1);
		//基础样式存在则删除基础样式
		if (mod_base_ids && mod_base_ids !== "0" && mod_base_ids !== "") {
			var mod_base_arr = mod_base_ids.split(",");
			for(var m in mod_base_arr){
				exports.updateStyleNum(model.mod_base_pub + mod_base_arr[m],-1);
				//BoxStyle.removeModStyleToHead(model.mod_base_pub_ + mod_base_arr[m]);
			}
			
		};
		//删除dom接点
		$dom.remove();
		//隐藏Box操作面板
		$(model.box_panel).hide();
		//设置计数器
		//RestApi.updateModFrequency($box.attr("data-mod-id"),-1);
	};
	
	/**
	 * 多个删除
	 */
	exports.multiRemove = function($dom){
		if(!$dom.length) return;
		//先判断是否是多个删除
		if ($dom.hasClass("ui-multidraggable")) {
			$dom.siblings(".ui-multidraggable").each(function(){
				exports.remove($(this));
			});
		};
		//再删除选中Box
		exports.remove($dom);
	};
	
	/**
	 * 选择多个box 追加选择的box到多选框 
	 */
	exports.multiSelect = function($dom){
		$dom.addClass('ui-multidraggable');
	};
	
	/**
	 * 取消多个box 追加选择的box到多选框 
	 */
	exports.cancelMultiSelect = function($dom){
		$dom.removeClass('ui-multidraggable');
	};
	
	/**
	 * 取消多个拖动
	 */
	exports.cancelMultidraggable = function(){
		$(model.drag_element,model.box_container).removeClass('ui-multidraggable');
	};
	
	/**
	 * 开启编辑状态
	 */
	exports.enableEdit = function($dom){
		//2个插件有冲突，draggable会让fresheditor失去在线编辑功能
		$dom.draggable('disable').addClass("content_editable").find(model.box).fresheditor("edit",true);
		//在线编辑时 取消事件
		shortcut.remove("ctrl+v");
	};
	
	/**
	 * 取消编辑状态 开启拖动功能
	 */
	exports.disabledEdit = function($dom){
		$dom.draggable("enable").removeClass("content_editable").find(model.box).fresheditor("edit",false);
		addCtrlVEvent();
	};
	
	
	/**
	 * 对齐方式
	 * posotion : 对齐方式
	 */
	exports.alignmentEvent = function(position){
		var $alignBox = $(model.box_container).find(".ui-multidraggable"),
			firstPos = $alignBox.first().position(),
			_position;
			
		switch(position){
			case "left":
				_position = firstPos.left;
				$alignBox.css('left',_position)
			break;
			
			case "top":
				_position = firstPos.top;
				$alignBox.css('top',_position)
			break;
			
		}
	};
    
    
})  