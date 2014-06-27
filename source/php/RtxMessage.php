<?php

class Tencent_RtxMessage
{
	public $Sender;
	public $Receiver;
	public $Title;
	public $MsgInfo;
	public $Priority;

	function __construct($sender, $receiver, $title, $msgInfo, $pirority) {
		$this->Sender = $sender;
		$this->Receiver = $receiver;
		$this->Title = $title;
		$this->MsgInfo = $msgInfo;
		$this->Priority = $pirority;
	}
}

?>
