define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	Mustache = require('mustache'),
    	localStore = require('./mmrp.localstore'),
    	Fun = require('./mmrp.func'),
    	c = require('./mmrp.config.user'),
    	RestApi = require('./mmrp.rest');
    
   	require('jquery.pubsub')($);
   	
   	
	
	var msg = {
		create_error 	:'创建活动失败,请刷新重试!',
		cancel_warn 	:'确定要取消这个模板吗？'
	};
	
	var model = {
		tpl_id			: 	'#js_one_template',
		temp_container	: 	'#js_item_list',
		temp_ul			: 	'#js_item_list ul',
		clone_btn		: 	'.js_clone_btn',
		new_btn			: 	'.js_new_template_btn',
		del_btn			: 	'.js_del_btn',
		
		layout_tmpl		:'#js_layout_tmpl'
	}
	
   	
   	
	/**
	 * 处理json 单条活动模板数据数据
	 * @param {Object} data
	 */
	var handTemplate = function(data){
		var data = data;
		for(var n in data.value){
			data.value[n].page_thumbnail = data.value[n].page_thumbnail || "img/tp_item.png";
		}
		return data;
	};
	
	/**
	 * html结构
	 * @param {Object} data
	 */
	var ListActHtml = function(data){
		var tpl = $(model.tpl_id).html(),
			data = handTemplate(data),
			listHtml = Mustache.to_html(tpl, data);
		
		$(model.temp_ul).append(listHtml);
	};
	
	
	/**
	 * 获取layout 
	 */
	var getLayout = function(){
		var data = localStore.getLayoutData();
		if(data){
			listLayoutHtml(data.data);
		}else{
			RestApi.getLayout().success(function(data){
				if(data && data.data){
					listLayoutHtml(data.data);
					localStore.setLayoutData(data);
				}
			});
		}
	};
	
	
	var listLayoutHtml = function(data){
		var tpl = $(model.layout_tmpl).html(),
			data = handTemplate(data),
			listHtml = Mustache.to_html(tpl, data);
		
		$(model.temp_ul).prepend(listHtml);
	};
	
	/**
	 * 获取布局模板
	 */
	var getPageListByState = function(state){
		RestApi.getPageListByState(state).success(function(data){
			if(data && data.data && data.data.value){
				ListActHtml(data.data);
			}
		})
	};
	
	var Events = {
		
		/**
	   	 * 注册事件
	   	 */
   		subscribe:function(){
   			$.subscribe('page/create',$.proxy(function(topic,data){
				this.subSuccCreatePage(data)
			},this))
   		},
   		
   		/**
		 * 创建成功的回调事件
		 */
		subSuccCreatePage : function(data){
			console.info(data)
			if(data && !data.error){
				var url = Mustache.to_html('{{url}}?id={{page_id}}&theme_id={{theme_id}}&template_id={{template_id}}&layout_id={{layout}}', data);
				window.location.href = url;
			}else{
				alert(msg.error);
			}
		},
		
		/**
		 * 取消模板事件
		 */
		cancelTemplateEvent : function(){
			$(model.temp_container).on("click.create",model.del_btn,function(e){
				var $this = $(this),
					id = $this.attr("data-del-id"), 
					obj = {
						data: {
							table: "tb_page",
							value: {page_is_template: 0},
							where: "page_id = " + id
						}
					};
				if (confirm(msg.cancel_warn)) {
					
					RestApi.postUpdata(obj).success(function(t_data){
						t_data.success && $this.closest("li").fadeOut("normal", function(){
							$(this).remove();
						});
					})
				};
				
				return false;
			})
		},
	
	
		/**
		 * 创建活动事件
		 */
		createPageEvent : function(){
			$(model.temp_container).on("click.create",model.new_btn,function(e){
				var $this = $(this),
					layout = $this.attr("data-layout"),
					url	= $this.attr("href");
					
				var req = RestApi.createPage({
					data:layout
				});
				
				req.success(function(data){
					$.extend(data,{
						layout:layout,
						url:url
					})
					$.publish('page/create',data);
				});
				return false;
			});
		},
		
		/**
		 * 从现有活动中复制新活动
		 */
		clonePageEvent : function(){
			$(model.temp_container).on("click.create",model.clone_btn,function(e){
				console.info('clonePageEvent')
				var $this = $(this),
					template_id = parseInt( $this.attr("data-template") ,10),
					theme_id = parseInt( $this.attr("data-theme"),10),
					layout = $this.attr("data-layout"),
					url	= 'new.htm';
				
				var req = RestApi.clonePage({
					data:{
						theme_id:theme_id,
						template_id:template_id,
						page_layout:layout
					}
				})
				
				req.success(function(data){
					console.info(data,'data')
					$.extend(data,{
						layout:layout,
						url:url
					})
					$.publish('page/create',data);
				});
				
				return false;
				
			});
		},
		
		init:function(){
			this.createPageEvent();
			this.clonePageEvent();
			this.cancelTemplateEvent();
			this.subscribe();
		}
	};
	
	
	
	
	
	exports.init = function(){
		Fun.initGlobal();
		Events.init();
		getPageListByState(1);
		getLayout();
	}  
    
    
})  