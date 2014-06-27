/**
 * @author hugohua
 */
define(function(require, exports, module) { 
	
	var $ = require('jquery'),
		Mustache = require('mustache'),
		RestApi = require('./mmrp.rest'),
    	Fun = require('./mmrp.func');
    
    require('bootstrap.tab')($);	
    require('jquery.pagination')($);
    	
    var model = {
    	list_tmpl			: '#js_list_tmpl',							//html模板结构
    	history_tab			: ".js_history_tab",						//tab按钮
    	pagination			:'#js_pagination',							//分页容器
    	item_list_cont		:'#js_tp_item_list',						//历史记录列表容器
    	del_btn				:'.js_del_btn',								//删除按钮
    	
    };
    
    var msg = {
    	del_confirm :'确定要删除这个页面吗？',
    }
    
    var page_size = 6,			//一页显示 个数
    	type = Fun.getUrlParam("type") || "me",			//类型
    	page = Fun.getUrlParam("page") || 0,			//分页
    	user_name = Fun.getUserName();
    
    /**
     * 将 ajax 的数据 进行格式转换 方便进行模板替换 
 	 * @param {Object} data
     */
    var changeData = function(data){
    	for (var i in data.value){
    		data.value[i]['page_thumbnail'] || (data.value[i]['page_thumbnail'] = 'img/tp_item.png');
    	};
    	//用于模板查找是否是历史查询
    	data.history = true;
    	return data;
    };
    
    /**
	 * html结构
	 * @param {Object} data
	 */
	var listActHtml = function(data,type){
		var tpl = $(model.list_tmpl).html();
		if(type==='authorize'){
			tpl = $('#js_my_tmpl').html();
		}
		
		var listHtml = Mustache.to_html(tpl, changeData(data));
		$(model.item_list_cont).html(listHtml);
	};
    
    /***
	 * 根据类型获取活动
	 */
	var getBasePageList = function(atype,start,num){
		var req;
		switch(atype){
			case "notme":
			req = RestApi.getPageListByNotUser(user_name,start,num);
			break;
			case "authorize":
			req = RestApi.getPageListByAuthorize(user_name,start,num);
			break;
			case "week":
			req = RestApi.getPageListByWeek(start,num);
			break;
			case "month":
			req = RestApi.getPageListByMonth(start,num);
			break;
			default :
			req = RestApi.getPageByUser(user_name,start,num);
			break;
			
		};
		req.success(function(data){
			if(data && data.data && data.data.value && (data.data.value).length){
				listActHtml(data.data,atype);
			};
		});//req
		return req;
	};
	
	/**
	 * 初始化翻页事件
	 */
	var initPager = function(){
		var user_name = Fun.getUserName(),
			atype = Fun.getUrlParam("type") || "me";
		//设置选中状态	
		$(model.history_tab).filter('[atype="'+ atype +'"]').closest("ul").find("a").removeClass("on").end().end().addClass("on");
		//分页数 和总页数
		RestApi.getPageCountByType(atype,user_name).success(function(all_num){
			$(model.pagination).pagination(all_num, {
				items_per_page:page_size,
				num_display_entries:5,
				current_page: Fun.getUrlParam("page") || 0, 
				callback:loadPageContents
			}).show();
			if(all_num <= page_size){
				$(model.pagination).hide();
			};
			
			//数据不存在
			if(!all_num){
				$(model.item_list_cont).html($('#js_nodata').show().html());
			}
			
		});
	};
	
	/**
	 * 加载数据内容
	 */
	var loadPageContents =function(current_page){
		var atype = Fun.getUrlParam("type") || "me",
			page_start = current_page * page_size;
		getBasePageList(atype,page_start,page_size);
		Fun.setUrlParam("page",current_page);
		return false;
	};
	
	
	var Events = {
		/**
		 * 初始化翻页事件
		 */
		tabShow:function(){
			$(model.history_tab).on("click.tabs",function(){
				var $this = $(this),
					atype = $this.attr("atype");
				//设置url
				Fun.setUrlParam("type",atype);
				Fun.setUrlParam("page",0);
	
				initPager();
				return false;
			});
		},
		
		/**
		 * 删除按钮 
		 */
		delPage:function(){
			
			$(model.item_list_cont).on("click.del",model.del_btn,function(){
				var $this = $(this),
					del_id = $this.attr("data-del-id");
				if (confirm(msg.del_confirm)) {
					RestApi.delPageById(del_id).success(function(id){
						$this.closest("li").fadeOut("normal", function(){
							$(this).remove();
						});
					});
				};//if
				
			})
		},
		
		init:function(){
			this.tabShow();
			this.delPage();
		}
		
	}
	
	
	exports.init = function(){
		initPager();
		Events.init();
	};


});
