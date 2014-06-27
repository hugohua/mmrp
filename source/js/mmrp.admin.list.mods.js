/**
 * 管理员列表页
 */
define(function(require, exports, module) {  
	
	var $ = require('jquery'),
		Mustache = require('mustache'),
		c = require('./mmrp.config.user'),
    	RestApi = require('./mmrp.rest');
    	
	require('bootstrap.tab')($);
	require('jquery.ui')($);
	
	var msg = {
		del_mod_conf:'你确认要删除这个模块吗？',
		del_layout_conf:'你确认要删除这个模板吗？'
	};
	
	var getModList = function(){
		RestApi.getModListByCate(-1).success(function(data){
			if(data && data.data){
				listHtml(changeData(data.data));
			}
		});
	};
	
	var changeData = function(data){
		for (var i in data.value){
			//存在缩略图
			if(data.value[i]['mod_thumbnail']){
				data.value[i]['mod_url'] = c.root + 'mod_img/' + data.value[i]['mod_thumbnail'];
				//自带url的 则直接显示，不需要拼凑图片地址
				if(data.value[i]['mod_thumbnail'].indexOf('http://') !== -1){
					data.value[i]['mod_url'] = data.value[i]['mod_thumbnail'];
				};
				
			}else{
				data.value[i]['mod_url'] = 'http://tacs.oa.com/img.php?250x120'
			};
			
			
			//存在base_ 则说明是基础模块
			if(data.value[i]['mod_type'].indexOf('base_') !== -1){
				data.value[i]['mod_base_type'] = true;
			};
			
    		
    	};
    	console.info(data,'dddddaa')
    	return data;
	};
	
	var listHtml = function(data){
		var tpl = $('#js_mods_tmpl').html(),
			c_html = Mustache.to_html(tpl, data);
			
		$('ul','#js_mods').html(c_html);
	};
	
	var delSuccess = function(){
		
	}
	
	var Events = {
		/**
		 * 删除模块 
		 */
		delMod:function(){
			$('#js_mods').on('click.del','.js_del_mod',function(){
				var $this = $(this),
					del_id = $this.attr('data-del-id');
				if(confirm(msg.del_mod_conf)){
					RestApi.delModById(del_id).success(function(data){
						if(data){
							$this.closest("li").hide("highlight", 500, function(){
								$(this).remove();
							});
						}
					})
				}
					
			});
		},
		/**
		 * 删除模板布局 
		 */
		delLayout:function(){
			$('#js_layouts').on('click.del','.js_del_layout',function(){
				var $this = $(this),
					del_id = $this.attr('data-del-id');
				if(confirm(msg.del_layout_conf)){
					RestApi.delLayoutById(del_id).success(function(data){
						if(data){
							$this.closest("li").hide("highlight", 500, function(){
								$(this).remove();
							});
						}
					})
				}
					
			});
		},
		
		init:function(){
			this.delMod();
			this.delLayout();
		}
	}
	
	exports.init = function(){
		getModList();
		Events.init();
	};
	
	
	
	
});
