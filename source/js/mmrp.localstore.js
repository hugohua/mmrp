/**
 *  localStore 类
 */
define(function(require, exports, module) {  
    
    var localStore = require('localStore'),
    	ls = require('./mmrp.config.localstore');
    	
    exports.getLayoutData = function(){
    	var layout_data = localStore.getItem(ls.layouts);					//tb_layout 表数据
    	return layout_data;
    };
    
    exports.setLayoutData = function(data){
    	localStore.setItem(ls.layouts,data,30);
    };
    
    /***
     * 获取layout缓存数据
 	 * @param {Object} layout_id
     */
    exports.getLayoutDataById = function(layout_id){
    	var data = exports.getLayoutData();
    	if(!data) return;
    	var data = data.data.value;
    	for(var i in data){
    		if(data[i]['layout_id'] == layout_id){
    			return data[i];
    		}
    	}
    };
    
    
    exports.setLayoutDataById = function(layout_id,data){
    	localStore.setItem(ls.layout_pre + layout_id,data,15);
    };
    
    exports.getPageDataById = function(page_id){
    	var page_data = localStore.getItem(ls.page_info_pre + page_id);					//tb_layout 表数据
    	return page_data;
    };
    
    
    exports.setPageDataById = function(page_id,data){
        console.log(data,'data');
    	localStore.setItem(ls.page_info_pre + page_id,data,1);
    };
    
    
    exports.getModData = function(){
    	return localStore.getItem(ls.mod_list);
    };
    
    exports.setModData = function(data){
    	//存储的是value object 是一个array
    	localStore.setItem(ls.mod_list,data,15);
    };
    
    exports.getModDataById = function(mod_id){
    	var data = exports.getModData();
    	if(!data) return;
    	var data = data.data.value;
    	for(var i in data){
    		if(data[i]['mod_id'] == mod_id){
    			return data[i];
    		}
    	}
    };
    
    exports.getModBaseData = function(){
    	return localStore.getItem(ls.mod_base_list);
    };
    
    exports.setModBaseData = function(data){
    	//存储的是value object 是一个array
    	localStore.setItem(ls.mod_base_list,data,15);
    };
    
    exports.getModBaseDataById = function(mod_id){
    	var data = exports.getModBaseData();
    	if(!data) return;
    	for(var i in data){
    		if(data[i]['id'] == mod_id){
    			return data[i];
    		}
    	}
    };
    
    /**
     * 获取 模块分类列表
     */
    exports.getModCateList = function(){
    	return localStore.getItem(ls.mod_cate);
    };
    
    /**
     * 缓存模块分类列表 
 * @param {Object} data
     */
    exports.setModCateList = function(data){
    	//存储的是value object 是一个array
    	localStore.setItem(ls.mod_cate,data,15);
    }
    
   	/**
     * 获取 模块分类列表
     */
    exports.getPageUrls = function(){
    	return localStore.getItem(ls.page_urls);
    };
    
    /**
     * 缓存模块分类列表 
 * @param {Object} data
     */
    exports.setPageUrls = function(data){
    	//存储的是value object 是一个array
    	localStore.setItem(ls.page_urls,data,15);
    }
   	
    
})  