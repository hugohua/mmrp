<?php
/*
 --------------------------------------------------------------------------------------------
 Credits: Bit Repository

 Source URL: http://www.bitrepository.com/web-programming/php/crop-rectangle-to-square.html
 --------------------------------------------------------------------------------------------
 */

/* Crop Image Class */

class Crop_Image_To_Square {

	var $source_image;
	var $new_image_name;
	var $save_to_folder;
	
	private function formatSizeUnits($bytes)
	{
		if ($bytes >= 1073741824)
		{
			$bytes = number_format($bytes / 1073741824, 2) . ' GB';
		}
		elseif ($bytes >= 1048576)
		{
			$bytes = number_format($bytes / 1048576, 2) . ' MB';
		}
		elseif ($bytes >= 1024)
		{
			$bytes = number_format($bytes / 1024, 2) . ' KB';
		}
		elseif ($bytes > 1)
		{
			$bytes = $bytes . ' bytes';
		}
		elseif ($bytes == 1)
		{
			$bytes = $bytes . ' byte';
		}
		else
		{
			$bytes = '0 bytes';
		}
		
		return $bytes;
	}

	function crop($single_height = 200) {
		//获取图片的宽高等信息
		$info = GetImageSize($this -> source_image);
		$width = $info[0];
		$height = $info[1];
		//循环的最大次数
		$heightnum = ceil($height / $single_height);
		$mime = $info['mime'];

		// What sort of image?

		$type = substr(strrchr($mime, '/'), 1);

		switch ($type) {
			case 'jpeg' :
				$image_create_func = 'ImageCreateFromJPEG';
				$image_save_func = 'ImageJPEG';
				$new_image_ext = 'jpg';
				break;

			case 'png' :
				$image_create_func = 'ImageCreateFromPNG';
				$image_save_func = 'ImagePNG';
				$new_image_ext = 'png';
				break;

			case 'bmp' :
				$image_create_func = 'ImageCreateFromBMP';
				$image_save_func = 'ImageBMP';
				$new_image_ext = 'bmp';
				break;

			case 'gif' :
				$image_create_func = 'ImageCreateFromGIF';
				$image_save_func = 'ImageGIF';
				$new_image_ext = 'gif';
				break;

			case 'vnd.wap.wbmp' :
				$image_create_func = 'ImageCreateFromWBMP';
				$image_save_func = 'ImageWBMP';
				$new_image_ext = 'bmp';
				break;

			case 'xbm' :
				$image_create_func = 'ImageCreateFromXBM';
				$image_save_func = 'ImageXBM';
				$new_image_ext = 'xbm';
				break;

			default :
				$image_create_func = 'ImageCreateFromJPEG';
				$image_save_func = 'ImageJPEG';
				$new_image_ext = 'jpg';
		}

		$new_width = $width;
		//创建一张新图片
		$image = $image_create_func($this -> source_image);
		$json_all=array();
		$k = 0;
		for ($i = 0; $i < $heightnum; $i++) {
			$new_height = $single_height;
			$y_pos = $i * $new_height;
			$k++;
			//最后一张
			if($heightnum -$i == 1){
				$y_pos = ($heightnum -1)*$new_height;
				$new_height = $height - ( ($heightnum -1) * $single_height);
			}
			$new_image = ImageCreateTrueColor($new_width, $new_height);
			// echo $y_pos . "==";
			// Crop to Square using the given dimensions
			ImageCopy($new_image, $image, 0, 0, 0, $y_pos, $new_width, $new_height);

			if ($this -> save_to_folder) {
				if ($this -> new_image_name) {
					$new_name = $this -> new_image_name . '.' . $new_image_ext;
				} else {
					$new_name = basename($this -> source_image,".".$new_image_ext) . '_' . $k . '.' . $new_image_ext;
				}
				
				$save_path = $this -> save_to_folder . $new_name;
			}
			// Save image
			$process = $image_save_func($new_image, $save_path) or die("There was a problem in saving the new file.");
			
			$filesize = filesize($save_path);
			$json=array(
				"filename"=>$new_name,
				"width"=>$new_width,
				"height"=>$new_height,
				"size"=>$this->formatSizeUnits($filesize),
				"y_pos"=>$y_pos,
				"success"=>true
			);
			array_push($json_all,$json);

		}//end for

		return $json_all;

	}
	
	/**
	 *转换格式
	 *
	 */
	function change_type($filepath,$filename,$type = 'png') {
		//获取图片的宽高等信息
		$img = $filepath.$filename;
		$info = GetImageSize($img);
		$width = $info[0];
		$height = $info[1];
		$temp = explode(".",$filename); 
		$new_filename = $temp[0] .'.' . $type;
		$save_path = $filepath . $new_filename;
		switch ($type) {
			case 'png' :
				$im = imagecreatefromjpeg($img);
				// Fill with alpha background
				$alphabg = imagecolorallocatealpha($im, 0, 0, 0, 127);
				imagefill($im, 0, 0, $alphabg);
				
				// Convert to palette-based with no dithering and 255 colors with alpha
				imagetruecolortopalette($im, false, 255);
				imagesavealpha($im, true);
				// Save the image
				imagepng($im, $save_path);
				imagedestroy($im);
				$process = true;
				break;
				
			case 'jpeg' :
			default :
				$image = imagecreatefrompng($img);
				imagejpeg($image, $save_path, 60);
				imagedestroy($image);
				$process = true;
				break;
		}
		$filesize = filesize($save_path);
		$json_all=array();
		$json=array(
			"filename"=>$new_filename,
			"width"=>$width,
			"size"=>$this->formatSizeUnits($filesize)
		);
		array_push($json_all,$json);


		return $json_all;

	}

	function new_image_name($filename) {
		$string = trim($filename);
		$string = strtolower($string);
		return $string;
	}

}
?>