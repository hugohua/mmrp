define(function(require, exports, module) {  
    
    var $ = require('jquery');
    
    require('jquery.colorpicker')($);
   	
	/**
	 * 初始化色板选择插件
	 */
	exports.colorPicker = function($id){
		$id.ColorPicker({
			//提交
			onSubmit: function(hsb, hex, rgb, el) {
				$(el).val("#"+hex).ColorPickerHide();
			}, 
			//选择时
			onChange: function(hsb, hex, rgb){
				$id.css('backgroundColor', '#' + hex).setValue('#' + hex);
			},
			onBeforeShow: function () {
				$(this).ColorPickerSetColor(this.value);
			}
		})
		.bind('keyup', function() {
			$(this).ColorPickerSetColor("#"+this.value);
		});
	};
    
})  