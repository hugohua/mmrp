<?php
// Example. Zip all .html files in the current directory and save to current directory.
// Make a copy, also to the current dir, for good measure.
include_once("zip.class.php");

if(!empty($_GET["action"]))
{
	$act=$_GET["action"];
	switch($act){
		case "createzip":
			createZip($_GET["html_dir"],$_GET["img_dir"],$_GET["file_name"]);
			break;	
	}
}

function createZip($html_dir,$img_dir,$file_name){
	$html_dir = '../project/' . $html_dir;
	$img_dir = '../project/' . $img_dir;
	$zip = new Zip();
	$zip->setComment("MMRP ". $file_name ." Zip file.\nCreated on " . date('l jS \of F Y h:i:s A'));
	$zip->addDirectoryContent($html_dir, $file_name);
	$zip->addDirectoryContent($img_dir, $file_name);
	$zip->finalize(); // as we are not using getZipData or getZipFile, we need to call finalize ourselves.
	echo $zip->sendZip($file_name .'.zip');
}





?>
