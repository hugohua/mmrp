<?php
include 'crop.image.to.square.class.php';

/***
 * 创建文件夹
 */
function mkdirs($dir, $mode = 0777) {
	if (is_dir ( $dir ) || @mkdir ( $dir, $mode ))
		return true;
	if (! mkdirs ( dirname ( $dir ), $mode ))
		return false;
	return @mkdir ( $dir, $mode );
}

$upload_folder = 'project';

if (isset ( $_POST ['filename'] )){
 	$filename = $_POST ['filename'];
};

//新建文件夹
 if (isset ( $_POST ['folder'] )){
 	$upload_folder = $_POST ['folder'];
 	mkdirs($upload_folder);
 };
 
 $cut_height = 200;
 if (isset ( $_POST ['cut_height'] )){
 	$cut_height = $_POST ['cut_height'];
 };
 
$crop = new Crop_Image_To_Square;
$crop->source_image = $upload_folder . $filename;

$crop->save_to_folder = $upload_folder;

$process = $crop->crop($cut_height);

if($process)
{
	echo json_encode($process);
}
?>
