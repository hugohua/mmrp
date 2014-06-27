//上传模块JS
define(function(require, exports, module) {  
    
    var $ = require('jquery'),
    	Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest'),
    	ModConfig = require('./mmrp.page.setting'),
    	BgFun = require('./mmrp.upload.bg.func'),
    	ImgLocal = require('./mmrp.upload.bg.local'),
    	ImgNetwork = require('./mmrp.upload.bg.network');
    
    require('jquery.colorpicker')($);
    
    
    var model = {
    	act_bg_color		:"#js_act_bg_color",							//显示背景色值输入框
    }
    
    /**
	 * 数据获取成功后的操作
	 * @param {Object} theme_id
	 * @param {Object} tb_theme
	 */
	var _successGetThemeData = function(tb_theme){
		
		var page_width = tb_theme.data.value.theme_width,
			page_height = tb_theme.data.value.theme_height,
			bg_color = tb_theme.data.value.theme_bgcolor;
		//加载背景图片到列表
		ImgLocal.setBgList(tb_theme);
		//加载网络图片到输入框
		ImgNetwork.setBgList(tb_theme);
		//加载背景图片到页面
		BgFun.setBgToContainer(tb_theme);

		//设置配置修改 里的页面宽高
		ModConfig.setPageSize(page_width,page_height);
		
		//设置背景颜色
		$(model.act_bg_color).val(bg_color);
	}

	/**
	 * 存在背景时默认加载背景图片到操作区域
	 */
	var setBgUpload = function(){
		var theme_id = Fun.getUrlParam("theme_id");			//theme id
		//存在theme id 并且是数字
		if(theme_id && $.isNumeric(theme_id)){
			
			RestApi.getThemeById(theme_id).success(function(tb_theme){
				console.info("getThemeById", tb_theme)
				if (tb_theme && tb_theme.data && tb_theme.data.value) {
					_successGetThemeData(tb_theme);
				}//if
			})
			
		};
	};
	
	var Events = {
		/**
		 * 切换背景保存按钮
		 */
		submitBtnToggle:function(){
			$('#js_upload_tabs a').on('click.tab',function(){
				var $this = $(this),
					id = $this.attr('data-show');
				//保存按钮 显示隐藏	
				$('#'+id).show().siblings().hide();
				//tab显示
				id === 'js_remote_sumit' ? $('#js_locals').hide() : $('#js_locals').show();
			});
		},
		init:function(){
			this.submitBtnToggle();
		}
	};
	
	var initUploadEvents = function(){
		$('#js_shift_b').one('click.one',function(){
			Events.init();
			ImgLocal.init();
			ImgNetwork.init();
		});
	};
	
	/**
	 * 需要page 数据 才能初始化 
	 */
	exports.init = function(){
		console.info('upload bg init')
		setBgUpload();
		initUploadEvents();
	};

});
