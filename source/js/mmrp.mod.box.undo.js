define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	localStore = require('localStore'),
    	BoxFun = require('./mmrp.mod.box.func'),
    	shortcut = require('shortcut');
    
   	
   	var model = {
   		//撤销操作
		music_action		:"music_action",								//缓存的历史记录
		music_action_num	:"music_action_num",							//记录指针
   	}
   	
   	/****************撤销操作******************/
	
	/**
	 * 保存操作记录到 cache，撤销操作
	 */
	exports.saveRepealBox = function($dom,action){
		var $dom = $dom,
			box = {
				id		:		$dom.attr("id"),
				style	:		$dom.attr("style"),
				html	:		$dom.html(),
				action	:		action
			},
			music_action = localStore.getItem(model.music_action) || [],
			music_action_num = localStore.getItem(model.music_action_num) || 1;
		
		//记录数不在最后
		if(music_action_num !=1){
			music_action.splice( (music_action.length - music_action_num + 1),music_action.length,box);
		}else{
			music_action.push(box);		
		}
		
		
		//用数组缓存记录
		localStore.setItem(model.music_action,music_action,1);
		//记录
		localStore.setItem(model.music_action_num,1,1);
		//console.info(music_action.length,localStore.getItem(model.music_action_num),localStore.getItem(model.music_action),"dd");
	};
	
	/**
	 * 撤销操作
	 */
	exports.repealBox = function(action_num){
		var music_action = localStore.getItem(model.music_action) || [],
			length = music_action.length,
			action_num = localStore.getItem(model.music_action_num);
			
		if(length>0){
			var dom_obj = music_action[length-action_num],
				action = dom_obj.action,
				$dom = $("#"+dom_obj.id),
				dom_obj_pre , $dom_pre;
				//撤销的上一步object
				
			// ulog.info(length,action_num,dom_obj)	
			switch(action){
				//移动
				case "move":
				case "resize":
				$dom.attr("style",dom_obj.style);
				break;
				
				//创建
				case "create":
				BoxFun.remove($dom);
				break;
				
				
			};
		};
	};
	
	/**
	 * 撤销事件
	 */
	model.repealBoxEvent = function(){
		//页面加载时清空缓存
		localStore.removeItem(model.music_action_num);
		localStore.removeItem(model.music_action);
		
		shortcut.add("ctrl+z",function(){
			
			var a_num = localStore.getItem(model.music_action_num) || 1,
				length = (localStore.getItem(model.music_action) || []).length;
			if(a_num <= length)	{
				repealBox(a_num);
				localStore.setItem(model.music_action_num,(a_num+1),1);
			}else{
				//撤销到最后一步
				console.info("last ctrl + z")
				//指针如果到顶的时候则启用循环
				// a_num = 1;
				// localStore.setItem(model.music_action_num,1,1);
				// repealBox(a_num);
			}
			
			
			return false;
		}, { 'type': 'keydown', 'propagate': false,'disable_in_input':true });
	};
	
	/****************撤销操作******************/
    
    
})  