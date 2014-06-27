/***
 * hugohua
 */
define(function(require, exports, module) {
	var $ = require('jquery'), 
		c = require('./mmrp.config.user');

	var defaults = {
		dataType : "json"
	};

	/***
	 * 获取api url
	 * @param {Object} api_name
	 */
	var getUrl = function(api_path) {
		var url = c.root + api_path;
		return url;
	};
	/***
	 *
	 * @param {Object} params
	 * @param {Object} type GET/POST/PUT/DELETE
	 */
	var baseRest = function(params, type) {
		$.extend(params, defaults);
		params.type = type || "GET";
		var jxhr = $.ajax(params);
		return jxhr;
	};
	//MMRP
	
	/**
	 * 获取模块基础信息
	 * @param {Object} params
	 */
	exports.getModListByCate = function(cate_id, params) {
		params = params || {};
		//			params.url = getUrl("json_data/tb_mod.txt");
		params.url = getUrl("inc/hander.php?act=getModByCategory&category=" + cate_id);
		return baseRest(params);
	};
	/**
	 * 根据ID获取模块数据
	 * @param {Object} mod_id
	 * @param {Object} params
	 */
	exports.getBaseModDataById = function(mod_id, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getBaseStyleById&id=" + mod_id);
		return baseRest(params);
	};
	/**
	 * 获取基础模块样式
	 */
	exports.getBaseModData = function(params) {
		params = params || {};

		params.url = getUrl("inc/hander.php?act=getBaseStyleList");
		//			params.url = getUrl("json_data/tb_mod_base_style.txt");
		return baseRest(params);
	};
	/**
	 * 根据ID获取模块基础信息
	 * @param {Object} id
	 */
	exports.getModDataById = function(id, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getModById&id=" + id);
		//			params.url = getUrl("json_data/tb_mod_by_id_"+ id +".txt");
		return baseRest(params);
	};
	/**
	 * 删除page
	 * @param {Object} page_id
	 * @param {Object} params
	 */
	exports.delModById = function(mod_id, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=delModById&id=" + mod_id);
		return baseRest(params);
	};
	/**
	 * 删除page
	 * @param {Object} page_id
	 * @param {Object} params
	 */
	exports.delLayoutById = function(layout_id, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=delLayoutById&id=" + layout_id);
		return baseRest(params);
	};
	/**
	 * 根据ID获取theme数据
	 * @param {Object} theme_id
	 * @param {Object} params
	 */
	exports.getThemeById = function(theme_id, params) {
		params = params || {};
		//			params.url = getUrl("json_data/tb_theme_by_id_"+ theme_id +".txt");
		params.url = getUrl("inc/hander.php?act=getThemeById&id=" + theme_id);
		return baseRest(params);
	};
	/**
	 * 获取全部page数据
	 * @param {Object} page_id
	 * @param {Object} params
	 */
	exports.getPageList = function(params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getPageList");
		return baseRest(params);
	};
	/**
	 * 根据ID获取page数据
	 * @param {Object} page_id
	 * @param {Object} params
	 */
	exports.getPageById = function(page_id, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getPageById&id=" + page_id);
		//			params.url = getUrl("json_data/tb_page_by_id_"+ page_id +".txt");
		return baseRest(params);
	};
	/**
	 * 删除page
	 * @param {Object} page_id
	 * @param {Object} params
	 */
	exports.delPageById = function(page_id, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=delPageById&id=" + page_id);
		return baseRest(params);
	};
	/**
	 * 根据用户名获取page数据
	 * @param {Object} page_user
	 * @param {Object} params
	 */
	exports.getPageListByNotUser = function(page_user, start, num, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getPageListByNotUser&user=" + page_user + "&start=" + start + "&num=" + num);
		return baseRest(params);
	};
	/**
	 * 根据用户名获取page数据
	 * @param {Object} page_user
	 * @param {Object} params
	 */
	exports.getPageListByAuthorize = function(page_user, start, num, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getPageListByAuthorize&user=" + page_user + "&start=" + start + "&num=" + num);
		return baseRest(params);
	};
	/**
	 * 根据用户名获取page数据
	 * @param {Object} page_user
	 * @param {Object} params
	 */
	exports.getPageByUser = function(page_user, start, num, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getPageByUser&user=" + page_user + "&start=" + start + "&num=" + num);
		return baseRest(params);
	};
	/**
	 * 根据状态获取page列表
	 */
	exports.getPageListByState = function(state, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getPageListByState&state=" + state);
		return baseRest(params);
	};
	/**
	 * 获取本周页面发布列表
	 */
	exports.getPageListByWeek = function(start, num, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getPageListByWeek&start=" + start + "&num=" + num);
		return baseRest(params);
	};
	/**
	 * 获取本月页面发布列表
	 */
	exports.getPageListByMonth = function(start, num, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getPageListByMonth&start=" + start + "&num=" + num);
		return baseRest(params);
	};
	/**
	 * 根据用户名获取page 草稿 数据
	 * @param {Object} page_user
	 * @param {Object} params
	 */
	exports.getPageByDraft = function(page_user, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getPageByDraft&user=" + page_user);
		return baseRest(params);
	};
	/**
	 * 根据用户名 获取用户数据
	 * @param {Object} user_name
	 * @param {Object} params
	 */
	exports.getUserByName = function(user_name, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getUserByName&user=" + user_name);
		return baseRest(params);
	};
	/**
	 * 获取用户列表
	 */
	exports.getUserList = function(params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getUserList");
		return baseRest(params);
	};

	/**
	 * 根据权限获取用户列表
	 @ @param {int} power
	 * @param {Object} params
	 */
	exports.getUserListByPower = function(power,params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getUserListByPower&power=" + power);
		return baseRest(params);
	};

	/**
	 * 获取用户列表
	 * @param {string} user_id
	 * @param {string} power
	 * @param {Object} params
	 */
	exports.setUserPower = function(user_id,power,params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=setUserPower&user_id="+user_id+"&power="+power);
		return baseRest(params);
	};

	/**
	 * 根据 类型获取 数据总数
	 * @param {string} type
	 * @param {string} user
	 * @param {Object} params
	 */
	exports.getPageCountByType = function(type, user, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getPageCountByType&type=" + type + "&user=" + user);
		return baseRest(params);
	};
	/**
	 * 根据ID获取Tmplate数据
	 * @param {Object} Tmplate_id
	 * @param {Object} params
	 */
	exports.getTemplateById = function(tmplate_id, params) {
		params = params || {};
		//			params.url = getUrl("json_data/tb_tmplate_by_id_"+ tmplate_id +".txt");
		params.url = getUrl("inc/hander.php?act=getTemplateById&id=" + tmplate_id);
		return baseRest(params);
	};
	/**
	 * 删除多余草稿，只保留前5个
	 * @param {Object} tmplate_id
	 * @param {Object} params
	 */
	exports.delTemplateDraft = function(tmplate_id, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=delTemplateDraft&id=" + tmplate_id);
		return baseRest(params);
	};
	/**
	 * 获取JSON格式数据
	 * @param {Object} url
	 */
	exports.getJson = function(url, data) {
		data = data || {};
		var req = $.getJSON(url, data);
		return req;
	};
	/**
	 * 插入数据
	 * @param {Object} data
	 */
	exports.postAddData = function(data) {
		var params = {
			data : data,
			url : getUrl("inc/hander.php?act=insert"),
			success : function(t_data){
				if(t_data.error){
					alert(t_data.message);
				}
			}
		};
		return baseRest(params, "POST");
	};
	/**
	 * 更新数据
	 * @param {Object} data
	 */
	exports.postUpdata = function(data) {
		var params = {
			data : data,
			url : getUrl("inc/hander.php?act=update"),
			success : function(t_data){
				if(t_data.error){
					alert(t_data.message);
				}
			}
		};
		return baseRest(params, "POST");
	};
	/**
	 * 更新页面缩略图
	 * @param {Object} them	缩略图url
	 * @param {Object} page_id 页面Id
	 */
	exports.updatePageThumbnailById = function(thum, page_id, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=updatePageThumbnail&id=" + page_id + "&thum=" + thum);
		return baseRest(params);
	};
	/**
	 * 获取用户权限
	 */
	exports.getUserPower = function(params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getUserPower");
		return baseRest(params);
	};
	/**
	 * $mod_id : 模块Id
	 * 设置模块的使用频率 -1是减一   1是加1
	 *
	 */
	exports.updateModFrequency = function(mod_id, state, params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=modFrequency&mod_id=" + mod_id + "&state=" + state);
		return baseRest(params);
	};
	/***
	 * 发送RTX消息
	 * data = {
	 *		title:"RTX标题",
	 *		receiver:"接收方",
	 *		msginfo:"信息主体"
	 *	}
	 */
	exports.sendRtxMsg = function(data) {
		var params = {
			data : {
				data : data
			},
			url : getUrl("inc/send_msg.php?act=sendrtx")
		};
		return baseRest(params, "POST");
	};
	/***
	 * 发送Email消息
	 * data = {
	 *		subject:"subject",
	 *		receiver:"receiver",
	 *		msg:"msg"
	 *	}
	 */
	exports.sendEmail = function(data) {
		var params = {
			data : {
				data : data
			},
			url : getUrl("inc/send_msg.php?act=sendemail")
		};
		return baseRest(params, "POST");
	};
	/**
	 * 获取用户发布数
	 */
	exports.getUserCountPage = function(params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getUserCountPage");
		return baseRest(params);
	};
	/**
	 * 获取每月发布数
	 */
	exports.getPageCountByData = function(params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getPageCountByData");
		return baseRest(params);
	};
	/**
	 * 获取模块使用频率
	 */
	exports.getModFrequency = function(params) {
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getModFrequency");
		return baseRest(params);
	};
	/**
	 * 检查登陆
	 */
	exports.checkLoginUser = function(data) {
		var params = {
			data : data,
			url : getUrl("inc/hander.php?act=checkLoginUser")
		};
		return baseRest(params, "POST");
	};
	
	/**
	 * 创建活动 
	 */
	exports.createPage = function(data){
		var params = {
			data : data,
			url : getUrl("inc/hander.php?act=createPage")
		};
		return baseRest(params, "POST");
	};
	
	/**
	 * 从现有活动中复制活动 
	 */
	exports.clonePage = function(data){
		var params = {
			data : data,
			url : getUrl("inc/hander.php?act=clonePage")
		};
		return baseRest(params, "POST");
	};
	
	/**
	 * 根据layout id 获取模板 
	 */
	exports.getLayoutById = function(layout_id,params){
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getLayoutById&id=" + layout_id);
		return baseRest(params);
	};
	
	/**
	 * 保存草稿 
 	 * @param {Object} page_id
 	 * @param {Object} data
	 */
	exports.saveDraft = function(page_id,data){
		var params = {
			data : data,
			url : getUrl("inc/hander.php?act=saveDraft&id=" + page_id)
		};
		return baseRest(params, "POST");
	};
	
	/**
	 * 发布页面 
 	 * @param {Object} page_id
 	 * @param {Object} template_id
 	 * @param {Object} data
	 */
	exports.publishPage = function(page_id,template_id,data){
		var params = {
			data : data,
			url : getUrl("inc/hander.php?act=publishPage&page_id=" + page_id + "&template_id=" + template_id)
		};
		return baseRest(params, "POST");
	};
	
	/**
	 * 根据layout id 获取模板 
	 */
	exports.getLayout = function(params){
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getLayout");
		return baseRest(params);
	};
	
	/**
	 * 获取模块分类 
	 */
	exports.getCateList = function(params){
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getCateList");
		return baseRest(params);
	};
	
	/**
	 * 获取模块分类 
	 */
	exports.getUrlList = function(params){
		params = params || {};
		params.url = getUrl("inc/hander.php?act=getUrlList");
		return baseRest(params);
	};
	
	/**
	 * 删除模块分类 
	 */
	exports.delCateById = function(cate_id,params){
		params = params || {};
		params.url = getUrl("inc/hander.php?act=delCateById&id=" + cate_id)
		return baseRest(params);
	};
	
	/**
	 * 删除模块分类 
	 */
	exports.delUrlById = function(url_id,params){
		params = params || {};
		params.url = getUrl("inc/hander.php?act=delUrlById&id=" + url_id)
		return baseRest(params);
	};
	
	/**
	 * 删除模块分类 
	 */
	exports.updateLocalStore = function(key,params){
		params = params || {};
		params.url = getUrl("inc/edit_config.php?act=localstore&key=" + key)
		return baseRest(params);
	};
	
})