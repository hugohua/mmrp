define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	Fun = require('./mmrp.func'),
    	BoxFun = require('./mmrp.mod.box.func'),
    	RestApi = require('./mmrp.rest');
    
   	var model = {
   		style_cont : '#js_mod_style',				//样式设置容器
   		act_content			:"#js_act_content",								//box操作区域容器
   	}
   	
   	/**
	 * 获取模块设置样式obj
	 * $style_container : 需要设置的容器
	 */
	var getModStyle = function($style_container){
		var values = {},style = '',classes = $style_container.attr('data-class');
		
		$(':input',$style_container).each(function(index) {
			var $this = $(this),
				type = $this.attr('type'),
				tag = this.tagName.toLowerCase(),
				//css相关
				cssname = $this.attr('data-css'),
				id = $this.attr('id'),
				val = $this.getValue(),
				unit = '',				//单位
				other = ';';				//可以放其他值  如 !important;
				//返回值用
			//数字型 一般是px单位
			if( tag === 'input' && type === 'number' ){
				unit = 'px';
			}
			//不为空 不为0
			if(val && val !== 0){
				style += cssname + ':' + val + unit + other;
				values[id] = val;
			}
		});
		return {
			style:style,
			values:values,
			classes:classes
		};
	};
	
	/**
	 * 添加样式到dom上 
	 */
	var AddStyleToDom = function(style,$dom){
		var style = style,
			$box = $dom.children(".js_box:first"),
			_pri_style = $box.attr("data-pri-style"),			//独立设置样式
			style_class_name;									//style的类名
			
			if(_pri_style){
				style_class_name = "js_" + _pri_style;
			}else{
				style_class_name = "js_pri_" + $dom.attr("id");
			}
		if ($(model.act_content).find("style." + style_class_name).length) {
			$("style." + style_class_name).html(style);
		}
		else {
			$("<style type='text/css' />").addClass(style_class_name).html(style).prependTo($box);
		}
	};
	
	/**
	 * 添加json格式数据到Dom节点
	 * @param {Object} json
	 * @param {Object} $dom
	 */
	var AddStyleJsonToDom = function(json,$dom){
		var json = json,
			$box = $dom.children(".js_box:first"),
			_pri_style = $box.attr("data-pri-style"),
			style_class_name;
			
			if(_pri_style){
				style_class_name = "js_" + _pri_style;
			}else{
				style_class_name = "js_pri_" + $dom.attr("id");
			}
		if ($(model.act_content).find("input." + style_class_name).length) {
			$("input." + style_class_name).val(json);
		}
		else {
			$("<input type='hidden' />").addClass(style_class_name).val(json).prependTo($box);
		}
	};
	
	/**
	 * 设置输入框的样式 
	 */
	var setModStyle = function($dom){
		var type = $dom.data("type"),
			$box = $dom.children(".js_box:first"),
			_pri_style = $box.attr("data-pri-style"),			//通过设置面板 设置的独立样式
			id = $dom.attr("id"),								//id
			class_name,										//独立样式类名
			classes,
			mod_setting = JSON.parse($dom.data('mod_setting')),		//模块独立设置样式
			style = '',
			values = {};
		//存在独立样式 则获取  不存在 则设置
		if(_pri_style){
			class_name = "." + _pri_style;
			classes = _pri_style;
		}else{
			class_name =  ".pri_" + id;
			classes =  "pri_" + id;
			$box.attr("data-pri-style","pri_" + id);
		};
		
		$box.addClass(classes);
		
		for(var i in mod_setting){
			var id = '#js_set_' + mod_setting[i]['id'],
				$container = $(id,'#js_mod_style');
			if($container.length){
				var obj = getModStyle($container);
				obj.style && (style += class_name + ' .'+ obj.classes +'{' + obj.style + '}');
				$.extend(values, obj.values);
			};//if
		};//for
		
		console.info(style,values,'111')
		//添加样式到dom上
		 AddStyleToDom(style,$dom);
		 AddStyleJsonToDom(  JSON.stringify(values) ,$dom );
	};
	
	
	var Events = {
		/**
		 * 输入框样式实时调整 
		 */
		styleEvent:function(){
			$(model.style_cont).on('input.panel change.panel',':input',function(){
				var $dom = BoxFun.hasSelect();
				setModStyle($dom);
			});
		},
		
		init:function(){
			this.styleEvent();
		}
		
	};
	
	exports.init = function(){
		Events.init();
	}; 
	
})  