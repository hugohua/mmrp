/**
 * 文件发布
 */
define(function(require, exports, module) {  
	var $ = require('jquery');
    	localStore = require('./mmrp.localstore'),
    	c = require('./mmrp.config.user'),
    	Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest'),
    	Template = require('./mmrp.mod.template'),
    	Make = require('./mmrp.make.file');

	/**
	 * layout 布局 
	 */
	var page_id = Fun.getUrlParam("id"),
		template_id = Fun.getUrlParam('template_id'),
		layout_id = Fun.getUrlParam("layout_id");
	
	var model = {
		publish_btn			:"#js_publish_btn",								//发布按钮
		pub_dialog			:'#js_pub_dialog',								//发布成功后的弹窗
		pub_link			:'#js_pub_link',									//发布后的url地址
		page_inter_url		:'#js_page_inter_url',
		dowm_zip			:'#js_down_btn',
	};
	
	var msg = {
		confirm:'确定要发布吗？',
		save_success : '模板保存成功',
		power:"你未有发布权限，请联系相关人员开通!"
	};
	
	
	/***
	 * 弹出成功提示框
	 */
	var alertSuccessDialog = function(data){
		$(model.pub_link).attr("href",data.page_url).text(data.page_url);
		$(model.page_inter_url).attr('href',c.root + data.page_inter_url).text(c.root + data.page_inter_url);
		$(model.dowm_zip).attr("href",c.root + "inc/zip_api.php?action=createzip&html_dir=release/" + data.page_directory + '&img_dir=release_img/' + data.page_directory + '&file_name='+data.page_directory);
		$(model.pub_dialog).modal('show');
	};
	
	
	/**
	 * MMRP发布 RTX提醒
	 * users = [修改者，创建者]
	 */
	var sendSuccessRtxMsg = function(users,pub_url){
		var extra_info = '',
			receivers = Fun.clearSort($.merge(users,c.rtx_users)).join(';');//合并 去重
		
		//是否是本人修改
		if(users[0]!== users[1]){
			extra_info = "提醒："+ users[1] +"创建的活动已被【"+ users[0] +"】修改。"
		};
		
		RestApi.sendRtxMsg({
			title:"MMRP页面发布周知",
			receiver:receivers,
	 		msginfo: extra_info + "发布人："+ users[0] +"。外网查看地址:["+ pub_url +"|"+ pub_url +"](页面同步到外网需要1--2分钟，若无法打开链接，请稍后再试！)"
		});
	};
	
	/**
	 * 同步APi 
	 */
	var sysFile = function(data){
		var s_data = $.extend({}, data, {
			page_id : Fun.getUrlParam("id"),
			template_id : Fun.getUrlParam('template_id'),
			layout_id : Fun.getUrlParam("layout_id")
		});
		
		var sys_api = c.synHtml(s_data);
		return $.get(sys_api);
	}
	
	/**
	 * 生成文件 并更新DB 
	 */
	var makeFileSaveDb = function(){
		
		var mkq = Make.makeFile(),	//生成文件
			template_data = Template.getTemplateData(1);
			
		//更新tb_template表  和 tb_page表
		var	req = RestApi.publishPage(page_id,template_id,template_data);
		
		$.when(mkq,req).done(function(m,r){
			var data = r[0];
			//弹窗
			alertSuccessDialog(data);
			//rtx通知
			sendSuccessRtxMsg([data.page_modify_user,data.page_creator],data.page_url);
			//同步cgi
			sysFile(data);
		});
		
	};//makeFileSaveDb
	
	var Events = {
		
		/**
		 * 发布 
		 */
		publish:function(){
			$(model.publish_btn).on('click.pub',function(){
				if (confirm(msg.confirm) && page_id && template_id && layout_id) {
					RestApi.getUserPower().success(function(p_data){
						var user_power = parseInt(p_data.user_power,10),		//power 20 则有发布权限
							login_name = p_data.login_name,
							user_name = Fun.getUserName();
						//非来宾用户,有发布权限 && power 20 则有发布权限
						if((user_power === 10 && login_name === user_name) || (user_power ==20)){
							//保存并发布
							makeFileSaveDb()
						}else{
						alert(msg.power);
						};
					});
				};//if 
			});
		},
		
		init:function(){
			this.publish();
		}
		
	};
	
	exports.init = function(){
		Events.init();
	};
	
});
