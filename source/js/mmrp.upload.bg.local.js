//上传模块JS
define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	Mustache = require('mustache'),
    	localStore = require('localStore'),
    	
    	Fun = require('./mmrp.func'),
    	c = require('./mmrp.config.user'),
    	ls = require('./mmrp.config.localstore'),
    	RestApi = require('./mmrp.rest'),
    	upload = require('./mmrp.mod.uploader'),
    	cp = require('./mmrp.colorpicker'),
    	BgFun = require('./mmrp.upload.bg.func');
    
    require('jquery.ui')($);
    
    var model = {
    	//上传背景
    	//upload_container 	:"#js_mod_upload",								//上传背景容器
		file_uploader		:"js_drop_bg",									//上传背景按钮
		file_uploader_online:'js_online_bg',								//在线切图按钮
		upload_list			:"#js_upload_list",								//背景图片容器
		upload_bg			:"#js_upload_bg",								//平铺背景容器
		colorpicker			:"#js_colorpicker",								//背景颜色选取
		act_bg_color		:"#js_act_bg_color",							//显示背景色值输入框
		upload_sumit		:"#js_upload_sumit",							//保存按钮
		upload_close		:'#js_upload_close',							//关闭按钮
		li_upload_tmpl		:'#js_upload_tmpl',								//本地上传 容器li图片
		
		//上传背景
		bg_list_container	:".js_bg_list",									//上传背景list容器
		drag_bg_ul			:".js_drag_bg",									//拖动图片背景ul容器
		del_img				:".js_del_img",									//删除图片按钮
		
		bg_style			:"#js_bg_style",								//背景css样式ID
		act_bg				:"#js_act_bg"									//上传背景显示的容器ID
		
		
    };
    
    var page_id = Fun.getUrlParam("id") || 0,					//page id
		theme_id = Fun.getUrlParam("theme_id") || 0;			//theme id
		
	var msg = {
		edit_img_succ:'背景图修改成功'
	};
	
	/**
	 * 获取img的一些属性  返回一个数组对象
	 */
	var getImgsAttr = function(){
		
		var arr = [],
			bg_rp ={},
			
			db_arr = [],											//用于存放 存到DB的数据
			db_rp = [],
			$rp_img = $("img:last",model.upload_bg),				//平铺图片
			$bg_img = $("img",model.upload_list);					//内容图片
		
		if($bg_img.length){
			$bg_img.each(function(i){
				var $this = $(this),
					src = $this.attr("src"),							//路径
					name = $this.attr("data-name"),						//图片名称
					size = $this.attr("data-size"),						//图片大小
					width = parseInt($this.attr("data-width"),10),		//图片宽度
					height = parseInt($this.attr("data-height"),10);	//图片高度
				//用于构建css 和html结构	
				arr.push({
					name : src,
					width : width,
					height : height,
					class_name : "bg_" + ( i + 1)
				});
				//用于存入db theme_static 字段
				db_arr.push({
					name:name,
					width : width,
					height : height,
					size:size
				});
				
			});//each
		}//if
		
		
		if($rp_img.length){
			//背景平铺图片  用于构建css 和html结构
			bg_rp = {
				name : $rp_img.attr("src"),
				width : parseInt($rp_img.attr("data-width"),10),
				height : parseInt($rp_img.attr("data-height"),10)
			};
			
			//用于存入db theme_static 字段
			db_rp = [{
				name : $rp_img.attr("data-name"),
				width : parseInt($rp_img.attr("data-width"),10),
				height : parseInt($rp_img.attr("data-height"),10)
			}]
		}//if
		
		
		
		return {
			bg_color:$(model.act_bg_color).val(),		//背景色
			bg_rp:bg_rp,								//平铺背景arr
			bg_static : arr,							//背景图片arr
			bg_static_db :JSON.stringify(db_arr),		//背景图片db string
			bg_rp_db:JSON.stringify(db_rp)				//平铺图片db string
		};
	};
    
	/**
	 * 添加图片到容器内
	 * @param {Object} data : 文件名
	 * $container 容器
	 */
	var appendImgToList = function(data,$container){
		//容器不存在时 则是默认上传容器
		$container = $container || model.upload_list;
		$(model.bg_list_container).show();
		var path = BgFun.getImgPath().absolute_path,		//图片路径
			tpl = $(model.li_upload_tmpl).html(),
			d,listHtml;
		//带有success值 说明是从本地上传的数据，而不是页面加载时的数据
		if(data.success){
			d = {
				value:{
					name:data.filename,
					width:data.width,
					height:data.height,
					url:path + data.filename,
					size:data.size
				}
			}
		}else{
			//数据库加载
			d = {value:data}
		};
		//填充模板的数据	
		listHtml = Mustache.to_html(tpl, d);
		$("ul", $container).append(listHtml);
	};
	
	
	
	
	/***
	 * 获取图片文件列表
	 * return : 存入数据库表tb_theme对象
	 */
	var getThemeData = function(){
		var img_attr = getImgsAttr(),
			bg_code = BgFun.getThemeCode(img_attr);
		console.info(bg_code)
		var obj = {
			data: {
				table:"tb_theme",
				value: {
					theme_bgcolor: img_attr.bg_color,
					theme_repeat: img_attr.bg_rp_db,//getBgList($(model.upload_bg),true),//平铺背景
					theme_static: img_attr.bg_static_db,//getBgList($(model.upload_list)),
					theme_css: bg_code.style,
					theme_creator: Fun.getUserName(),
					theme_width: bg_code.page_width || 1002,
					theme_height:bg_code.page_height || 800,
					theme_remote_url:'',
					theme_date: Fun.getNowTime()
				},
				where: "theme_id=" + theme_id
			}
		};
		return obj;
	};
	
	/**
	 * 处理db的数据
	 * 未将 图片URL 存DB
	 */
	var changeDBdata = function(data){
		var path = BgFun.getImgPath().absolute_path;		//图片路径
		for(var d in data){
			data[d]['url'] = path + data[d]['name']
		};
		return data;
	};
	
	
	/***
	 * 页面加载时，加载本地背景图片到框里
	 * @param {Object} data
	 */
	exports.setBgList = function(tb_theme){
		var data = tb_theme.data.value;
		if (data && data.theme_static) {
			var bg_list = JSON.parse(data.theme_static);	//背景图
			//存在背景图片
			appendImgToList( changeDBdata(bg_list),model.upload_list);
		};
		
		//存在平铺背景 
		if (data && data.theme_repeat && data.theme_repeat !== '[]') {
			var bg_rp = JSON.parse(data.theme_repeat);//平铺背景
			console.info(bg_rp)
			//不是网络图片
			if( bg_rp[0]['name'].indexOf("http://") === -1  ){
				appendImgToList( changeDBdata(bg_rp) ,model.upload_bg);
			};
		}	
	};
	
	
	
	var Events = {
		
		/**
		 * 拖动
		 */
		sortable:function(){
			$(model.drag_bg_ul).sortable({
				placeholder: "ui-state-highlight"
//				connectWith: model.drag_bg_ul
			});
		},
		
		/**
		 * 删除一行
		 */
		delImg:function(){
			$(model.upload_list).on('click.del',model.del_img,function(){
				$(this).closest("li").remove();
			});
		},
		
		/**
		 * 初始化背景色效果插件和事件 
		 */
		colorPicker:function(){
			cp.colorPicker($(model.act_bg_color));
		},
		
		/**
		 * 本地上传插件
		 */
		createUploader: function(){
			var path = BgFun.getImgPath().relative_path;
			upload.createUploader(model.file_uploader,path,function(responseJSON){
				if(!responseJSON.error){
					console.info(responseJSON);
					appendImgToList(responseJSON);
				};
	    	})
		},
		
		/**
		 * 在线切图 
		 */
		createUploaderForOnline:function(){
			var path = BgFun.getImgPath().relative_path;
			upload.createUploader(model.file_uploader_online,path,function(responseJSON){
				if(!responseJSON.error){
					$.post(c.root + "inc/cut_img.php",{
						"filename":responseJSON.filename,
						"folder":'../'+ responseJSON.directory,
						"cut_height":$("#js_cut_height").val()
					},function(data) {
					  for(var d in data){
					  	console.info(data[d]);
						appendImgToList(data[d]);
					  }
					},"json");
				};
	    	})
		},
		
		/**
		 * 保存事件 
		 */
		submitData:function(){
			$(model.upload_sumit).on("click.uploadbg",function(){
				//是否存在图片
				var length = $("img",model.upload_list).length;
				
				var obj = getThemeData();
							
				RestApi.postUpdata(obj).success(function(t_data){
					if (t_data.success) {
						BgFun.setBgToContainer(obj);
						alert(msg.edit_img_succ);
						$(model.upload_close).trigger("click");
					}
				})
				//更新缩略图
				var img_url = $("img:first",$(model.upload_list)).attr("src");
				img_url && RestApi.updatePageThumbnailById(img_url,page_id);	
				
			});
		},
		
		
		/**
		 * 初始化 
		 */
		init:function(){
//			this.sortable();
			this.delImg();
			this.colorPicker();
			this.createUploader();
			this.createUploaderForOnline();
			this.submitData();
		}
		
	};//events
	
	
	exports.init = function(){
		//初始化事件
		Events.init();
	};

});
