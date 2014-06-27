/**
 * @author hugohua
 */
define(function(require, exports, module) { 
	
	var $ = require('jquery'),
		Mustache = require('mustache'),
		RestApi = require('./mmrp.rest'),
    	Fun = require('./mmrp.func');
    	
    var model = {
    	my_draft_con 	: '#js_my_draft',								//我的草稿 ul容器
    	list_tmpl		: '#js_my_tmpl',							//我的草稿html模板结构
    	del_btn			:'.js_del_btn'								//删除按钮
    };
    
    var msg = {
    	del_confirm :'确定要删除这个草稿吗？',
    }
    
    /**
     * 将 ajax 的数据 进行格式转换 方便进行模板替换 
 	 * @param {Object} data
     */
    var changeData = function(data){
    	for (var i in data.value){
    		data.value[i]['page_thumbnail'] || (data.value[i]['page_thumbnail'] = 'img/tp_item.png');
    	};
    	return data;
    };
	
	var getUserDraft = function(){
		var user_name = Fun.getUserName();
		RestApi.getPageByDraft(user_name).success(function(data){
			if(data && data.data && data.data.value){
				var tpl = $(model.list_tmpl).html(),
					html = Mustache.to_html(tpl, changeData(data.data));
				$(model.my_draft_con).append(html);
			};
			
		});
	};
	
	var Events = {
		
		/**
		 * 删除按钮 
		 */
		delDraft:function(){
			
			$(model.my_draft_con).on("click.del",model.del_btn,function(){
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
			this.delDraft();
		}
		
	}
	
	exports.init = function(){
		getUserDraft();
		Events.init();
	};


});
