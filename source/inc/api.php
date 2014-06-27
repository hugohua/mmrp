<!DOCTYPE html>
<html lang="zh-cn">
<head>
<meta charset="utf-8" />
<title></title>
</head>
<body>
<?php

?>
<h1>API接口 <em style="color:blue">hander.php?act=</em></h1>
<iframe style="background:#eee" id="api" name="api" width="100%" frameborder="0"></iframe>
<ul>
	<li>
		<h2>模块分类</h2>
		<ul>
			<li><a href="hander.php?act=getCategoryList" target="api">获取模块分类 getCategoryList()</a></li>
			<li><a href="hander.php?act=getCategoryById&id=1" target="api">获取单个模块分类 getCategoryById(int id)</a></li>
		</ul>
	</li>
	<li>
		<h2>模块基础信息</h2>
		<ul>
			<li><a href="hander.php?act=getModByCategory&category=-1" target="api">根据分类获取模块  getModByCategory(int category)</a></li>
			<li><a href="hander.php?act=getModById&id=1" target="api">根据ID获取模块  getModById(int id)</a></li>
		</ul>
	</li>
	<li>
		<h2>模版布局信息</h2>
		<ul>
			<li><a href="hander.php?act=getTemplateList" target="api">获取所有模板 getTemplateList()</a></li>
			<li><a href="hander.php?act=getTemplateById&id=1" target="api">根据ID获取模板 getTemplateById(int id)</a></li>
		</ul>
	</li>
	<li>
		<h2>背景皮肤信息</h2>
		<ul>
			<li><a href="hander.php?act=getThemeList" target="api">获取所有皮肤 getThemeList()</a></li>
			<li><a href="hander.php?act=getThemeById&id=1" target="api">根据id获取皮肤 getThemeById(int id)</a></li>
			<li><a href="hander.php?act=setTheme" target="api">添加/修改皮肤 setTheme(json)</a></li>
		</ul>
	</li>
	<li>
		<h2>页面信息</h2>
		<ul>
			<li><a href="hander.php?act=getPageList" target="api">获取所有页面 getPageList()</a></li>
			<li><a href="hander.php?act=getPageById&id=1" target="api">根据id获取页面 getPageById(int id)</a></li>
		</ul>
	</li>
	<li>
		<h2>删除草稿</h2>
		<ul>
			<li><a href="hander.php?act=delTemplateDraft&id=182" target="api">delTemplateDraft(int id)</a></li>
		</ul>
	</li>\<li>
		<h2>删除草稿</h2>
		<ul>
			<li><a href="hander.php?act=delTemplateDraft&id=182" target="api">delTemplateDraft(int id)</a></li>
		</ul>
	</li>
    <li>
		<h2>用户信息</h2>
		<ul>
			<li><a href="hander.php?act=getUserByName&user=hugo" target="api">getUserByName(string user)</a></li>
		</ul>
	</li>
</ul>

</body>
</html>