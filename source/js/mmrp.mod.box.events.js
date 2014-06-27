define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	// shortcut = require('shortcut'),
    	BoxFun = require('./mmrp.mod.box.func'),
    	BoxCpanel = require('./mmrp.mod.cpanel'),
    	BoxAttr = require('./mmrp.mod.box.attr'),
    	BoxUndo = require('./mmrp.mod.box.undo'),
    	BoxSource = require('./mmrp.mod.source.edit'),
    	ContMenu = require('./mmrp.context.menu');
    
    require('jquery.pubsub')($);
    
   	var model = {
   		box_container : "#js_act_content",		//Box容器
		box_panel:"#js_pop_guide",				//box控制面板
   	}
   	
	/**
	 * Box事件
	 * @param {Object} $dom jquery对象
	 */
	exports.addEvents = function($dom){
		console.info('$dom.length',$dom.length)
		if($dom.length){
			var $container = $(model.box_container);
			//绑定事件
			$dom.bind({
				click: function(){
					var $this = $(this);
					
					//点击选中状态 其余box移除选中状态
					$this.addClass('editing_area').siblings().removeClass('editing_area');
					
					//其他选中模块 是否处于编辑状态 
					$this.siblings(".content_editable").each(function(){
						var $i = $(this);
						if($i.find(".js_box:first").attr("contenteditable")){
							BoxFun.disabledEdit($i);
						}
					});
					
					
					//控制面板如果是显示状态  则更新数据
					$(model.box_panel).is(":visible") && BoxCpanel.showPanel($dom);
					//使其失去焦点 chrome bug
					$(model.box_panel).find(':input').blur();
					
					//源码编辑 如果是显示状态 则更新数据
					$("#js_source_edit_pop").is(":visible") && BoxSource.sourceEdit($dom);
					//隐藏右键菜单
					ContMenu.hideContextMenu();	
					return false;
				},
				
				dblclick:function(){
					BoxCpanel.showPanel($dom);
					BoxFun.disabledEdit($dom);
					var type = $dom.data("type");
					//段落组件不需要在线编辑
					if(type === "base_p"){
						BoxFun.enableEdit($dom);
						
					}
					console.info('type',type)
					return false;
				}
			}).multidraggable({
					containment: $container,
					//开始
					start:function(){
						$dom.addClass("editing_area").siblings().removeClass("editing_area");
						//BoxUndo
						//var music_data = localStore.getItem(c.lstore.music_action) || [];
						BoxUndo.saveRepealBox($dom,"move");
						//隐藏右键菜单
						ContMenu.hideContextMenu();	
					},
					//拖动中
					drag: function(event, ui){
						if ($(model.box_panel).is(":visible")) {
							BoxCpanel.setInputValue(BoxAttr.getAttr($dom));
						}
					},
					//停止
					stop: function(event, ui){
						if ($(model.box_panel).is(":visible")) {
							BoxCpanel.setInputValue(BoxAttr.getAttr($dom));
						};
						// saveRepealBox($dom,"move");
					}
				}).resizable({
					containment: $container,
					start:function(){
						BoxUndo.saveRepealBox($dom,"resize");
						//隐藏右键菜单
						ContMenu.hideContextMenu();	
					},
					resize: function(event, ui){
						if ($(model.box_panel).is(":visible")) {
							BoxCpanel.setInputValue(BoxAttr.getAttr($dom));
						};
					}
					
				});
				// saveRepealBox($dom,"create");
				//右键
				ContMenu.contextMenu($dom);
		};//end if
		
		
	};//end events
	
	var Events = {
		/**
	   	 * 注册事件
	   	 */
   		subscribe:function(){
   			console.info('addEvents')
   			$.subscribe('mod/addevent',function(topic,data){
				exports.addEvents(data);
			})
   		},
   		closePop:function(){
   			$('button[data-dismiss]',model.box_panel).on('click',function(){
   				$(model.box_panel).hide();
   			})
   		}
   };
   
   exports.init = function(){
	Events.subscribe();
	Events.closePop();
   }
})  