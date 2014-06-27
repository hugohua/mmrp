<?php

include("inc/conn.php");
require_once 'inc/global_func.php';

$mk_folder = 'project';

$html_code = $_POST["html"];
$css_code = $_POST["css"];
$page_id = $_POST["page_id"];
$charset = $_POST['charset'];


if (isset ( $_POST ['folder'] )){
 	$mk_folder = $_POST ['folder'];
	mkdirs($mk_folder);
 }
 
 


$html_code = str_replace('\\"','"',$html_code);
$html_code = str_replace('\\\\','\\',$html_code);
$html_code = str_replace('\\\'','\'',$html_code);

$css_code = str_replace('\\"','"',$css_code);
$css_code = str_replace('\\\\','\\',$css_code);
$css_code = str_replace('\\\'','\'',$css_code);

$html_code = str_replace('{style}', minify($css_code) ,$html_code);

$html_path = $mk_folder . "/index.html";

//如果是预览文件
if(!strpos($mk_folder,"_temp")){
updatepage($html_code,$page_id,$html_code);
}
//GBK
if($charset == 2){
	$html_code = chr(0xEF).chr(0xBB).chr(0xBF).$html_code;
};

file_put_contents($html_path,$html_code);


if (file_exists($html_path))
{echo "done";}
else
{echo "error";}

function updatepage($data,$page_id,$html_code){
		
	$sql = "UPDATE `tb_page` SET `page_data` = ". u2utf8(json_encode($html_code)) ." WHERE `tb_page`.`page_id` = ". $page_id .";";
	//echo $sql;
	echo mysql_query($sql);
}

function minify( $css ) {
	$css = preg_replace( '#\s+#', ' ', $css );
	$css = preg_replace( '#/\*.*?\*/#s', '', $css );
	$css = str_replace( '; ', ';', $css );
	$css = str_replace( ': ', ':', $css );
	$css = str_replace( ' {', '{', $css );
	$css = str_replace( '{ ', '{', $css );
	$css = str_replace( ', ', ',', $css );
	$css = str_replace( '} ', '}', $css );
	$css = str_replace( ';}', '}', $css );

	return trim( $css );
}
	

?>