/**
 * 管理员列表页
 */
define(function(require, exports, module) {  
	
	var $ = require('jquery'),
		Mustache = require('mustache'),
		c = require('./mmrp.config.user'),
		Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest');
    
    require('jquery.field')($);	
	
	var msg = {
		del_conf : '确认要删除吗？',
		error:'输入框不能为空！'
	}
	
	var getCate = function(){
		RestApi.getCateList().success(function(data){
			if(data && data.data){
				listCate(data.data);
			};
		});
	};
	
	var getUrl = function(){
		RestApi.getUrlList().success(function(data){
			if(data && data.data){
				listUrl(data.data);
			};
		})
	};
	
	var listCate = function(data){
		var tpl = $('#js_cate_tmpl').html(),
			c_html = Mustache.to_html(tpl, data);
  		$('#js_cate_cont').append(c_html);
	};
	
	
	var listUrl = function(data){
		var tpl = $('#js_url_tmpl').html(),
			c_html = Mustache.to_html(tpl, data);
  		$('#js_url_cont').append(c_html);
	}
	
	var getCataData = function(){
		var obj = {
			data: {
				table:"tb_category",
				value:{
					cate_name:$('#js_cate_input').val(),
					cate_status:1
				},
				where:'cate_id = ' + ($('#js_cate_input').attr('data-id') || 0)
			}
		};
		return obj;
	};
	
	var getUrlData = function(){
		var obj = {
			data: {
				table:"tb_url",
				value:{
					url_link:$('#js_url_input').val(),
					url_status:1
				},
				where:'url_id = ' + ($('#js_url_input').attr('data-id') || 0)
			}
		};
		return obj;
	};
	
	var clearFrom = function(){
		$('input').clearForm();
	};
	
	var Events = {
		
		/**
		 * 新增模块 
		 */
		addCate:function(){
			$('#js_cate_add').on('click.add',function(){
				var data = getCataData(),
					val = $('#js_cate_input').val();
				if(val){
					RestApi.postAddData(data).success(function(t_data){
						if(t_data.success){
							var n_data = data;
							// n_data.data.cate_id = t;
							listCate(n_data.data);
							clearFrom();
							//更新缓存配置文件
							RestApi.updateLocalStore('mod_cate');
						}
					});
				}else{
					alert(msg.error);
				}
				
			});
		},
		
		
		editCate:function(){
			$('#js_cate_cont').on('click.edit','.js_edit',function(){
				var cate_id = $(this).attr('data-edit-id');
				$('#js_cate_add,#js_cate_edit').toggle();
				$('#js_cate_input').attr('data-id',cate_id).focus().val( $('#js_cate_'+cate_id).text() );
				return false;
			});
			//修改事件
			$('#js_cate_edit').on('click.edit',function(){
				var data = getCataData(),
					val = $('#js_cate_input').val();
				if(val){
					RestApi.postUpdata(data).success(function(t_data){
						if(t_data.success){
							var $input = $('#js_cate_input'),
								cate_id = $input.attr('data-id'),
								cate_name = $input.val();
							$('#js_cate_'+cate_id).text(cate_name);
							$('#js_cate_add,#js_cate_edit').toggle();
							clearFrom();
							//更新缓存配置文件
							RestApi.updateLocalStore('mod_cate');
						}
					});
				}else{
					alert(msg.error);
				}	
				
			});
		},
		
		delCate:function(){
			$('#js_cate_cont').on('click.edit','.js_del',function(){
				if(confirm(msg.del_conf)){
					var $this = $(this),
						del_id = $this.attr('data-del-id');
						
					RestApi.delCateById(del_id).success(function(t){
						if(t){
							$this.closest('tr').remove();
							//更新缓存配置文件
							RestApi.updateLocalStore('mod_cate');
						}
					})
				}
			})
		},
		
		/**
		 * 新增模块 
		 */
		addUrl:function(){
			$('#js_url_add').on('click.add',function(){
				var data = getUrlData(),
					val = $('#js_url_input').val();
				if(val){
					RestApi.postAddData(data).success(function(t_data){
						if(t_data.success){
							var n_data = data;
							// n_data.data.url_id = t;
							listUrl(n_data.data);
							clearFrom();
							//更新缓存配置文件
							RestApi.updateLocalStore('page_urls');
						}
					});
				}else{
					alert(msg.error);
				}	
				
			});
		},
		
		editUrl:function(){
			$('#js_url_cont').on('click.edit','.js_edit',function(){
				var url_id = $(this).attr('data-edit-id');
				$('#js_url_add,#js_url_edit').toggle();
				$('#js_url_input').attr('data-id',url_id).focus().val( $('#js_url_'+url_id).text() );
				return false;
			});
			
			$('#js_url_edit').on('click.edit',function(){
				var data = getUrlData(),
					val = $('#js_url_input').val();
				if(val){
					RestApi.postUpdata(data).success(function(t_data){
						if(t_data.success){
							var $input = $('#js_url_input'),
								url_id = $input.attr('data-id'),
								url_link = $input.val();
							$('#js_url_'+url_id).text(url_link);
							$('#js_url_add,#js_url_edit').toggle();
							clearFrom();
							//更新缓存配置文件
							RestApi.updateLocalStore('page_urls');
						}
					});
				}else{
					alert(msg.error);
				}
				
			});
		},
		
		delUrl:function(){
			$('#js_url_cont').on('click.edit','.js_del',function(){
				if(confirm(msg.del_conf)){
					var $this = $(this),
						del_id = $this.attr('data-del-id');
						
					RestApi.delUrlById(del_id).success(function(t){
						if(t){
							$this.closest('tr').remove();
							//更新缓存配置文件
							RestApi.updateLocalStore('page_urls');
						}
					})
				}
			})
		},
		
		init:function(){
			this.addCate();
			this.editCate();
			this.delCate();
			
			this.addUrl();
			this.editUrl();
			this.delUrl();
		}
	}
	
	exports.init = function(){
		Fun.initGlobal();
		getCate();
		getUrl();
		Events.init();
	};
	
	
	
	
});
