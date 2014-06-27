<?php
if(file_exists("mmrp.lock")){
	header("Location:select_tp.htm");
}else{
	header("Location:install.php");
}
?>