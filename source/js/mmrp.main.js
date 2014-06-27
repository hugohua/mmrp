/**
 * sea js 库  配置信息
 * 参考API:http://seajs.org/docs/zh-cn/configuration.html
 */
(function() {
	/**
	 * js文件映射
	 */
	var alias = {
		'jquery' : 'jquery',
		'$' : 'jquery',
		'mustache' : 'mustache',
		'shortcut':'shortcut',
		
		//plugins
		'jquery.cookie':'jquery.cookie',
		'jquery.pubsub':'jquery.pubsub',
		'jquery.contenteditable':'jquery.contenteditable',
		'jquery.field':'jquery.field',
		'jquery.ui':'jquery.ui',
		'jquery.colorpicker':'jquery.colorpicker',
		'jquery.pagination':'jquery.pagination',
		'jquery.contextMenu':'jquery.contextMenu',
		
		
		//bootstrap
		'bootstrap.alert':'bootstrap-alert',
		'bootstrap.modal':'bootstrap-modal',
		'bootstrap.transition':'bootstrap-transition',
		'bootstrap.tab':'bootstrap-tab',
		'bootstrap.tooltip':'bootstrap-tooltip',
		'bootstrap.dropdown':'bootstrap-dropdown',
		'bootstrap.tooltip':'bootstrap-tooltip',
		//localStore
		'localStore':'localStore'
		
		
		
	};

	seajs.config({
		//base : './js/',
		alias : alias,
		//时间截
		map : [
			[ /^(.*\.(?:css|js))(.*)$/i, '$1?20121220' ],
			[  /^(.*mmrp.config.localstore\.(?:js))(.*)$/i, '$1?' + new Date().getTime() ]	//禁止缓存
		],
		debug : 0
	});
	
})();

/**
 * 安全使用console API
 */
(function(a) {
	function b() {
	}

	for(var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !!( d = c.pop()); ) {
		a[d] = a[d] || b;
	}
})( function() {
	try {
		return window.console;
	} catch(a) {
		return (window.console = {});
	}
}());



define(function(require, exports) {
	/**
	 * 时间截
	 */
	exports.load = function(name, options) {
		require.async(['./mmrp.header','./' + name] , function(header,mod) {
			if(name.indexOf('admin') !== -1) header.adminInit();
			else header.userInit();
			
			if (mod && mod.init) {
				//如果有init函数，初始化时则执行init();
				mod.init();
			}
		});
	};

});





