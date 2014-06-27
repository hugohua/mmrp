<?php

require_once('RtxMessage.php');

class Tencent_RtxSender
{
	const MESSAGES_SERVICE_URL_COM = "http://ws.oa.com/messageservice.asmx?wsdl";
	//const MESSAGES_SERVICE_URL_SPE = "http://ws.oa.com/services/messageservice.asmx?wsdl";
	const MESSAGES_SERVICE_URL_SPE = "http://ws.tof.oa.com/MessageService.svc?wsdl";

	const NOTIFY = 0;
	const SMS    = 1;
	
	const PIRORITY_LOW    = 'Low';
	const PIRORITY_NORMAL = 'Normal';
	const PIRORITY_HIGHT  = 'Hight';
	
	const TOF_APPKEY = "67ca45e01481461aa5900b997fa6e05b";

	public static function send($sender, $receiver, $title, $msgInfo, 
								$msgType = Tencent_RtxSender::NOTIFY, 
								$priority = Tencent_RtxSender::PIRORITY_NORMAL, 
								$fromEncoding = 'gb2312')
	{
		if (in_array($_SERVER['SERVER_NAME'], array('www.test.com', 'ossadmin.vicp.net')) 
			|| (substr($_SERVER['SERVER_NAME'], 0, 8) == 'jamesqin'))
		{
			return true;
		}

		if (!isset($sender) || !isset($receiver) || !isset($title) || !isset($msgInfo) || !isset($msgType)) {
			throw new Exception('Call Tencent_RtxSender.send() missing parameter');
		}

		if (($msgType != 0) && ($msgType != 1)) {
			throw new Exception('call Tencent_RtxSender.send() msgType must be 0 or 1');
		}
		
		if (is_numeric($priority)) {
			$prioArray = array(-1 => 'Low', 0 => 'Normal', 1 => 'Hight');
			$priority = $prioArray[$priority];
		}
		
		if (empty($priority)) {
			throw new Exception('call Tencent_RtxSender.send() priority must be -1/0/1/Low/Normal/Hight');
		}
	
		if ($fromEncoding != 'utf-8')
		{
			$title = mb_convert_encoding($title, 'utf-8', 'gbk');
			$msgInfo = mb_convert_encoding($msgInfo, 'utf-8', 'gbk');
		}
		
		// 准备webservice地址、命名空间、tof要求的appkey
		$url = Tencent_RtxSender::MESSAGES_SERVICE_URL_SPE;
		$ns = "http://www.w3.org/2001/XMLSchema-instance";
		$nsnode = "http://schemas.datacontract.org/2004/07/Tencent.OA.Framework.Context";		
		$appkeyvar = new SoapVar("<Application_Context xmlns:i=\"{$ns}\"><AppKey xmlns=\"{$nsnode}\">".Tencent_RtxSender::TOF_APPKEY."</AppKey></Application_Context>",XSD_ANYXML);

		// 构造soap对象，把appkey作为soap header设置进去
		$client = new SoapClient("http://ws.tof.oa.com/MessageService.svc?wsdl");
		$header = new SoapHeader($ns, 'Application_Context',$appkeyvar);
		$client->__setSoapHeaders(array($header));

		// 根据需要，调用SendRtx或SendSms
		if ($msgType == Tencent_RtxSender::NOTIFY)
		{
			try {
				$param = array('message' => new Tencent_RtxMessage($sender, $receiver, $title, $msgInfo, $priority));
				$result = $client->SendRTX($param);
			} catch (SoapFault $e) {
				echo $e;
			}
		}
		else
		{
			try {
				$param = array('message' => new Tencent_RtxMessage($sender, $receiver, $title, $msgInfo, $priority));
				$result = $client->SendSMS($param);
			} catch (SoapFault $e) {
				echo $e;
			}
		}
		
		unset($client);

		return true;
	}
}

?>
