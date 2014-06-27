define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	BoxAttr = require('./mmrp.mod.box.attr'),
    	BoxFun = require('./mmrp.mod.box.func');
    
   	require('jquery.ui')($);
   	
   	var model = {
		source_edit_pop:"#js_source_edit_pop",//源码编辑弹出框
		source_input:"#js_source_input"//源码编辑 输入框
   	}
   	
   	/**
	 * 源码编辑
	 * @param {Object} $dom
	 */
	exports.sourceEdit = function($dom){
		var $box = $dom.children(model.box),
			source = $box.html();
			
		$(model.source_edit_pop).show();
		$(model.source_input).val(source);		
	};
	
	/**
	 * 源码编辑事件
	 */
	var sourceEditEvent = function(){
		
		var _evt = function(){
			var $dom = BoxFun.hasSelect(),
				$box = $dom.children(".js_box").first(),
				source = $("#js_source_input").val();
			$box.html(source);
		};
		
		//源码编辑框
		$(model.source_edit_pop).draggable();
		
		//确认事件
		$("#js_source_com_btn").on("click.boxact",function(){
			_evt();
			$(model.source_edit_pop).hide();
			//return false;	
		});
		//预览事件
		$("#js_source_pri_btn").on("click.boxact",function(){
			_evt();
			//return false;	
		});
		//关闭
		$('.close',model.source_edit_pop).on('click.close',function(){
			exports.hide();
		})
		
		//弹出编辑框事件
		$("#js_source_edit_btn").on("click.boxact",function(){
			var $dom = BoxFun.hasSelect();
			exports.sourceEdit($dom)
			return false;
		});
	};
	
	exports.init = function(){
		sourceEditEvent();
	};
	
	exports.hide = function(){
		$(model.source_edit_pop).hide();
	};
	
	exports.init();
   	
    
})  