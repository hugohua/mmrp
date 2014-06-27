<?php
require_once 'TOF_Client.class.php';
//$tof = new TOF_Client();

if(!empty($_GET["act"]))
{
	$act=$_GET["act"];
	switch($act){
		case "sendrtx":
			sendRtxApi();
			break;
		case "sendemail":
			sendEmailApi();
			break;
	}
}

function sendRtxApi(){
	$arr=$_POST["data"];
	$Title=$arr["title"];
	$Receiver=$arr["receiver"];
	$MsgInfo=$arr["msginfo"];
	$tof = new TOF_Client();
	echo $tof ->SendRTX("MMRP System", $Receiver, $Title, $MsgInfo);
}

function sendEmailApi(){
	$arr=$_POST["data"];
	$Subject=$arr["subject"];
	$Receiver=$arr["receiver"];
	$Msg=$arr["msg"];
	$Sender = $arr["sender"];
	$tof = new TOF_Client();
	echo $tof ->SendMail($Sender, $Receiver, $Subject, $Msg);
}

?>