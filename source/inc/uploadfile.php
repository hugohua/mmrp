<?php
	if($_GET['mode']=='createfile'){
		//假如是上传文件
		header("Content-Type:text/html; charset=utf-8"); 
		$file_content = file_get_contents('php://input'); // 读取收到的文件内容
		$file_name = $_SERVER['HTTP_X_FILE_NAME'];
		$file_size = $_SERVER['HTTP_X_FILE_SIZE'];
		$file_type = $_SERVER['HTTP_X_FILE_TYPE'];
		
		$project="../project/";
		$path=$project.$_GET['path']."/";
		if(!is_dir($path)) mkdir($path,0777);
			
		$img=$path."img/";
		if(!is_dir($img)) mkdir($img,0777);
		
		$css=$path."css/";
		if(!is_dir($css)) mkdir($css,0777);
		
		$js=$path."js/";
		if(!is_dir($js)) mkdir($js,0777);
		
		if($file_type=="text/css")
			$path=$css;
		else if($file_type=="application/x-javascript")
			$path=$js;
		else if($file_type=="image/jpeg" || $file_type=="image/png" || $file_type=="image/gif")
			$path=$img;
		
		if(file_put_contents($path.$file_name,$file_content)>0)
			echo str_replace($project,"",$path).$file_name;
	}
?>