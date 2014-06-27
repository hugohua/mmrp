define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	Fun = require('./mmrp.func'),
    	c = require('./mmrp.config.user'),
    	RestApi = require('./mmrp.rest');
    
   	
	/***
	 * 将一个对象的单位去除单位
	 * @param {Object} str_obj
	 * @param {Object} units
	 */
	var removeUnite = function(str_obj,units){
		var units = (typeof(units) != 'undefined') ? units : "px";
		var str_obj = str_obj;
		
		for (var s in str_obj) {
			var str = str_obj[s] , len = str.length;
			if (str.substring(len - 2, len) == units) {
				str_obj[s] = str.substring(0, len - 2);
			}
		}
		return str_obj;
	};
	
	/***
	 * 格式化style 字符串,转成object
	 * @param {Object} style_str
	 */
	var formatAttr = function(style_str){
		var styles = style_str.split(';'), i = styles.length, style, k, v,json = {};
			//set style
			while (i--) {
				style = styles[i].split(':');
				k = $.trim(style[0]);
				v = $.trim(style[1]);
				if (k.length > 0 && v.length > 0) {
					json[k] = v;
				}
			};
			return json;
	};
	
	/**
	 * 设置模块的属性
	 */
	var setModInnerAttr = function($box,data){
		var dom_type = data.type;
		//图片链接模块 不需要设置文字
		switch(dom_type) {
			//基础模块 链接
			case "base_link":
				var $a = $box.find("a");
				$a.attr({
					title: data.title,
					href:data.url || "javascript:;",
					target:data.link_target
				}).text(data.link_text).css("color",data.style.color || '');
				
				if (!data.link_text) {
					$a.addClass("base_link");
				}
				else {
					$a.removeClass("base_link");
				}
				break;
				
			//基础模块 图片
			case "base_img":
				$box.children("img").attr({
					src:data.img_url
				});
				var width = $("#js_img_width").val(),
					height = $("#js_img_height").val();
					
				if( width == "" || height == "" ){
					//设置Box宽度和高度==图片宽高
					$("<img />").attr("src", data.img_url).load(function(){
						var $dom = $box.parent();
						$dom.width(this.width).height(this.height);
						$("#js_width").val(this.width);
						$("#js_height").val(this.height);
						$('#js_img_width').val(this.width);
						$('#js_img_height').val(this.height);
					});
				};
				break;
				
			//基础模块 Flash
			case "base_video":
					
				$box.find("object param[name='movie']").attr({
					value:data.img_url
				});
				
				//,Flash 修改url 必须重绘embed标签
				$box.find("object embed").attr({
					src:data.img_url
				}).clone().appendTo($box.find("object")).end().remove();
					
				break;
			
			//图片链接（海报图）	
			case "base_poster":
				var $a = $box.find("a"),
					img_src = data.img_url || "http://tacs.oa.com/img.php?145x82";
				$a.attr({
					title: data.title,
					href:data.url || "javascript:;",
					target:data.link_target
				});
				
				
				$box.find("img").attr({
					src:img_src
				});
				
				var width = $("#js_img_width").val(),
					height = $("#js_img_height").val();
					
				if( width == "" || height == "" ){
					//设置Box宽度和高度==图片宽高
					$("<img />").attr("src", data.img_url).load(function(){
						var $dom = $box.parent();
						$dom.width(this.width).height(this.height);
						$("#js_width").val(this.width);
						$("#js_height").val(this.height);
						$('#js_img_width').val(this.width);
						$('#js_img_height').val(this.height);
					});
				}else{
					$("#js_width").val(width);
					$("#js_height").val(height);//.trigger('input');
				}
				break;
			
			case "base_iframe":
				data.iframe_url && $box.children("iframe").attr({
					src:data.iframe_url,
					width:data.style.width,
					height:data.style.height
				});
				break;
		}
	};//setModAttr
	
	
	/***
	 * 获取$dom对象的属性
	 * @param {Object} $dom
	 * @param {Object} data
	 */
	exports.getAttr = function($dom){
		var style = $dom.attr("style"), 
			$box = $dom.children(".js_box:first");
		//ulog.info("style",style);
		var json = {
			class_name		: 	$dom.attr("id"),						//id
			type			:	$dom.data("type"),						//类型
			mod_name		: 	$dom.data("mod_name"),					//模块名称
			style			: 	removeUnite(formatAttr(style)),			//不带单位
			style_unite		: 	formatAttr(style),						//带单位
			url				: 	$box.attr("data-url"),					//链接
			title			: 	$box.attr("data-title"),				//title
			link_text		:	$box.attr("data-link_text"),			//链接文本
			img_url			:	$box.attr("data-img_url"),
			iframe_url		:	$box.attr("data-iframe_url"),			//iframe url
			link_target		:	$box.attr("data-link_target")
		};
		
		//删除color属性，因为color在浏览器上解析成rgb格式
		json.style.color = $box.attr("data-color");
		json.style_unite.color = $box.attr("data-color");
		return json;
	};
	
	/***
	 * 设置$dom对象属性
	 * @param {Object} $dom
	 * @param {Object} data
	 */
	exports.setAttr =  function($dom,data){
		var $dom = $dom,
			data = data,
			dom_type = data.type,
			style = JSON.stringify(data.style_unite).replace('{','').replace('}','').replace(/(\")/g, "").replace(/(\,)/g, ";"),//TODO:改正则吧。。
			$box = $dom.children(".js_box:first"); 

		$dom.attr({
			"style":style,
			"id":data.class_name,
			"type":dom_type
		});
			
		$box.attr({
			"data-url":data.url,
			"data-title":data.title,
			"data-color": data.style.color,
			"data-img_url":data.img_url,
			"data-iframe_url":data.iframe_url,
			"data-link_text":data.link_text,
			"data-link_target":data.link_target
		});
		
		//设置基础模块属性 如 链接 图片大小
		setModInnerAttr($box,data);
	};
   	
    
    
})  