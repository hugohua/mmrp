/**
 * 管理员列表页
 */
define(function(require, exports, module) {  
	
	var $ = require('jquery'),
		// Mustache = require('mustache'),
    	Fun = require('./mmrp.func'),
    	ListMod = require('./mmrp.admin.list.mods'),
    	ListLayout = require('./mmrp.admin.list.layouts');
	
	
	require('bootstrap.tab')($);
	
	var initTab = function(){
		var tab_id = Fun.getUrlParam("tab") || 1;
		Fun.setUrlParam('tab',tab_id);
		$('#js_tabs a[data-tab-id="'+ tab_id +'"]').tab('show');
	};
	
	var Events = {
		tabSelect:function(){
			$('#js_tabs a').on('click',function(){
				var tab_id = $(this).attr('data-tab-id');
				Fun.setUrlParam('tab',tab_id);
			})
		},
		init:function(){
			this.tabSelect();
		}
	}
	
	exports.init = function(){
		Fun.initGlobal();
		ListMod.init();
		ListLayout.init();
		initTab();
		Events.init();
	};
	
	
});
