define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	BoxSource = require('./mmrp.mod.source.edit'),
    	BoxFun = require('./mmrp.mod.box.func');

    require('jquery.browser')($);
   	require('jquery.contextMenu')($);
   	
   	exports.contextMenu = function($dom){
   		$dom.contextMenu({
			menu: 'js_right_click'
		}, function(action, el, pos){
			//var $dom = el;
			//ulog.info($dom,"contment")
			switch (action) {
				case "copy":
					BoxFun.multiClone($dom);
					break;
				case "del":
					BoxFun.multiRemove($dom);
					break;
				case "select":
					BoxFun.multiSelect($dom);
					break;
				case "cancel_select":
					BoxFun.cancelMultiSelect($dom);
					break;			
				//对齐
				case "a_left":
					BoxFun.alignmentEvent("left");
					break;
				case "a_top":
					BoxFun.alignmentEvent("top");
					break;		
				//属性设置框	
				case "set":
					$dom.trigger('dblclick');
					break;
				//源码编辑		
				case "source_edit":
					BoxSource.sourceEdit($dom);	
			};
		})
   	};
   	
   	/**
   	 * 隐藏邮件菜单 
   	 */
   	exports.hideContextMenu = function(){
   		$("#js_right_click").fadeOut(200);
   	};
	
})  