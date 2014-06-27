define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	RestApi = require('./mmrp.rest'),
    	Fun = require('./mmrp.func'),
    	Mustache = require('mustache');
    	
    require('bootstrap-dropdown')($);
    require('bootstrap.tab')($);
	
	/**
	 * 数据格式转换 
	 */
	var changeData = function(data){
		if(data && data.value && data.value.length){
			var length = data.value.length;
			for(var i = 0;i<length;i++){
				data.value[i]['power_' + data.value[i]['user_power']] = true;
			};
		}
		return data;
	};
	
	exports.getUserList=function(){
		var req =RestApi.getUserList();
		req.success(function(data){
			var tpl = $('#js_mod_userlist_tmpl').html(),
			listHtml = Mustache.to_html(tpl, changeData(data.data));
			$('#tbd_userlist').html(listHtml);
			
		})
	};
	exports.getUserListByPower=function(power){
		var req =RestApi.getUserListByPower(power);
		req.success(function(data){
			var tpl = $('#js_mod_userlist_tmpl').html(),
			listHtml = Mustache.to_html(tpl, changeData(data.data));
			$('#tbd_userlist').html(listHtml);
		})
	};
	var initTab = function(){
		var tab_id = Fun.getUrlParam("tab") || 1;
		Fun.setUrlParam('tab',tab_id);
		$('#js_tabs a[data-tab-id="'+ tab_id +'"]').tab('show');

		if(tab_id==1) exports.getUserList();
		else if(tab_id==2) exports.getUserListByPower(20);
		else if(tab_id==3) exports.getUserListByPower(10);
		else if(tab_id==4) exports.getUserListByPower(1);
	};
	var Events = {
		/**
   	 	 * 修改用户权限
   	 	 */
		setUser:function(){
			$('#tbd_userlist').on('click','.dropdown-menu a',function(){
				var $this = $(this),
					user_id = $this.attr("data-id"),
					power = $this.attr("data-power"),
					power_name = $this.text();
				var req =RestApi.setUserPower(user_id,power);
				req.success(function(data){
					if(data>0){
						$("#power_"+user_id).html(power_name);
						$("#alert").show(250);
						setTimeout(function(){
							$("#alert").hide(250);
						},2000)
					}else{
						alert('修改权限失败，请确认你是否具有管理员权限！')
					}
				})
			})
		},
		tabSelect:function(){
			$('#js_tabs a').on('click',function(){
				var tab_id = $(this).attr('data-tab-id');
				Fun.setUrlParam('tab',tab_id);
				if(tab_id==1) exports.getUserList();
				else if(tab_id==2) exports.getUserListByPower(20);
				else if(tab_id==3) exports.getUserListByPower(10);
				else if(tab_id==4) exports.getUserListByPower(1);
			})
		},
		init:function(){
			this.setUser();
			this.tabSelect();
		}
	}
	exports.init = function(){
		Fun.initGlobal();
		initTab();
		Events.init();
		

	}
})  