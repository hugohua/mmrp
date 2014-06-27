<?php 

require("conn.php");
require_once 'global_func.php';

	if(!empty($_GET["act"]))
	{
		$act=$_GET["act"];
		switch($act){
			case "getCategoryList":
				getCategoryList();
				break;
			case "getCategoryById":
				getCategoryById($_GET["id"]);
				break;
			case "getModByCategory":
				getModByCategory($_GET["category"]);
				break;
			case "getModById":
				getModById($_GET["id"]);
				break;
			case "delModById":
				delModById($_GET["id"]);
				break;	
			case "delLayoutById":
				delLayoutById($_GET["id"]);
				break;		
			case "getBaseStyleById":
				getBaseStyleById($_GET["id"]);
				break;	
			case "getBaseStyleList":
				getBaseStyleList();
				break;	
			case "getTemplateList":
				getTemplateList();
				break;
			case "delTemplateDraft":
				delTemplateDraft($_GET["id"]);
				break;
			case "getTemplateById":
				getTemplateById($_GET["id"]);
				break;
			case "getThemeList":
				getThemeList();
				break;
			case "getThemeById":
				getThemeById($_GET["id"]);
				break;
			case "getPageList":
				getPageList();
				break;
			case "getPageListByState":
				getPageListByState($_GET["state"]);
				break;
			case "delPageById":
				delPageById($_GET["id"]);
				break;
			case "getPageListByNotUser":
				getPageListByNotUser($_GET["user"],$_GET["start"],$_GET["num"]);
				break;
			case "getPageListByAuthorize":
				getPageListByAuthorize($_GET["user"],$_GET["start"],$_GET["num"]);
				break;
			case "getPageById":
				getPageById($_GET["id"]);
				break;
			case "getPageByUser":
				getPageByUser($_GET["user"],$_GET["start"],$_GET["num"]);
				break;
			case "getPageListByWeek":
				getPageListByWeek($_GET["start"],$_GET["num"]);
				break;
			case "getPageListByMonth":
				getPageListByMonth($_GET["start"],$_GET["num"]);
				break;
			case "getPageByDraft":
				getPageByDraft($_GET["user"]);
				break;	
				
			case "setTheme":
				setTheme();
				break;
			case "getUserByName":
				getUserByName($_GET["user"]);
				break;
			case "getUserList":
				getUserList();
				break;
			case "getUserListByPower":
				getUserListByPower($_GET["power"]);
				break;
			case "setUserPower":
				setUserPower($_GET["user_id"],$_GET["power"]);
				break;
			case "updatePageThumbnail":
				updatePageThumbnail($_GET["thum"],$_GET["id"]);
				break;
			case "getUserPower":
				getUserPower();
				break;
			case "getPageCountByType":
				getPageCountByType($_GET["type"],$_GET["user"]);
				break;		
			case "modFrequency":
				modFrequencySetting($_GET["mod_id"],$_GET["state"]);
				break;
			case "getUserCountPage":
				getUserCountPage();
				break;	
			case "getPageCountByData":
				getPageCountByData();
				break;	
			case "getModFrequency":
				getModFrequency();
				break;	
			case "update":
				update();
				break;
			case "insert":
				insert();
				break;
			case "checkLoginUser":
				checkLoginUser();
				break;	
			case "createPage":	
				createPage();
				break;				
			case "clonePage":
				clonePage();
				break;	
			case "getLayoutById":
				getLayoutById($_GET["id"]);
				break;
			case "saveDraft":
				saveDraft($_GET["id"]);
				break;	
			case "publishPage":	
				publishPage($_GET["page_id"],$_GET["template_id"]);
				break;	
			case "getLayout":	
				getLayout();
				break;		
			case "getCateList":
				getCateList();
				break;	
			case "getUrlList":
				getUrlList();
				break;		
			case "delCateById":
				delCateById($_GET["id"]);
				break;
			case "delUrlById":
				delUrlById($_GET["id"]);
				break;			
				
		}
	}
	
	function insertSql($arr){
		$table = $arr["table"];
		$sql="insert ".$table;
		$col="(";
		$val=" values(";
		while(list($name,$value)=each($arr["value"])){
			$temp = str_replace('\\\\','\\',$value);
			$temp = str_replace('\\"','"',$temp);
			$temp = str_replace('\\\'','\'',$temp);
			$col.="$name,";
			$val.= u2utf8(json_encode($temp)) .",";
			//$val.=;
		}
		$col=substr($col,0,strlen($col)-1);
		$col.=")";
		$val=substr($val,0,strlen($val)-1);
		$val.=")";
		$sql.=$col.$val;
		return $sql;
	}
	
	function updateSql($arr){
		$table = $arr["table"];
		//echo $table;
		$sql="update ".$table." set ";
		while(list($name,$value)=each($arr["value"])){
			$temp_u = str_replace('\\\\','\\',$value);
			$temp_u = str_replace('\\"','"',$temp_u);
			$temp_u = str_replace('\\\'','\'',$temp_u);
			$sql.=$name."=".u2utf8(json_encode($temp_u)) .",";
		}
		$sql=substr($sql,0,strlen($sql)-1);
		$where = $arr["where"];
		$sql.=" where ".$where;
		
		return $sql;
	}
	
	
	function insert(){
		
		//$json='{"table":"tb_category","value":{"category_name":"123阿萨德发送到阿斯多夫","category_id":30}}';
		$arr=$_POST["data"];
		$table = $arr["table"];
		$sql = insertSql($arr);
		mysql_query($sql);
		$mid = mysql_insert_id();
		$user = getSessionUser();
		if($mid){
			$response = array(
				'success' => 'success',
				'id' => $mid,
				'data' => $arr
			);	
		}else{
			$response = array(
				'error' => 'error',
				'message' => mysql_error()
			);		
		}
		echo json_encode($response);
		mmrp_log("$user INSERT data for table $table , id = $mid");
	}
	
	function update(){
		
		$arr=$_POST["data"];
		$table = $arr["table"];
		$where = $arr["where"];
		$sql = updateSql($arr);
		$id =  mysql_query($sql);
		$user = getSessionUser();
		if($id){
			$response = array(
				'success' => 'success',
				'id' => $id,
				'data' => $arr
			);	
		}else{
			$response = array(
				'error' => 'error',
				'message' => mysql_error()
			);		
		}
		echo json_encode($response);
		mmrp_log("$user UPDATE data for table $table , $where");
	}
	
	function delTemplateDraft($id){
		$result = "SELECT template_id  FROM `tb_template` WHERE `template_parent_id` = ".$id;
		$rs =  mysql_query($result);
		$num = mysql_numrows($rs);
		$ids = 0;
		if($num > 5){
			$cha = $num - 5;
			$sql_d = "SELECT template_id  FROM `tb_template` WHERE `template_id` != ". $id ." and `template_parent_id` = ". $id ." limit ".$cha;
			$result = mysql_query($sql_d);
			while($row = mysql_fetch_array($result))
			  {
			  mysql_query("DELETE FROM `tb_template` WHERE `tb_template`.`template_id` = ". $row['template_id']);
			  $ids += $row['template_id'] . ',';
			  }
		};
		return $ids;
	}
	
	
	
	function delPageById($id){
		//$sql="DELETE FROM `tb_page` WHERE `tb_page`.`page_id` = ".$id;
		$sql = "UPDATE  `tb_page` SET  `page_state` =  '0' WHERE  `tb_page`.`page_id` =".$id;
		$user = getSessionUser();
		mmrp_log("$user DELETE data for table tb_page , id = $id");
		echo mysql_query($sql);
	}
	
	function updatePageThumbnail($thum,$id){
		$sql = 	"UPDATE `tb_page` SET `page_thumbnail` = '". $thum ."' WHERE `page_id` = ".$id;
		$user = getSessionUser();
		mmrp_log("$user UPDATE thumbnail for table tb_page , id = $id");
		echo mysql_query($sql);
	}
	
	
	function getModByCategory($category)
	{
		$sql="SELECT * FROM  `tb_mod` JOIN tb_category ON tb_mod.`mod_category` = tb_category.`cate_id` where tb_mod.`mod_status` =1";
		if($category!="-1") $sql=$sql." and mod_category=".$category;
		$sql = $sql. " ORDER BY  `mod_sort` ASC";
		//echo $sql;
		$res=mysql_query($sql);
		$json_all=array();
		while($obj=mysql_fetch_object($res))
		{
			$json_all[] = $obj;
			//array_push($json_all,$json);
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_mod";
		$data->value=$json_all;
		
		$out->data=$data;
		echo json_encode($out);
	}
	function getModById($id)
	{
		$sql="select * from tb_mod where mod_id=".$id;
		$res=mysql_query($sql);
		$json_all=array();
		if($obj=mysql_fetch_object($res))
		{
			$json_all = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_mod";
		$data->value=$json_all;
		$out->data=$data;
		echo json_encode($out);
	}
	
	function delModById($id)
	{
		//$sql="DELETE FROM `tb_page` WHERE `tb_page`.`page_id` = ".$id;
		$sql = "UPDATE  `tb_mod` SET  `mod_status` = 0 WHERE  `mod_id` =".$id;
		$user = getSessionUser();
		//echo $sql;
		mmrp_log("$user DELETE data for table tb_mod , id = $id");
		echo mysql_query($sql);	
	}
	
	function delLayoutById($id)
	{
		//$sql="DELETE FROM `tb_page` WHERE `tb_page`.`page_id` = ".$id;
		$sql = "UPDATE  `tb_layout` SET  `layout_status` = 0 WHERE  `layout_id` =".$id;
		$user = getSessionUser();
		//echo $sql;
		mmrp_log("$user DELETE data for table tb_layout , id = $id");
		echo mysql_query($sql);	
	}
	
	
	
	function getBaseStyleById($id)
	{
		$sql="select * from tb_mod_base_style where id=".$id;
		$res=mysql_query($sql);
		$json_all=array();
		if($obj=mysql_fetch_object($res))
		{
			$json_all = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_mod_base_style";
		$data->value=$json_all;
		$out->data=$data;
		echo json_encode($out);
	}
	function getBaseStyleList()
	{
		$sql="select * from tb_mod_base_style";
		$res=mysql_query($sql);
		$json_all=array();
		while($obj=mysql_fetch_object($res))
		{
			$json_all[] = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_mod_base_style";
		$data->value=$json_all;
		$out->data=$data;
		echo json_encode($out);
	}
	function getTemplateList()
	{
		$sql="select * from tb_template";
		$res=mysql_query($sql);
		$json_all=array();
		while($obj=mysql_fetch_object($res))
		{
			$json_all[] = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_template";
		$data->value=$json_all;
		$out->data=$data;
		echo json_encode($out);
	}
	function getTemplateById($id)
	{
		$sql="select * from tb_template where template_id=".$id;
		$res=mysql_query($sql);
		$json_all=array();
		if($obj=mysql_fetch_object($res))
		{
			$json_all = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_template";
		$data->value=$json_all;
		$out->data=$data;
		echo json_encode($out);
	}
	function getThemeList()
	{
		$sql="select * from tb_theme";
		$res=mysql_query($sql);
		$json_all=array();
		while($obj=mysql_fetch_object($res))
		{
			$json_all[] = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_theme";
		$data->value=$json_all;
		$out->data=$data;
		echo json_encode($out);
	}
	function getThemeById($id)
	{
		$sql="select * from tb_theme where theme_id=".$id;
		$res=mysql_query($sql);
		$json_all=array();
		if($obj=mysql_fetch_object($res))
		{
			$json_all = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_theme";
		$data->value=$json_all;
		$out->data=$data;
		echo json_encode($out);
	}

	function getUserList()
	{
		$sql="select * from tb_users";
		$res=mysql_query($sql)	;
		$json_all=array();
		while($obj=mysql_fetch_object($res))
		{
			$json_all[] = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_users";
		$data->value=$json_all;
		$out->data=$data;
		
		echo json_encode($out);
	}

	function getUserListByPower($power)
	{
		$sql="select * from tb_users where user_power=".$power;
		$res=mysql_query($sql)	;
		$json_all=array();
		while($obj=mysql_fetch_object($res))
		{
			$json_all[] = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_users";
		$data->value=$json_all;
		$out->data=$data;
		
		echo json_encode($out);
	}

	function setUserPower($user_id,$power)
	{
		$userpower = _getUserPower();
		//管理员才能修改
		if($userpower['user_power'] == "20"){
			$sql = "UPDATE tb_users SET user_power = ".$power." WHERE user_id =" . $user_id;
			mysql_query($sql);
			echo $user_id;
		}else{
			echo 0;	
		}
		
	}

	function baseSelectPageList($sql){
		$res=mysql_query($sql);
		$json_all=array();
		while($obj=mysql_fetch_object($res))
		{
			$json_all[] = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_page";
		$data->value=$json_all;
		
		//power
		$loginName = getSessionUser();
		$sql2 = "SELECT `user_power` FROM `tb_users` WHERE `login_name` = '". $loginName ."'";
		$result = mysql_query($sql2);
		$power = 0;
		if(!is_bool($result)) {
			$num = mysql_fetch_array($result);
			$power =  $num[0];
		}
		$pw = "power_".$power;
		$data-> $pw =$power;
		$out->data=$data;
		return json_encode($out);	
	}
	
	function getPageList()
	{
		$sql="select * from tb_page where page_theme != 0 and page_template != 0 and page_state = 1 order by page_id desc";
		echo baseSelectPageList($sql);
	}
	
	function getPageListByState($state){
		$sql="select * from tb_page where page_theme != 0 and page_template != 0 and page_is_template='". $state ."'  and page_state = 1 order by page_id desc";
		echo baseSelectPageList($sql);
	}
	
	
	function getPageById($id)
	{
		$sql="select * from tb_page where page_state = 1 and page_id=".$id;
		$res=mysql_query($sql);
		$json_all=array();
		if($obj=mysql_fetch_object($res))
		{
			$json_all = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_page";
		$data->value=$json_all;
		$out->data=$data;
		echo json_encode($out);
	}
	
	
	
	function getPageByUser($user,$start = 0,$num = 50)
	{
		$sql="select * from tb_page where page_creator='".$user . "' and page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_name !='' and page_state = 1 and page_finish_date is not null order by page_id desc LIMIT ". $start ." , ". $num ."";	
		echo baseSelectPageList($sql);
	}
	
	function getPageListByNotUser($user,$start = 0,$num = 50)
	{
		$sql="select * from tb_page where page_creator !='".$user . "' and page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_name !='' and page_state = 1 and page_finish_date is not null order by page_id desc LIMIT ". $start ." , ". $num ."";	
		echo baseSelectPageList($sql);
	}
	
	function getPageListByAuthorize($user,$start = 0,$num = 50)
	{
		$sql="select * from tb_page where `page_authorizer` LIKE  '%" .$user . "%' and page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_name !='' and page_state = 1  order by page_id desc LIMIT ". $start ." , ". $num ."";	
		//echo $sql;
		echo baseSelectPageList($sql);
	}
	
	function getPageListByWeek($start = 0,$num = 50){
		$sql = "select * from tb_page where YEARWEEK(date_format(page_start_date,'%Y-%m-%d'),1) = YEARWEEK(now(),1) and page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_name !='' and page_state = 1 and page_finish_date is not null order by page_id desc LIMIT ". $start ." , ". $num ."";	
		echo baseSelectPageList($sql);
	}
	
	function getPageListByMonth($start = 0,$num = 50){
		$sql = "select * from tb_page where date_format(page_start_date,'%Y-%m')=date_format(now(),'%Y-%m') and page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_name !='' and page_state = 1 and page_finish_date is not null order by page_id desc LIMIT ". $start ." , ". $num ."";	
		echo baseSelectPageList($sql);
	}
	
	function getPageByDraft($user){
		$sql="select * from tb_page where page_creator='".$user . "' and page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_name !='' and page_state = 1 and page_finish_date is null order by page_id desc";	
		echo baseSelectPageList($sql);
	}
	
	function getPageCountByType($type,$user=''){
		switch($type){
			case "week":
			$sql = "select count(page_id) from tb_page where YEARWEEK(date_format(page_start_date,'%Y-%m-%d'),1) = YEARWEEK(now(),1) and page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_name !='' and page_state = 1 and page_finish_date is not null";
			break;	
			
			case "month":
			$sql = "select count(page_id) from tb_page where date_format(page_start_date,'%Y-%m')=date_format(now(),'%Y-%m') and page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_name !='' and page_state = 1 and page_finish_date is not null";	
			break;	
			
			case "me":
			$sql="select count(page_id) from tb_page where page_creator='".$user . "' and page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_name !='' and page_state = 1 and page_finish_date is not null";
			break;	
			
			case "notme":
			$sql="select count(page_id) from tb_page where page_creator !='".$user . "' and page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_name !='' and page_state = 1 and page_finish_date is not null";
			break;
			
			case "authorize":
			$sql="select count(page_id) from tb_page where `page_authorizer` LIKE  '%".$user . "%' and page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_name !=''";
			break;

			default:
			$sql="select count(page_id) from tb_page where page_creator='".$type . "' and page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_name !='' and page_state = 1 and page_finish_date is not null";
		}
		$result = mysql_query($sql);
		$total = 0;
		if(!is_bool($result)) {
			$num = mysql_fetch_array($result);
			$total =  $num[0];
		}
		echo $total;
	}
	
	function setTheme()
	{
		if(is_array($_POST["tb_theme"]))
		{
			$tb_theme=$_POST["tb_theme"];
			$theme_id=$tb_theme["theme_id"];
			if($theme_id=="0")
			{
				$sql="INSERT INTO `tb_theme` (`theme_id`, `theme_bgcolor`, `theme_repeat`, `theme_static`, `theme_css`, `theme_date`, `theme_creator`) VALUES (NULL, '".$tb_theme["theme_bgcolor"]."', '".$tb_theme["theme_repeat"]."', '".$tb_theme["theme_static"]."', '".$tb_theme["theme_css"]."', '".$tb_theme["theme_date"]."', '');";
				mysql_query($sql);
				if(mysql_affected_rows()>0) echo mysql_insert_id();
				else echo 0;
			}else{
				$sql="UPDATE  `tb_theme` SET `theme_bgcolor` =  '".$tb_theme["theme_bgcolor"]."', `theme_repeat` =  '".$tb_theme["theme_repeat"]."', `theme_static` =  '".$tb_theme["theme_static"]."', `theme_css` =  '".$tb_theme["theme_css"]."', `theme_date` =  '".$tb_theme["theme_date"]."', `theme_creator` =  '".$tb_theme["theme_creator"]."' WHERE  `tb_theme`.`theme_id` =".$theme_id.";";
				mysql_query($sql);
				echo $theme_id;
			}
		}
		else echo 0;
	};
	
	function _getUserPower(){
		$loginName = getSessionUser();
		$sql = "SELECT `user_power`,`login_name` FROM `tb_users` WHERE `login_name` = '". $loginName ."'";
        $result = mysql_query($sql);
		if(!is_bool($result)) {
			//存在数据
			$user_power = mysql_fetch_array($result,MYSQL_ASSOC);
			
			return $user_power;
		};
	}
	
	/**
	 *
	 *根据缓存用户名 获取用户权限
	 */
	function getUserPower(){
		$user_power = _getUserPower();
		echo json_encode($user_power);
	}

	/**
	 * $mod_id : 模块Id
	 * 设置模块的使用频率 -1是减一   1是加1
	 */
	function modFrequencySetting($mod_id,$state){
		$sql = 'UPDATE  `tb_mod` SET  `mod_frequency` =  `mod_frequency` + 1  WHERE  `tb_mod`.`mod_id` =' . $mod_id;
		if($state == -1){
			$sql = 'UPDATE  `tb_mod` SET  `mod_frequency` =  `mod_frequency` - 1  WHERE  `tb_mod`.`mod_id` =' . $mod_id;
		}
		mysql_query($sql);
		echo $mod_id;
	}
	
	/**
	 * 获取用户发布页面统计
	 * 
	 */
	function getUserCountPage(){
		$sql = "select count(page_id) as page_counts,page_creator from tb_page where page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_name !='' and page_state = 1 group by page_creator order by page_counts desc";
		$res=mysql_query($sql);
		$json_all=array();
		while($obj=mysql_fetch_object($res))
		{
			$json=array("page_counts"=>$obj->page_counts,
			"page_creator"=>$obj->page_creator
			);
			array_push($json_all,$json);
		}
		
		echo json_encode($json_all);
	}
	
	function getPageCountByData(){
		
		$sql = "select count(page_id) as page_counts,CAST(year(page_start_date) as CHAR(50)) as year , CAST(month(page_start_date) as CHAR(50)) as month from tb_page where  page_theme != 0 and page_template != 0 and page_name IS NOT NULL and page_start_date IS NOT NULL and page_name !='' and page_state = 1 and page_finish_date is not null group by year(page_start_date),month(page_start_date)";
		//音乐
		$res=mysql_query($sql);
		$json_music=array();
		while($obj=mysql_fetch_object($res))
		{
			$json=array("page_counts"=>(int)$obj->page_counts,
						"year"=> (int)$obj->year,
						"month"=> (int)$obj->month
			);
			array_push($json_music,$json);
		}
		
		//视频
		$con_v = connectDBForVideo();
		$res_v=mysql_query($sql,$con_v);
		$json_video=array();
		while($obj=mysql_fetch_object($res_v))
		{
			$json=array("page_counts"=> (int)$obj->page_counts,
						"year"=> (int)$obj->year,
						"month"=> (int)$obj->month
			);
			array_push($json_video,$json);
		}
		$data = new StdClass;
		$data->music= $json_music;
		$data->video= $json_video;
		
		echo json_encode($data);
	}
	
	function getModFrequency(){
		$sql = "SELECT `mod_id`, `mod_name`, `mod_frequency` FROM `tb_mod` ORDER BY `mod_frequency` DESC;";
		$res=mysql_query($sql);
		$json_all=array();
		while($obj=mysql_fetch_object($res))
		{
			$json_all[] = $obj;
		}
		
		echo json_encode($json_all);
	}
	
	function checkLoginUser(){
		$arr=$_POST["data"];
		$loginName = $arr["login_name"];
		$user_password = $arr["user_password"];
		
		$sql = "SELECT `login_name` FROM `tb_users` WHERE `login_name` = '". $loginName ."' and `user_password` = '". $user_password ."'";
		$result = mysql_query($sql);
		echo empty($result);
		if(!empty($result)) {
			//存在数据
			$data = mysql_fetch_array($result,MYSQL_ASSOC);
			
			echo json_encode($data);
		} else {
			//不存在数据 返回 0
			echo 0;
		}
	}
	
	/**
	 * 创建新活动
	 *
	 */
	function createPage(){
		$page_layout=$_POST["data"];
		
		$user = getSessionUser();
		if(!$user) return;
		//插入theme 表数据
		$sql_theme = "INSERT INTO `tb_theme` (`theme_creator`) VALUES ('". $user ."');";
		mysql_query($sql_theme);
		$theme_id = mysql_insert_id();
		
		//插入template 表数据
		$sql_template = "INSERT INTO `tb_template` (`template_name`, `template_date`, `template_creator`) VALUES ('template_name', '". date ("Y-m-d H:m:s") ."','". $user ."' );";
		mysql_query($sql_template);
		$template_id = mysql_insert_id();
		
		//插入 page 表数据
		$sql_page = "INSERT INTO `tb_page` (`page_theme`, `page_template`, `page_layout`,`page_creator`,`page_start_date`) VALUES (". $theme_id .",". $template_id .",'". $page_layout ."','". $user ."', '". date ("Y-m-d H:m:s") ."');";
		mysql_query($sql_page);
		$page_id = mysql_insert_id();
		
		$data = array(
			"page_id" => $page_id,
			"theme_id" => $theme_id,
			"template_id" => $template_id
		);
		echo json_encode($data);
	}
	
	/**
	 * 从现有活动中创建新活动
	 */
	function clonePage(){
		
		$ids=$_POST["data"];
		
		$user = getSessionUser();
		if(!$user) return;
		
		$sql_theme = "INSERT INTO `tb_theme` (`theme_bgcolor`, `theme_repeat`, `theme_static`, `theme_css`,`theme_date`, `theme_creator` , `theme_width`, `theme_height`) SELECT `theme_bgcolor`, `theme_repeat`, `theme_static`, `theme_css`, '". date ("Y-m-d H:m:s") ."', '". $user ."', `theme_width`, `theme_height` FROM `tb_theme` WHERE `theme_id` = " .$ids['theme_id'];
		mysql_query($sql_theme);
		$theme_id = mysql_insert_id();
		
		//插入template 表数据
		$sql_template = "INSERT INTO `tb_template` (`template_parent_id`, `template_name`, `template_html`, `template_css`, `template_status`, `template_modstyle`, `template_date`, `template_creator`) SELECT `template_parent_id`, `template_name`, `template_html`, `template_css`,  `template_status`, ". $theme_id .", '". date ("Y-m-d H:m:s") ."', '". $user ."' FROM `tb_template` WHERE `template_id` = " . $ids['template_id'];
		mysql_query($sql_template);
		$template_id = mysql_insert_id();
		
		//如果ID存在
		if($theme_id && $template_id){
			//插入 page 表数据
			$sql_page = "INSERT INTO `tb_page` (`page_theme`, `page_template`, `page_date`,`page_layout`, `page_creator`, `page_start_date`) VALUES (". $theme_id .",". $template_id .", '". date ("Y-m-d H:m:s") ."','". $ids['page_layout'] ."', '". $user ."', '". date ("Y-m-d H:m:s") ."');";
			mysql_query($sql_page);
			$page_id = mysql_insert_id();
			
			$data = array(
				"page_id" => $page_id,
				"theme_id" => $theme_id,
				"template_id" => $template_id
			);
		}else{
			$data = array('error' => '创建活动失败' );
		}
		
		
		echo json_encode($data);
	};
	
	function getLayoutById($id){
		$sql="select * from tb_layout where layout_status= 1 and layout_id=".$id;
		$res=mysql_query($sql);
		$json_all=array();
		if($obj=mysql_fetch_object($res))
		{
			$json_all = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_layout";
		$data->value=$json_all;
		$out->data=$data;
		echo json_encode($out);
		
	};
	
	/**
	 * 保存草稿
	 */
	function saveDraftBase($template_id,$arr){
		//插入新数据
		$sql_insert = insertSql($arr);
		mysql_query($sql_insert);
		$mid = mysql_insert_id();
		//更新本条数据
		$arr["value"]["template_parent_id"] = $template_id;
		$sql = updateSql($arr);
		$suc = mysql_query($sql);
		//删除多余草稿
		$del_id = delTemplateDraft($template_id);
		$response = array(
			'error' => 'error',
			'updata_id' => $template_id
		);	
		if($mid && $suc){
			$response = array(
				'success' => 'success',
				'updata_id' => $template_id,
				'insert_id' => $mid,
				'delete_id' => $del_id
			);	
		}
		return $response;
	}
	
	
	function saveDraft($id){
		$id = (int)$id;
		$arr=$_POST["data"];
		$response = saveDraftBase($id,$arr);
		echo json_encode($response);
	};
	
	/**
	 * 发布页面
	 */
	function publishPage($page_id,$template_id){
		
		$response = array(
			'error' => 'error',
			'updata_id' => $page_id
		);
		
		//保存template 数据
		$arr=$_POST["data"];
		saveDraftBase($template_id,$arr);
		//更新page数据
		$sql="select * from tb_page where page_state = 1 and page_id=".$page_id;
		$res=mysql_query($sql);
		
		//存在该页面
		if($obj=mysql_fetch_object($res)){
			$page_finish_date = empty($obj->page_finish_date) ?  date("Y-m-d H:i:s") : ($obj->page_finish_date);
			$page_type	 	  = $obj->page_type;
			$page_directory   = $obj->page_directory;
			$page_url 		  = $page_type . $page_directory . "/index.html";
			$page_inter_url   = 'project/release/' . $page_directory . "/index.html";
			$page_modify_user = getSessionUser();
			$page_creator   = $obj->page_creator;
			
			//if( empty($page_finish_date) ||  )
			$sql2 = "UPDATE `tb_page` SET `page_url` = '". $page_url ."' , `page_modify_user` = '". $page_modify_user ."', `page_finish_date` = '". $page_finish_date ."'  WHERE `page_id` = ".$page_id;
			$mid =  mysql_query($sql2);
			
			if($mid){
				$response = array(
					'success' => 'success',
					'page_finish_date' => $page_finish_date,
					'page_type' => $page_type,
					'page_directory' => $page_directory,
					'page_url' => $page_url,
					'page_inter_url' => $page_inter_url,
					'page_modify_user' => $page_modify_user,
					'page_creator' => $page_creator
				);
			}//end if
		}//end if
		
		echo json_encode($response);
		
	};
	
	//获取layout
	function getLayout(){
		$sql="select * from tb_layout where layout_status = 1";
		$res=mysql_query($sql);
		$json_all=array();
		while($obj=mysql_fetch_object($res))
		{
			$json_all[] = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_layout";
		$data->value=$json_all;
		$out->data=$data;
		echo json_encode($out);
	};
	
	function getCateList()
	{
		$sql="select * from tb_category where cate_status = 1";
		$res=mysql_query($sql);
		$json_all=array();
		while($obj=mysql_fetch_object($res))
		{
			$json_all[] = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_category";
		$data->value=$json_all;
		$out->data=$data;
		echo json_encode($out);
	}
	
	function getUrlList()
	{
		$sql="select * from tb_url where url_status = 1";
		$res=mysql_query($sql);
		$json_all=array();
		while($obj=mysql_fetch_object($res))
		{
			$json_all[] = $obj;
		}
		$data = new StdClass;
		$out = new StdClass;
		$data->table="tb_url";
		$data->value=$json_all;
		$out->data=$data;
		echo json_encode($out);
	}
	
	function delCateById($id){
		//$sql="DELETE FROM `tb_page` WHERE `tb_page`.`page_id` = ".$id;
		$sql = "UPDATE  `tb_category` SET  `cate_status` =  '0' WHERE  `tb_category`.`cate_id` =".$id;
		$user = getSessionUser();
		mmrp_log("$user DELETE data for table tb_category , id = $id");
		echo mysql_query($sql);
	}
	
	function delUrlById($id){
		//$sql="DELETE FROM `tb_page` WHERE `tb_page`.`page_id` = ".$id;
		$sql = "UPDATE  `tb_url` SET  `url_status` =  '0' WHERE  `tb_url`.`url_id` =".$id;
		$user = getSessionUser();
		mmrp_log("$user DELETE data for table tb_url , id = $id");
		echo mysql_query($sql);
	}
	
?>