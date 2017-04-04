<style>
input[type="file"] { font-size:24px; width:195px; color:#FFF}
input[type="submit"] {width:180px; height:70px; margin:40px; cursor:pointer; background: #FFF; color:#CCC;font-size:28px}
.main {background: #EEE; text-align:center; padding:5%; margin:auto; font-family:Arial, Helvetica, San Serif}
#link {text-align:center; line-height:30px; font-size:18px; visibility:hidden;}
</style>
<div class="main">
<form action="" method="post" enctype="multipart/form-data">

<input type="file" name="data"/><br>
<input type="submit" value="OK" class="submit"/>
<div id="res">
<p id="res_text"></p>
<input type="text" id="link" size="50" onfocus="this.select();" onmouseup="return false;">
</div>
</form>
</div>


<?php
$_CONFIG['domain'] = 'm2v.buizz.ru';
$uploaddir = __DIR__.'/upload/';
if ($_FILES['data']) {
$uploadfile = $uploaddir . basename($_FILES['data']['name']);
$link = "http://".$_CONFIG['domain']."/ftp/upload/".basename($_FILES['data']['name']);
if (move_uploaded_file($_FILES['data']['tmp_name'], $uploadfile)) {
	echo"<script>
		document.querySelector('#link').style.visibility = 'visible'; 
		document.querySelector('#link').value = '".$link."'; 
		document.querySelector('#res_text').innerHTML = 'Your file was successfuly uploaded';
	</script>";
} 
else echo "File is not uploaded</pre>";
}
?>

