/**
 * 模块新增
 */

define(function(require, exports, module) {  
	
	var $ = require('jquery'),
		Mustache = require('mustache'),
    	Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest'),
    	ModGetSet = require('./mmrp.admin.module.getset');
	
	require('jquery.pubsub')($);
	
	var mod_id  = Fun.getUrlParam('mod_id');
	
	var model = {
		mod_submit_btn:'#js_mod_submit_btn',//提交按钮
		mod_base_cont:'#js_mod_base_list',	//基础样式容器
		mod_base_tmpl:'#js_mod_base_tmpl',	//基础样式模板容器
		
	};
	
	var msg = {
		add_success:"添加成功",
		validate_error:'基本信息填写有误，请检查后再提交！'
	};
	
	
	/**
	 * 获取基础模块数据
	 */
	var getModBaseData = function(){
		var req = RestApi.getBaseModData();
		//填充mod base 数据
		req.success(function(template){
			if(template && template.data && template.data.value){
				var d = template.data,
					tpl = $(model.mod_base_tmpl).html(),
					listHtml = Mustache.to_html(tpl, d);
				$(model.mod_base_cont).html(listHtml);
				
				//发布获取模块数据事件
				mod_id && $.publish('mod/getbyid',mod_id);
				
			}
		});
	};
	
	var getCateList = function(){
    	RestApi.getCateList().success(function(data){
    		console.info(data)
			if(data && data.data){
				listCate(data.data);
			};
		});
   };
   
   var listCate = function(data){
		var tpl = $('#js_cate_tmpl').html(),
			html = Mustache.to_html(tpl, data);
		$('#js_mod_category').html(html);
	};
	
	var Events = {
		/**
		 * 插入数据事件
		 */
		insertMod : function(){
			$(model.mod_submit_btn).on("click",function(){
				var data = ModGetSet.getModData(),
					validate = ModGetSet.validate();
				//表单验证	
				if(validate){
					RestApi.postAddData(data).success(function(t_data){
						if(t_data.success){
							//更新缓存配置文件
							RestApi.updateLocalStore('mod_list');
							alert(msg.add_success);
							window.location = 'list.html';
						}
					});
				}else{
					alert(msg.validate_error)
				}
				
				return false;
			});
		},
		
		/**
		 * 这种模块的样式  个数 事件
		 */
		modCheckBox : function(){
			//复选框
			$('.js_controls input[type="checkbox"]','#js_mod_setting').on('change',function(){
				var $this = $(this),
					$input = $this.closest('.js_controls').find('input[type="text"]'),
					$mod = $('#js_set_'+ $this.val() ),//效果展示里的模块
					mod_text = $mod.find('legend').text(),//模块标题的文字
					checked = $this.prop('checked');
					
				//选中状态
				if(checked){
					$input.val(mod_text).show();
					$mod.show();
				}else{
					$input.hide();
					$mod.hide();
				}
			});
		},
		
		/**
		 * 新增 一行切换样式
		 */
		addSwitchClass : function(){
			$('#js_switch_class').on('click','.js_s_append',function(){
				var $cont = $(this).closest('.controls');
				$cont.clone().find('input').val('').end()
				.insertAfter($cont);
				return false;
			});
		},
		
		
		modInput:function(){	
			//输入框
			$('.js_controls input[type="text"]','#js_mod_setting').on('keyup',function(){
				var $this = $(this),
					mod_id = $this.closest('.js_controls').find('input[type="checkbox"]').val();//展示框的id值
				
				$('#js_set_'+ mod_id ).find('legend').text($this.val());
				
			});		
		},
		
		init:function(){
			this.insertMod();
			this.modCheckBox();
			this.addSwitchClass();
			this.modInput();
		}
	}
	
	
	
	/**
	 * 初始化
	 */
	exports.init = function(){
		Fun.initGlobal();
		getModBaseData();
		getCateList();
		Events.init();
	};
	
	
});
