define({
	//网站根目录
	root:"http://localhost/github/mmrp/source/",






	
	//获取数据API
	mod_data_api:"http://localhost/media_svn/html/mmrp/mmrp_v3/source/",
	
	//外网图片实际地址
	real_img:'http://localhost/mmrp_v3_beta/',
	
	//发布成功后 弹窗通知的人
	rtx_users:["hugohua","williamsli"],
	
	//同步html文件到其他机器
	synHtml:function(data){
		console.info(data,'synHtml');
		return "http://mmrp.oa.com/cgi-bin/mmrp_release/mmrp_release_file?filetype=";
	},
	
	/**
	 * 同步Img文件到其他机器  上传图片时调用此函数
 	 * @param {Object} data:{
 	 * 	 success:true//上传成功标识
 	 * 	 directory: ''  //图片所在文件夹（相对路径）
 	 *   filename: '' //图片文件名
 	 *   filetype:  '' //图片类型，eg：jpg、png
 	 *   size:''//图片大小 单位（KB）
 	 *   width:''//图片宽度 单位(px)
 	 *   height:''//图片高度 单位(px)
 	 * }
	 */
	synImg:function(data){
		console.info(data,'synimg');
		return "http://mmrp.oa.com/cgi-bin/mmrp_release/mmrp_release_file?filetype=";
	},
	
	//debug为true时，禁用localstore 每次请求最新数据
	debug:true
	
})  