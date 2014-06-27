/**
 * 管理员列表页
 */
define(function(require, exports, module) {  
	
	var $ = require('jquery'),
		Mustache = require('mustache'),
		c = require('./mmrp.config.user'),
    	RestApi = require('./mmrp.rest');
    	
	require('jquery.ui')($);
	
	var msg = {
		del_conf:'你确认要删除这个模块吗？'
	};
	
	/**
	 * 获取layout 
	 */
	var getLayout = function(){
		RestApi.getLayout().success(function(data){
			if(data && data.data){
				listLayoutHtml(data.data);
			}
		});
	};
	
	
	var changeData = function(data){
		for (var i in data.value){
			if(data.value[i]['layout_thumbnail']){
				data.value[i]['layout_url'] = c.root + 'mod_img/' + data.value[i]['layout_thumbnail'];
			}else{
				data.value[i]['layout_url'] = 'http://tacs.oa.com/img.php?250x120'
			}
    		
    	};
    	return data;
	}
	
	var listLayoutHtml = function(data){
		var tpl = $('#js_layouts_tmpl').html(),
			data = changeData(data),
			listHtml = Mustache.to_html(tpl, data);
		//$('#js_layouts .mod_layoutlist').html(listHtml);
		$('ul','#js_layouts').html(listHtml);
	};
	
	var Events = {
		/**
		 * 删除模块 
		 */
		delMod:function(){
			$('#js_mods').on('click.del','.js_del_layout',function(){
				var $this = $(this),
					del_id = $this.attr('data-del-id');
				if(confirm(msg.del_conf)){
					RestApi.delModById(del_id).success(function(){
						$this.closest("li").hide("highlight", 500, function(){
							$(this).remove();
						});
					})
				}
					
			});
		},
		
		init:function(){
			this.delMod();
		}
	}
	
	exports.init = function(){
		getLayout();
		Events.init();
	};
	
	
	
	
});
