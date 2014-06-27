/**
 * 模块修改
 */

define(function(require, exports, module) {  
	
	var $ = require('jquery'),
		Mustache = require('mustache'),
		c = require('./mmrp.config.user'),
    	Fun = require('./mmrp.func');
	
	require('jquery.field')($);
	
	var mod_id  = Fun.getUrlParam('mod_id');
	
	var model ={
		mod_setting:"#js_mod_setting",	//属性设置区域
	}
	
	/**
	 * 获取新增独立组件数据
	 */
	exports.getModData = function(){
		var obj = {
			data: {
				table:"tb_mod",
				value:{
					mod_name: $("#js_mod_name").getValue(),										//组件中文名
					mod_category: parseInt($("#js_mod_category").getValue() || 1),						//组件类别ID
					mod_type:$("#js_mod_type").getValue(),								//模块英文名
					mod_data_type:$("#js_mod_data_type").getValue(),					//模块数据类型
					mod_html: $("#js_mod_html").getValue(),								//组件结构代码(HTML)
					mod_html_template: $("#js_mod_html_template").getValue(),			//组件结构代码(HTML)
					mod_css: $("#js_mod_css").getValue(),								//组件样式代码(CSS)
					mod_js: $("#js_mod_js").getValue(),												//组件脚本代码(JS)
					mod_creator: Fun.getUserName(),													//上传ID
					mod_status: 1,										//组件权限
					mod_base_style_ids: $("input[name='js_mod_base_style_ids']").getValue() ,		//基础样式(CSS)
					mod_thumbnail: $("#js_mod_thumbnail").getValue(),								//组件缩略图
					mod_setting:getModSetting(),
					mod_switch_class:getModSwitch()
				},
				where:'mod_id = ' + mod_id
			}
		};
		return obj;
	};
	
	/**
	 * 设置表单
	 */
	exports.setModData = function(data){
		$("#js_mod_name").setValue(data.mod_name);									//组件中文名
		$("#js_mod_category").setValue(data.mod_category);						//组件类别ID
		$("#js_mod_type").setValue(data.mod_type),								//模块英文名
		$("#js_mod_data_type").setValue(data.mod_data_type),					//模块数据类型
		$("#js_mod_html").setValue(data.mod_html);								//组件结构代码(HTML)
		$("#js_mod_html_template").setValue(data.mod_html_template);			//组件结构代码(HTML)
		$("#js_mod_css").setValue(data.mod_css);								//组件样式代码(CSS)
		$("#js_mod_js").setValue(data.mod_js);												//组件脚本代码(JS)
		$("input[name='js_mod_base_style_ids']").setValue(data.mod_base_style_ids);		//基础样式(CSS)
		$("#js_mod_thumbnail").setValue(data.mod_thumbnail);								//组件缩略图
		$("#js_mod_imgshow").show().attr('src',c.root + 'mod_img/' + data.mod_thumbnail);
		setModSetting(data.mod_setting);
		setModSwitch(data.mod_switch_class);
	};

	/**
	 * 获取模块设置数据
	 * 返回 obj对象 字符串
	 */
	var getModSetting = function(){
		var arr = []; 
		
		$('.js_controls input[type="checkbox"]:checked',model.mod_setting).each(function(){
			var $this = $(this),
				mod_id = $this.val(),//模块id
				mod_text = $this.closest('.js_controls').find('input[type="text"]').val() || '';//模块名称
			
			arr.push({
				id:mod_id,
				name:mod_text
			});
		});
		
		return JSON.stringify(arr);
	};
		
	/**
	 * 设置模块样式
	 */
	var setModSetting = function(mod_setting){
		var ms = JSON.parse(mod_setting),
			mod_ids = '';
		
		for(var i in ms){
			mod_ids += ms[i]['id'] + ',';
			$('#js_mod_name_' + ms[i]['id']).val(ms[i]['name']).show().trigger('keyup');
			$('#js_set_'+ms[i]['id']).show();
		}
		$('input[name="js_mod_checkbox"]','#js_mod_setting').setValue(mod_ids);
	};
	
	/**
	 * 获取模块样式切换信息 
	 */
	var getModSwitch = function(){
		var arr_obj = [];
		$('#js_switch_class .control-group').each(function(){
			var $this = $(this),
				arr = [];
			$this.find('.controls').each(function(){
				var $con = $(this),
					name = $con.find('.js_s_name').val();
				if(name){
					obj = {
						group	: 	$con.find('.js_s_group').val(),
						name 	: 	name,
						add 	: 	$con.find('.js_s_add').val(),
						remove 	: 	$con.find('.js_s_remove').val()
					};
					arr.push(obj);
				}	
			});
			//为了用Mustache 将数据整合成Mustache所需的格式 
			arr_obj.push({group:arr});
		});
		return JSON.stringify({data:arr_obj});;
	};
	
	/**
	 * 设置填充 输入框切换样式
	 */
	var setModSwitch = function(switch_data){
		if(switch_data){
			var data = JSON.parse(switch_data);
			if(data.data[0]['group'].length){
				var tpl = $('#js_switch_template').html(),
					html = Mustache.to_html(tpl, data);
				$('#js_switch_class').html(html);
			};
		}
	};
	
	/**
	 * 表单验证
	 */
	exports.validate = function($container){
		var _validate = true,
				error = 0;
		$(":input[data-validate]",$container).each(function(){
			//不为空
			!$(this).val() && error++;
		});
		error && (_validate = false);
		return _validate;
	};
	
	var Events = {
		//注册事件
		subscribe:function(){
			//订阅 获取数据模块
			$.subscribe('mod/getdata',exports.getModData);
			
			// 填充 模块数据到表单
			$.subscribe('mod/setdata',function(topic,data){
				exports.setModData(data);
			});
		}//subscribe
	}
	
	/**
	 * 初始化
	 */
	exports.init = function(){
		Events.subscribe();
	};
	
	
});
