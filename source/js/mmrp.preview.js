/**
 * 预览类
 */
define(function(require, exports, module) {  
	var $ = require('jquery'),
    	c = require('./mmrp.config.user'),
    	localStore = require('./mmrp.localstore'),
    	Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest'),
    	Make = require('./mmrp.make.file');
    	
	/**
	 * layout 布局 
	 */
	var layout_id = Fun.getUrlParam("layout_id"),
		page_id = Fun.getUrlParam("id");
	
	var model = {
		preview_btn			:"#js_preview_btn",								//预览背景
	}
	
	/**
	 * 设置layout 到localStore缓存
	 */
	var setLayoutToCache = function(){
		var layout = localStore.getLayoutDataById(layout_id);
		//布局框架
		// !layout
		if (!layout) {
			// RestApi.getLayoutById(layout_id).success(function(data){
				// localStore.setLayoutDataById(layout_id,data);
			// });
			RestApi.getLayout().success(function(data){
				if(data && data.data){
					localStore.setLayoutData(data);
				}
			});
			
		};
	};
	
	
	var winOpenByUrl = function(url){
		open(url, "", "toolbar=no,directories=no,menubar=no,scrollbars=yes");
	};
	
	
	var Events = {
		/**
		 * 预览事件 
		 */
		preview:function(){
			$(model.preview_btn).on('click.pre',function(){
				var page_info = localStore.getPageDataById(page_id),
					folder_dir = "project/release_temp/" + page_info.data.value.page_directory,
					mkq = Make.makeFile('release_temp');
					
				mkq.success(function(data){
					var access_url = c.root + folder_dir + "/index.html?v=" + new Date().getTime();
					winOpenByUrl(access_url);
				});
			});
		},
		
		init:function(){
			this.preview();
		}
		
	};
	
	
	exports.init = function(){
		setLayoutToCache();
		Events.init();
	};
	
});
