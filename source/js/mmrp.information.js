define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	Fun = require('./mmrp.func'),
    	Mustache = require('mustache'),
    	c = require('./mmrp.config.user'),
    	localStore = require('./mmrp.localstore'),
    	PageInfo = require('./mmrp.page.info'),
    	RestApi = require('./mmrp.rest');
    
   	var page_id = Fun.getUrlParam("id"),
   		theme_id = Fun.getUrlParam("theme_id"),
		template_id = Fun.getUrlParam("template_id"),
		layout_id = Fun.getUrlParam("layout_id");
		
	
	var msg = {
		edit_error 	:'修改活动失败!',
		validate 	:'基本信息填写有误，请检查后再修改提交！'
	};
	
	var model = {
		edit_btn	:'#js_edit_btn',							//修改按钮
		form		:'#js_form'
	};
	
	var initPageInfo = function(){
		page_id && RestApi.getPageById(page_id).success(function(data){
			if(data && data.data && data.data.value){
				PageInfo.setPageInfo(data.data.value);
			};
		})
	};
	
	var getUrlList = function(){
		var data = localStore.getPageUrls();
		if(data){
			listUrl(data.data);
		}else{
			RestApi.getUrlList().success(function(data){
				if(data && data.data){
					listUrl(data.data);
					localStore.setPageUrls(data);
				}
			});
		};
		
	};
	
	var listUrl = function(data){
		var tpl = $('#js_type_tmpl').html(),
			html = Mustache.to_html(tpl, data);
		$('#js_page_type').append(html);
	};
	
	
   	/**
   	 * 注册事件
   	 */
   	var Events = {
   		
		
		editPage:function(){
			$(model.edit_btn).on("click.newjs",function(){
				var info_obj = PageInfo.getPageInfo(),
					search = window.location.search,
					url = $(this).attr("href") + search,
					validate = Fun.validate(model.form);
				if (validate) {
					RestApi.postUpdata(info_obj).success(function(data){
						if (data.success) {
							localStore.setPageDataById(page_id,info_obj);
							window.location.href = url;
						};
					});
				}else{
					alert(msg.validate);
				}
				
				return false;
			});
		},
		
		init:function(){
			this.editPage();
		}
   		
   };
   
	
	
	
	exports.init = function(){
		Fun.initGlobal();
		Events.init();
		initPageInfo();
		getUrlList();
		Fun.validateEvent(model.form);
	}  
    
    
})  