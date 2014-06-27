<?php
ob_start();
require_once 'inc/TOF_Client.class.php';
require_once 'inc/global_func.php';
$tof = new TOF_Client();
$english_name = $tof->getUser();
//echo $english_name . "==your name!";

$LPATH = "http://";
$LPATH .= $_SERVER["HTTP_HOST"];//主机名

 if (dirname($_SERVER["REQUEST_URI"]) != "/"){
	 $LPATH .= dirname($_SERVER["REQUEST_URI"]);//路径
}

if(isset($english_name)){
	mmrp_log("$english_name user login oa_login page.","logs/");
	
	
	$loginoa_url = $LPATH ."/oa_login.php";

	$last_url =  $LPATH ."/index.php";
	if(isset($_COOKIE['last_login_page'])){
		$last_url = $_COOKIE['last_login_page'];
	}
	header("location: ".$last_url);
	exit();
}
ob_end_flush();
?>