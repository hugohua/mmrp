/**
 * 统计查询
 */
define(function(require, exports, module) {  
	
	var $ = require('jquery'),
		c = require('./mmrp.config.user'),
    	Fun = require('./mmrp.func'),
    	RestApi = require('./mmrp.rest');;
	
	
	var chart;
	
	var getUserPage = function(){
		RestApi.getUserCountPage();
	};
	
	var c_option = {
		title:{
			x:-20
		},
		yAxis:{
			title:null
		},
		tooltip:{
			shared: true,
			crosshairs: true
		},
		plotOptions:{
			line:{
				dataLabels:{
					enabled:true
				}
			},
			column:{
				dataLabels:{
					enabled:true
				}
			}
		}
	};
	
	var initChart = function(){
		RestApi.getPageCountByData().success(function(c_data){
			var p_data = [],
				p_labels = [];
			
			for(var c in c_data){
				p_data.push( parseInt(c_data[c]['page_counts'],10));
				p_labels.push( c_data[c]['page_time']);
			};
			
			var c_data = {
				chart:{
					renderTo:'js_chart_users',
					defaultSeriesType: 'line'
				},
				title:{
					text:'每月发布数',
				},
				series:[{
					name:'每月发布数',
					lineWidth: 4,
					data:p_data
				}],
				xAxis: {
					categories: p_labels
				},
				tooltip:{
					pointFormat :' <span>本月发布数</span>: <b>{point.y}</b><br/>'
				}
				

			};
			
			var o2=$.extend({},c_option,c_data,true);
			chart = new Highcharts.Chart(o2);
		});
	};
	
	/**
	 * 初始化模块使用频率
	 */
	var initChartFrequency = function(){
		RestApi.getModFrequency().success(function(c_data){
			var p_data = [],
				p_labels = [];
			
			for(var c in c_data){
				p_data.push( parseInt(c_data[c]['mod_frequency'],10));
				p_labels.push( c_data[c]['mod_name']);
			};
			
			var c_data = {
				chart:{
					renderTo:'js_chart_frequency',
					defaultSeriesType: 'column'
				},
				title:{
					text:'模块使用频率',
				},
				series:[{
					name:'模块使用频率',
					// lineWidth: 4,
					data:p_data
				}],
				xAxis: {
					min: -1,
					categories: p_labels,
					labels: {
						rotation: -45,
						align: 'right'
					}
				},
				tooltip:{
					pointFormat :' <span>模块使用次数</span>: <b>{point.y}</b><br/>'
				}
			};
			
			var o2=$.extend({},c_option,c_data,true);
			chart = new Highcharts.Chart(o2);
		});
	};
	
	exports.init = function(){
		Fun.initGlobal();
		initChart();
		initChartFrequency();
	}
	
});
