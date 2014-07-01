define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	c = require("./mmrp.config.user");

	exports.adminInit=function(){

		var header='<section><h1>MMRP</h1><ul class="mod_nav"><li><a href="'+c.root+'select_tp.htm">新建流程</a></li><li><a href="'+c.root+'query.htm">流水查询</a></li><li><a href="'+c.root+'admin/layout_add.html" id="js_admin" style="display:none;">高级功能</a><i class="arrow"></i></li></ul><div class="mod_user">[ <span id="js_login_user_name"></span> | <a href="'+c.root+'oa_login.php" id="js_logout" title="注销退出系统">注销</a> ]</div></section><ul class="mod_nav_sub"><li><a '+ (exports.curpage("system.html")?'class="current"':'') +' href="'+c.root+'admin/system.html">系统设置</a></li><li><a '+ (exports.curpage("layout_add.html")?'class="current"':'') +' href="'+c.root+'admin/layout_add.html">录入模板</a></li><li><a '+ (exports.curpage("mod.html")?'class="current"':'') +' href="'+c.root+'admin/mod.html">新增组件</a></li><li><a '+ (exports.curpage("/list.html")?'class="current"':'') +' href="'+c.root+'admin/list.html">查看列表</a></li><li><a '+ (exports.curpage("userlist.html")?'class="current"':'') +' href="'+c.root+'admin/userlist.html">用户权限</a></li><li><a '+ (exports.curpage("statistics.html")?'class="current"':'') +' href="'+c.root+'admin/statistics.html">统计查询</a></li></ul>';

		$(".mmrp_sys_header").html(header);
		exports.footer();
	};
	exports.curpage=function(url){
		if(location.href.indexOf(url)!=-1) return true;
		return false;
	}
	exports.footer=function(){
		var footer='<div><p class="copyright"><span>&copy;</span> 2011-2012 <a href="http://mmrp.oa.com/about.htm" target="_blank">MMRP Dev.team</a> | <a href="http://icase.oa.com/response/contact?Dept=isux&amp;Name=mmrp&amp;Admin[0]=hugohua&amp;Admin[1]=williamsli&amp;Admin[2]=pufentan" target="_blank">意见反馈</a></p><p class="support">Power by HTML5 &amp; CSS3. Support for <a href="http://www.google.com/chrome/" target="_blank">Chrome.</a></p></div>';
		$(".mmrp_sys_footer").html(footer);
	}
	exports.userInit=function(){
		var header='<section><h1>MMRP</h1><ul class="mod_nav"><li><a '+ (exports.curpage("select_tp.htm")?'class="current"':'') +' href="'+c.root+'select_tp.htm">新建流程</a></li><li><a '+ (exports.curpage("query.htm")?'class="current"':'') +' href="'+c.root+'query.htm">流水查询</a></li><li><a href="'+c.root+'admin/layout_add.html" id="js_admin" style="display:none;">高级功能</a><i class="arrow"></i></li></ul><div class="mod_user">[ <span id="js_login_user_name"></span> | <a href="'+c.root+'oa_login.php" id="js_logout" title="注销退出系统">注销</a> ]</div><div id="pagectrl" class="pagectrl"></div></section><div id="mod_nav_sub"></div>';
		$(".mmrp_sys_header").html(header);
		exports.footer();
	}
})  