define(function(require, exports, module) {  
    
    var $ = require('jquery'),
		c = require('./mmrp.config.user'),
    	RestApi = require('./mmrp.rest');
    require('jquery.cookie')($);
    require('jquery.field')($);
    
    
   /**
	 * 获取用户名
	 */
	exports.getUserName  = function(){
        $.cookie("login_user_music","hugohua",{path: '/'})
		return $.cookie("login_user_music");
	};
	
	/** 
	 * transform the Date to String according the format pattern
	 * eg: 
	 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
	 * (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18 
	 */  
	exports.dateFormat = function(date,fmt) {
		var o = {
		"M+" : date.getMonth() + 1, 
		"d+" : date.getDate(), 
		"h+" : date.getHours() % 12 == 0 ? 12 : date.getHours()%12, 
		"H+" : date.getHours(), 
		"m+" : date.getMinutes(), 
		"s+" : date.getSeconds(), 
		"q+" : Math.floor((date.getMonth()+3)/3), 
		"S" : date.getMilliseconds() 
		};
		var week = {
		"0" : "\u65e5",
		"1" : "\u4e00",
		"2" : "\u4e8c",
		"3" : "\u4e09",
		"4" : "\u56db",
		"5" : "\u4e94",
		"6" : "\u516d"
		};
		if(/(y+)/.test(fmt)){
			fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
		}
		if(/(E+)/.test(fmt)){
			fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[date.getDay()+""]);
		}
		for(var k in o){
			if(new RegExp("("+ k +")").test(fmt)){
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
			}
		}
		return fmt;
	};
	
	/**
	 * 获取当前时间
	 */
	exports.getNowTime = function(){
		 return exports.dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss");
	};
	
	/**
	 * 获取URL参数
	 * //example getUrlParam('id') or getUrlParam('id','#')
	 */
	exports.getUrlParam = function(){
		var url = top.window.location.href;
		var u, params, StrBack = '',gg;
		if (arguments[arguments.length - 1] == "#") 
			u = url.split("#");
		else 
			u = url.split("?");
		if (u.length == 1) 
			params = '';
		else 
			params = u[1];
		
		if (params != '') {
			gg = params.split("&");
			var MaxI = gg.length,
			str = arguments[0] + "=";
			for (i = 0; i < MaxI; i++) {
				if (gg[i].indexOf(str) == 0) {
					StrBack = gg[i].replace(str, "");
					break;
				}
			}
		}
		return StrBack;
	};
	
	
	/**
	 * 设置URL参数 
	 * html5 history.pushState
	 */
	exports.setUrlParam = function(param,value,title){
		var search = location.search,
			pathname = location.pathname || '',
			title = title || '';
		if(search && search!="?" ){
			var p_val = exports.getUrlParam(param);
			//存在值
			if(p_val){
				search = search.replace( param+"="+p_val, param+"="+value );
				history.pushState('', '', pathname + search);
			}else{
				search = search + "&" + param+"="+value;
				history.pushState('', '', pathname + search);
			}
		}else{
			history.pushState(title, '', pathname + "?" +param+"="+value);
		}
	};
	
	/***
	 * 设置radio checkbox 的选中状态
	 * @param {Object} $input
	 */
	exports.setInputClass = function($input){
		var $tgt = $input;
			if ($tgt.attr("type") == "radio") {
				var name = $tgt.attr("name");
				$('input[type="radio"][name="' + name + '"]').closest("label").removeClass("btn-success");
				$tgt.closest("label").addClass("btn-success");
			}
			else 
				if ($tgt.attr("type") == "checkbox") {
//					ulog.info("$tgt",$tgt,$tgt.attr('checked'))
					if ($tgt.attr('checked')) {
						$tgt.closest("label").addClass("btn-success");
					}
					else {
						$tgt.closest("label").removeClass("btn-success");
					}
				}
	};
	
	/**
	 * 全部查找替换
	 * @param {Object} reallyDo
	 * @param {Object} replaceWith
	 * @param {Object} ignoreCase
	 */
	exports.replaceAll = function(str ,reallyDo, replaceWith, ignoreCase) {
	    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
	        return str.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);   
	    } else {   
	        return str.replace(reallyDo, replaceWith);   
	    }   
	};
	
	/**
	 * 数组去重
	 */
	exports.clearSort = function(arr){  
	    var temp={},result=[];  
	    for(var i=0;i<arr.length;i++){  
	        if(!temp[arr[i]]){  
	            result.push(arr[i]);  
	            temp[arr[i]]=true;  
	        }  
	    }  
	    return result;  
	};
	
	/**
	 * 用户权限检测 
	 */
	exports.checkPower = function(){
		var req = RestApi.getUserPower();
		req.success(function(data){
			var power = parseInt(data.user_power,10); 
			if(power>=20){
				$("#js_power_statistics").show();
				$("#js_admin").show();
			};
		});
		return req;
	};
	
	/**
	 * 检测是否是授权编辑页面 
 * @param {Object} authorizer
	 */
	exports.checkAuthorizer = function(authorizer){
		var user_name = exports.getUserName(),
			check = false,
			authorizer = authorizer || false;
		if(authorizer && authorizer.indexOf(user_name) !== -1){
			//有权限	
			check = true;
		};
		
		return check;
	};
	
	/**
	 * 表单验证
	 */
	exports.validate = function(container){
		var _validate = true,
				error = 0;
		$(":input[data-validate]",container).each(function(){
			//不为空
			!$(this).val() && error++;
		});
		
		error && (_validate = false);
		
		return _validate;
	};
	
	/**
	 * 表单验证
	 */
	exports.validateEvent = function(container){
		
		var rules = {
			required:{
				regex:/^\s*$/,
				error:'不能为空！'
			}
		};
		
		$('.control-group',container).on({
			'focusin':function(){
				var $this = $(this);
				$this.addClass('warning').find('.help-inline').show();
			},
			'focusout':function(){
				var $this = $(this),
					$input = $this.find(':input:not(select)'),
					val = $input.val(),
					rule = $input.attr('data-validate');
				$this.removeClass('warning');
				if(rule){
					var regex = new RegExp(rules[rule]['regex']);
					//不为空
					if(!regex.test(val)){
						$this.removeClass('error').addClass('success').find('.help-inline').text('✓');
					}else{
						$this.addClass('error').find('.help-inline').text(rules[rule]['error'])
					}
				}else if(val){
					$this.removeClass('error').addClass('success').find('.help-inline').text('✓');
				}else{
					$this.find('.help-inline').hide();
				}
			}
		});
	};
	
	/**
	 * 判断用户是否登录
	 */
	exports.checkLogin = function(){
		var user_name = exports.getUserName(),
			target_url = window.location.href,
			page_login = "oa_login.php";
		console.info(user_name,'checkLogin')	
		if(!user_name){
			if (target_url.indexOf(page_login) === -1 && target_url.indexOf("login.htm") === -1) {//
				$.cookie("last_login_page",target_url);
				window.location.href = c.root + page_login ;
			}
		}else{
			if (target_url.indexOf("login.htm") !== -1) {
				window.location.href = "select_tp.htm" ;
			}
		}
		//显示用户名
		$("#js_login_user_name").text(user_name);
	};
	
	/**
	 * 退出事件 
	 */
	exports.logout = function(){
		$('header').on("click.func",'#js_logout',function(){
			$.cookie("login_user_music",null,{path: '/'})
			$.cookie("last_login_page",window.location.href,{path: '/'})
			top.location.href = 'http://passport.oa.com/modules/passport/signout.ashx?url=' + c.root + "oa_login.php"
			return false;
		});
	};
	
	/**
	 * 根据表单对象 遍历获取数据 
	 */
	exports.getDbData = function(form_id){
		var obj = {};
		$(':input[data-db-name]',form_id).each(function(){
			var $this = $(this),
				key = $this.attr('data-db-name'),
				val = $this.getValue();
			obj[key] = val;	
		});
		return obj;
	};
	
	exports.setDbData = function(data){
		for(var i in data){
			$(':input[data-db-name="'+ i +'"]').setValue(data[i]);
		}
		
	};
	
	/**
	 * 整站需要的设置 
	 */
	exports.initGlobal = function(){
		 exports.checkLogin();
		 exports.logout();
		 exports.checkPower();
	};
	
	
    
})  