define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	RestApi = require('./mmrp.rest'),
    	Fun = require('./mmrp.func'),
    	Mustache = require('mustache');
    	
    require('bootstrap-dropdown')($);

	exports.bind=function(){
		var req =RestApi.getUserList();
		req.success(function(data){
			var tpl = $('#js_mod_userlist_tmpl').html(),
			listHtml = Mustache.to_html(tpl, data.data);
			$('#tbd_userlist').html(listHtml);
			
		})
	};
	var Events = {
		/**
   	 	 * 注册事件
   	 	 */
		setUser:function(){
			/**
		     * 设置为游客权限
		     */
			$('#tbd_userlist').on('click','.js_guest',function(){
				var user_id=$(this).attr("user_id");
				var req =RestApi.setUserPower(user_id,1);
				req.success(function(data){
					if(data>0){
						$("#power_"+user_id).html("游客");
						$("#alert").show(250);
						setTimeout(function(){
							$("#alert").hide(250);
						},2000)
					}
				})
			})
			/**
		     * 设置为录入员权限
		     */
			$('#tbd_userlist').on('click','.js_writer',function(){
				var user_id=$(this).attr("user_id");
				var req =RestApi.setUserPower(user_id,10);
				req.success(function(data){
					if(data>0){
						$("#power_"+user_id).html("录入员")
						$("#alert").show(250);
						setTimeout(function(){
							$("#alert").hide(250);
						},2000)
					}
				})
			})
			/**
		     * 设置为管理员权限
		     */
			$('#tbd_userlist').on('click','.js_admin',function(){
				var user_id=$(this).attr("user_id");
				var req =RestApi.setUserPower(user_id,20);
				req.success(function(data){
					if(data>0){
						$("#power_"+user_id).html("管理员")
						$("#alert").show(250);
						setTimeout(function(){
							$("#alert").hide(250);
						},2000)
					}
				})
			})
		},
		
		init:function(){
			this.setUser();
		}
	}
	exports.init = function(){
		exports.bind();
		Events.init()
	}
})  