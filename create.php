<?php

$data = file_get_contents('php://input');

$snd_file = 'uploads/'.$_POST['snd_file'];
$out_file = 'output/'.stristr($_POST['snd_file'], '.', true).'.mp4';

if($_POST['img_file'] == 'visualization') {
	$ffmpeg = 'ffmpeg -i '.$snd_file.' -filter_complex "[0:a]showwaves=s=640x360:mode=line,format=yuv420p[v]" -map "[v]" -map 0:a -c:v libx264 -c:a copy '.$out_file;
} else {
	$img_file = 'uploads/'.$_POST['img_file'];
	$ffmpeg = 'ffmpeg -loop 1 -i '.$img_file.' -i '.$snd_file.' -c:v libx264 -tune stillimage -c:a aac -strict experimental -b:a 192k -s 640x360 -shortest '.$out_file;
}
exec($ffmpeg, $res, $err); 
if ($err == 1) {
	echo 'err';
} else {
	echo $out_file;
}
?>