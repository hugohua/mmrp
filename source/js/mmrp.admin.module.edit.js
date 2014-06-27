/**
 * 模块修改
 */

define(function(require, exports, module) {  
	
	var $ = require('jquery'),
    	Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest'),
    	ModGetSet = require('./mmrp.admin.module.getset');
	
	require('jquery.field')($);
	require('jquery.pubsub')($);
	
	
	var msg = {
		edit_success:"修改成功",
		validate_error:'所填字段不能为空'
	};
	
	
	
	
	/**
	 * 根据mod id 获取 数据
	 * 先要获取基础模块数据 
	 */
	var getModDataById = function(mod_id){
		var req = RestApi.getModDataById(mod_id);
		req.success(function(m_data){
			//存在数据
			if(m_data && m_data.data && m_data.data.value){
				ModGetSet.setModData(m_data.data.value);
			}
		});
		
		return req;
	};
	
	var Events = {
		editMod:function(){
			$('#js_mod_edit_btn').on('click',function(){
				var data = ModGetSet.getModData(),
					validate = ModGetSet.validate();
				//表单验证	
				if(validate){
					RestApi.postUpdata(data).success(function(t_data){
						if(t_data.success){
							//更新缓存配置文件
							RestApi.updateLocalStore('mod_list');
							alert(msg.edit_success);
						};
					});
				}else{
					alert(msg.validate_error)
				}
				
				return false;
			})
		},
		//注册事件
		subscribe:function(){
			//订阅 获取模块
			$.subscribe('mod/getbyid',function(topic,mod_id){
				getModDataById(mod_id)
			})
		},
		init:function(){
			this.editMod();
			this.subscribe();
		}
	}
	
	
	/**
	 * 初始化
	 */
	exports.init = function(){
		Events.init();
	};
	
	
});
