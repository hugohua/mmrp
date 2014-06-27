<?php 
$urlf="http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
$po= strripos($urlf,"/");
$path = substr($urlf,0,$po+1);

if(file_exists("mmrp.lock")){
	echo '网站已成功安装，若需重新安装，请删除根目录下的"mmrp.lock"文件';
	exit;
}

if(isset($_POST['Submit'])){
	$mydbuser = $_POST['js_db_user'];
	$mydbpw = $_POST['js_db_pass'];
	$mydbname = $_POST['js_db_name'];
	$mydbip = $_POST['js_db_ip'];
	$pageurl = $_POST['js_page_url'];
	if(!@mysql_connect($mydbip,$mydbuser,$mydbpw)) {
		echo "mysql用户名或密码不正确.返回修改.<br><a href=\"#\" onClick=\"window.history.back();\">返回</a>";
		exit;
	};
	
	
	$str = '<?php' . "\n";
	$str .= 'if(!isset($_SESSION)){ '. "\n";
	$str .= 'ini_set ( \'session.save_path\' , dirname ( __FILE__ ) . \'/session_temp/\' ); '. "\n";
	$str .= 'session_start(); '. "\n";
	$str .= '} '. "\n";
	$str .= '$conn=mysql_connect("'. $mydbip .'", "'. $mydbuser .'", "'. $mydbpw .'"); '. "\n";
	$str .= 'mysql_select_db("'. $mydbname .'"); '. "\n";
	$str .= 'mysql_query("set names \'utf8\'");'. "\n";
	$str .= '?>';
	
	$file = 'inc/conn.php';
	file_put_contents($file, chr(0xEF).chr(0xBB).chr(0xBF).$str); //保存数据库配置文件文件 
	file_put_contents('mmrp.lock','数据库成功安装后生成该文件，若需要重新填写数据库信息，可删除该文件！');//安装成功 lock
	
	//修改config文件 网站路径
	$file = 'js/mmrp.config.user.js';
	$content = file_get_contents($file);  //读文件
	if ( preg_match( "/root.*,/", $content, $match ) ) {
		$replace = 'root:"'. $pageurl .'",'. "\n";
		$newcont = str_replace($match[0],$replace,$content);
		file_put_contents($file, $newcont); //保存文件 
	}
	
	echo "安装顺利完成!<br>";
	echo '<a href="index.php">进入MMRP系统</a>';
	exit;
	
};

?>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>The MultiMedia Release Platform</title>
<link rel="stylesheet" href="css/bootstrap.css" />
<link rel="stylesheet" href="css/mmrp_v2.css" />
<script src="js/libs/sea.js"></script>
</head>
<body>

<div class="mmrp_sys_form">
	<form class="mmrp_sys_projinfo form-horizontal" method="post" action="">
		<legend>网站配置</legend>
		<div class="control-group">
			<label class="control-label" for="focusedInput">数据库名</label>
			<div class="controls"><input name="js_db_name" value="" type="text" placeholder="如：db_mmrp" /></div>
		</div>
		<div class="control-group">
			<label class="control-label" for="focusedInput">用户名</label>
			<div class="controls"><input name="js_db_user" value="" type="text" placeholder="如：root" /></div>
		</div>
		<div class="control-group">
			<label class="control-label" for="focusedInput">密码</label>
			<div class="controls"><input name="js_db_pass" value=""  type="text" placeholder="如：1234" /></div>
		</div>
		<div class="control-group">
			<label class="control-label" for="focusedInput">数据库主机</label>
			<div class="controls"><input name="js_db_ip" value=""  type="text" placeholder="如：localhost" /></div>
		</div>
        <div class="control-group">
			<label class="control-label" for="focusedInput">网站根目录</label>
			<div class="controls"><input name="js_page_url" value="<?php echo $path; ?>"  type="url" placeholder="如：http://localhost/mmrp_v3_beta/" /></div>
		</div>
	 	<div class="next"><button type="submit" name="Submit" class="btn btn-primary">确认</button></div>
	</form>
    
</div>
<footer class="mmrp_sys_footer">
	<div>
		<p class="copyright"><span>&copy;</span> 2011-2012 <a href="about.htm">MMRP Dev.team</a> | <a href="http://icase.oa.com/response/contact?Dept=isux&amp;Name=mmrp&amp;Admin[0]=hugohua&amp;Admin[1]=williamsli&amp;Admin[2]=pufentan" target="_blank">意见反馈</a></p>
		<p class="support">Power by HTML5 &amp; CSS3. Support for <a href="http://www.google.com/chrome/" target="_blank">Chrome.</a></p>
	</div>
</footer>
</body>
</html>