<?php

if(!empty($_GET["act"]))
{
	$act=$_GET["act"];
	switch($act){
		case "config":
			editConfig();
			break;
		case "localstore":
			editLocalstore($_GET["key"]);
			break;
	};
}

function editConfig(){
	$content = file_get_contents("../js/mmrp.config.user.js");  //读文件	
};

/**
 * 数据库设置
 */
function setDbConfig(){
	
};

//function

/**
 * 修改localstore文件 以便更新
 */
function editLocalstore($key){
	$key = '_'. $key .'_';
	//用于处理的缓存文件
	$file = '../js/mmrp.config.localstore.js';
	$content = file_get_contents($file);  //读文件
	$start = strpos($content,$key);
	$response = array('error' => '修改local store文件失败!' );
	if($start){
		$end = strlen($key) + 3;
		$find = substr($content,$start,$end);
		$replace = $key . rand(100,200);	
		$newcont = str_replace($find,$replace,$content);
		file_put_contents($file, $newcont); //保存文件 
		$response = array('success' => '修改local store文件成功!' );
	};
	echo json_encode($response);
}

?>