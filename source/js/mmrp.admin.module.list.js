define(function(require, exports, module) {  
    
    var $ = require('jquery'),
		c = require('./mmrp.config.user'),
		qq = require('fileuploader'),
		Mustache = require('mustache'),
    	Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest');
	
	require('jquery.field')($);
	require('jquery.pubsub')($);
    
    
    /**
     *模块菜单 
     */
    var modCateList = function(){
    	
    };
   	
   	/**
	 * 获取模块列表
	 */
	var getModList = function(){
		
		RestApi.getModListByCate(-1).success(function(data){
			if(data && data.data && data.data.value){
				ListActHtml(data.data);
			}
		});
	};
	
	/**
	 * html结构
	 * @param {Object} data
	 */
	var ListActHtml = function(data){
		var tpl = $('#js_mod_list_tmpl').html(),
			listHtml = Mustache.to_html(tpl, data);
		$('#js_mod_list').append(listHtml);
	};
	
	/**
   	 * 注册事件
   	 */
   	var Events = {
   		/**
	   	 * 注册事件
	   	 */
   		subscribe:function(){
   			//订阅 获取模块
			$.subscribe('mod/list',function(){
				getModList();
			})
   		}
   		
   };
   	
   	
   	
	exports.init = function(){
		getModList();
		Events.subscribe();
	};
    
    
})  