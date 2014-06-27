<?php
if(!isset($_SESSION)){ 
ini_set ( 'session.save_path' , dirname ( __FILE__ ) . '/session_temp/' );
session_start();
} 
$conn=mysql_connect("localhost", "media", "media"); 
mysql_select_db("db_mmrp"); 
mysql_query("set names 'utf8'");
?>