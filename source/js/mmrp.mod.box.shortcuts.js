define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	shortcut = require('shortcut'),
    	BoxFun = require('./mmrp.mod.box.func'),
    	BoxSource = require('./mmrp.mod.source.edit'),
    	BoxCpanel = require('./mmrp.mod.cpanel');
    
   	require('jquery.ui')($);
   	
   	/**
	 * 快捷操作
	 */
	var shortCuts = function(){
		var _setBox = function($dom,pos,num){
			var num = num || 1;
				// $dom = BoxFun.hasSelect();
			switch(pos) {
				case "height":
					$dom.css({
						height: function(index, value){
							return parseFloat(value) + num;
						}
					});
					break;
					
				case "width":
					$dom.css({
						width: function(index, value){
							return parseFloat(value) + num;
						}
					});
					break;
					
				case "top":
					$dom.css({
						top: function(index, value){
							return parseFloat(value) + num;
						}
					});
					break;
					
				case "left":
					$dom.css({
						left: function(index, value){
							return parseFloat(value) + num;
						}
					});
					break;
			}
//			BoxCpanel.setInputValue(BoxAct.getAttr($dom));
		};
		
		var _multiSetBox = function(pos,num){
			var $dom = BoxFun.hasSelect();
			if(!$dom.length) return;
			//先判断是否是多个选择
			if ($dom.hasClass("ui-multidraggable")) {
				$dom.siblings(".ui-multidraggable").each(function(){
					_setBox($(this),pos,num);
				});
			};
			//再设置选中Box
			_setBox($dom,pos,num);
		};
		
		var short_cuts = [
			{key:"delete",method:function(){
				var $dom = BoxFun.hasSelect();
				BoxFun.multiRemove($dom);
			}},
			{key:"shift+v",method:function(){
				var $dom = BoxFun.hasSelect();
				BoxFun.multiClone($dom);
			}},
			{key:"shift+up",method:function(){
				_multiSetBox("height",-1);
			}},
			{key:"shift+down",method:function(){
				_multiSetBox("height",1);
			}},
			{key:"shift+left",method:function(){
				_multiSetBox("width",-1);
			}},
			{key:"shift+right",method:function(){
				_multiSetBox("width",1);
			}},
			{key:"shift+a",method:function(){
				//先移除选中  最后再给第一个加上选中状态，是因为 担心如果没有选中状态的box时，删除 和 复制 功能无法使用
				$(".js_drag_element").removeClass('editing_area').addClass('ui-multidraggable').eq(0).addClass('editing_area');
			}},
			{key:"up",method:function(){
				_multiSetBox("top",-1);
			}},
			{key:"down",method:function(){
				_multiSetBox("top",1);
			}},
			{key:"left",method:function(){
				_multiSetBox("left",-1);
			}},
			{key:"right",method:function(){
				_multiSetBox("left",1);
			}},
			//左对齐
			{key:"shift+l",method:function(){
				BoxFun.alignmentEvent("left");
			}},
			{key:"shift+t",method:function(){
				BoxFun.alignmentEvent("top");
			}},
			{key:"shift+s",method:function(){
				$('.js_save_draft_btn').eq(0).trigger('click');
			}},
			{key:"shift+b",method:function(){
				$('#js_shift_b').trigger('click');
			}},
			{key:"shift+e",method:function(){
				$('#js_shift_e').trigger('click');
			}},
			{key:"shift+q",method:function(){
				$('#js_preview_btn').trigger('click');
			}},
			{key:"/",method:function(){
				console.info('gg')
				showShortCuts();
			}},
			{key:"shift+/",method:function(){
				console.info('gg')
				showShortCuts();
			}},
			{key:"shift+,",method:function(){
				console.info('gg')
				showShortCuts();
			}},
			{key:"shift+1",method:function(){
				console.info('gg')
				showShortCuts();
			}},
			
			
			
			//27
			{key:"esc",method:function(){
				var $dom = BoxFun.hasSelect();
				if ($dom.length) {
					BoxFun.disabledEdit($dom);
					BoxCpanel.hidePanel();
					BoxFun.cancelMultidraggable();
					BoxSource.hide();
				};
				hideShortCuts();
				
			}}
		];
		
		$.each(short_cuts,function(index,elem){
			shortcut.add(elem.key, function () {
				elem.method();
				return false;
			}, { 'type': 'keydown', 'propagate': false,'disable_in_input':true });
		});
	};
	
	
	/**
	 * 对齐方式快捷键
	 */
	var alignmentShortCuts = function(){
		var short_cuts = [
			{key:"Ctrl+l",method:function(){
				alignmentEvent("left");
			}},
			{key:"Ctrl+r",method:function(){
				alignmentEvent("right");
			}},
			{key:"Ctrl+b",method:function(){
				alignmentEvent("bottom");
			}},
			{key:"Ctrl+t",method:function(){
				alignmentEvent("top");
			}}
		];
		
		$.each(short_cuts,function(index,elem){
			shortcut.add(elem.key, function () {
				elem.method();
				return false;
			}, { 'type': 'keydown', 'propagate': false,'disable_in_input':true });
		});
	};
	
	var hideShortCuts = function(){
		$('#js_short_cuts').hide('fast');
	};
	
	var showShortCuts = function(){
		$('#js_short_cuts').show();
	};
	
	/***
	 * 快捷键弹窗事件 
	 */
	var shortCutsPop = function(){
		//开启面板拖动事件
		$('#js_short_cuts').draggable();
		//关闭事件
		$('#js_short_cuts button[data-dismiss]').on('click',function(){
			$(this).closest('.modal').hide('fast');
		});
	};
	
	exports.init = function(){
		shortCuts();
		shortCutsPop();
	}
    
    
})  