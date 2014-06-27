//上传模块JS
define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	Mustache = require('mustache'),
    	
    	Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest'),
    	ModConfig = require('./mmrp.page.setting'),
    	BgFun = require('./mmrp.upload.bg.func');
    
    
    var model = {
		act_bg_color		:"#js_act_bg_color",							//显示背景色值输入框
		
		upload_sumit		:"#js_remote_sumit",							//保存按钮
		upload_close		:'#js_upload_close',							//关闭按钮
		li_remote_tmpl		:'#js_remote_tmpl',								//本地上传 容器li图片
		
		//平铺背景
		rp_input			:'#js_remote_rp_input',							//平铺背景输入框
		upload_remote		:'#js_upload_remote',							//tab容器
		upload_remote_con	:'#js_upload_remote_con',						//背景容器
		upload_remote_rp	:'#js_upload_remote_rp',						//平铺背景容器
		
		del_img				:".js_del_row",									//删除图片按钮
		add_img				:".js_add_row",									//新增图片按钮
		
    };
    
    var page_id = Fun.getUrlParam("id") || 0,					//page id
		theme_id = Fun.getUrlParam("theme_id") || 0;			//theme id
		
	var msg = {
		edit_img_succ:'背景图修改成功',
		
	};
	
	
	/**
	 * 获取img的一些属性  返回一个数组对象
	 */
	var getImgsAttr = function(){
		
		var arr = [],
			bg_rp ={},
			
			db_arr = [],															//用于存放 存到DB的数据
			db_rp = []
			$rp_img = $("li.js_uploading",model.upload_remote_rp),								//平铺图片
			$bg_img = $("li.js_uploading",model.upload_remote_con);					//内容图片
		
		if($bg_img.length){
			//内容图片
			$bg_img.each(function(i){
				var $this = $(this),
					src = $this.find("input[type='url']").val(),
					width = parseInt($this.find(".js_width").val(),10),
					height = parseInt($this.find(".js_height").val(),10);
				//用于构建css 和html结构	
				arr.push({name : src,width : width,height : height,class_name : "bg_" + ( i + 1)});
				//用于存入db theme_static 字段
				db_arr.push({name:src,width : width,height : height});
			});
		};//if
		
		var src = $rp_img.find("input[type='url']").val();
		if(src){
			var width = parseInt($rp_img.find(".js_width").val(),10),
				height = parseInt($rp_img.find(".js_height").val(),10);
			
			//背景平铺图片  用于构建css 和html结构
			//用于存入db theme_static 字段
			db_rp = [{name : src,width : width,height : height}]
		}//if
		
		return {
			bg_color:$(model.act_bg_color).val(),		//背景色
			bg_rp:db_rp,								//平铺背景arr
			bg_static : arr,							//背景图片arr
			bg_static_db :JSON.stringify(db_arr),		//背景图片db string
			bg_rp_db:JSON.stringify(db_rp)				//平铺图片db string
		};
	};
	
    /**
	 * 获取tb_theme表数据
	 */
	var getThemeData = function(){
		var img_attr = getImgsAttr(),
			bg_code = BgFun.getThemeCode(img_attr);
			
		var obj = {
			data: {
				table:"tb_theme",
				value: {
					theme_bgcolor: img_attr.bg_color,
					theme_repeat: img_attr.bg_rp_db,
					theme_remote_url: img_attr.bg_static_db,
					theme_static:'',//清空本地上传的图片
					theme_css: bg_code.style,
					theme_creator: Fun.getUserName(),
					theme_width: bg_code.page_width,
					theme_height:bg_code.page_height,
					theme_date: Fun.getNowTime()
				},
				where: "theme_id=" + theme_id
			}
		};
		console.info(obj,'getImgsAttr')
		return obj;
	};
	
	/**
	 * 添加图片到输入框内
	 * @param {Object} filename : 文件名
	 * $container 容器
	 */
	var appendImgToList = function(data,container){
		//容器不存在时 则是默认上传容器
		container = container || model.upload_remote_con;
		
		var tpl = $(model.li_remote_tmpl).html(),
			d = {value:data},
			listHtml = Mustache.to_html(tpl, d);	
		$(container).html(listHtml);
		console.info(data,container,'appendImgToList')
	};
	
	/***
	 * 页面加载时，加载背景图片到框里
	 * @param {Object} data
	 */
	exports.setBgList = function(tb_theme){
		console.info('tb_theme=',tb_theme)
		var data = tb_theme.data.value;
		if (data && data.theme_remote_url) {
			var bg_list = JSON.parse(data.theme_remote_url); //背景图
			appendImgToList(bg_list);
		}//if
			
		//存在平铺背景 
		if (data && data.theme_repeat && data.theme_repeat !== '[]') {
			var bg_rp = JSON.parse(data.theme_repeat);//平铺背景
			
			if( bg_rp[0]['name'].indexOf("http://") !== -1  ){
				appendImgToList(bg_rp,model.upload_remote_rp);
			};
		}//
	};
	
	
	var Events = {
		/**
		 * 删除一行
		 */
		delImg:function(){
			$(model.upload_remote_con).on('click.del',model.del_img,function(){
				$(this).closest("li").remove();
			});
		},
		/**
		 * 新增一行 
		 */
		addImg:function(){
			$(model.upload_remote_con).on('click.add',model.add_img,function(){
				var tpl = $(model.li_remote_tmpl).html(),
					d = {value:{url:'',width:'',height:''}}
				listHtml = Mustache.to_html(tpl, d);
				$(this).closest("li").after(listHtml);
			});
		},
		
		/**
		 * 失去焦点时设置图片大小和保持状态
		 */
		setImgValue:function(){
			//失去焦点时触发
			$(model.upload_remote).delegate("input[type='url']","blur",function(){
				var $this = $(this),
					$li = $this.closest("li"),
					val = $this.val();
				if(val){
					$("<img />").attr("src", val).load(function(){
						$li.find(".js_width").val(this.width);
						$li.find(".js_height").val(this.height); // work for in memory images.
						$this.removeClass('error');
					}).error(function(){
						$this.addClass('error');
					});
					//添加类名 说明已有值
					$li.addClass("js_uploading");
				}else{
					//清空和移除类名
					$li.find('input').val('');
					$li.removeClass("js_uploading");
				}
					
			});
		},
		
		/**
		 * 保存事件 
		 */
		submitData:function(){
			$(model.upload_sumit).on("click.uploadbg",function(){
				//是否存在图片
				var length = $("li.js_uploading",model.upload_remote_con).length;
				
				var obj = getThemeData();
							
				RestApi.postUpdata(obj).success(function(t_data){
					if (t_data.success) {
						BgFun.setBgToContainer(obj);
						alert(msg.edit_img_succ);
						$(model.upload_close).trigger("click");
					}
				})
				//更新缩略图
				var img_url = $("input[type='url']:first",$(model.upload_remote_con)).val();
				RestApi.updatePageThumbnailById(img_url,page_id);	
			});
		},
		
		init:function(){
			this.delImg();
			this.addImg();
			this.setImgValue();
			this.submitData();
		}
	}
	
	exports.init = function(){
		//初始化事件
		Events.init();
	};

});
