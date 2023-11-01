<?php

require 'config.php';

$abbr = $_GET['abbr'];

$data = array();
$sql = "SELECT * from bibl_AIEGL_Abbreviations aiegl
	INNER JOIN bibl_AIEGL_SEG_Abbr aieg_seg ON aiegl.id = aieg_seg.aiegl_id 
	INNER JOIN bibl_SEG_Abbreviations seg ON seg.id = aieg_seg.seg_id
	WHERE aiegl.abbreviation = '$abbr'";

//echo "create query <br>";
$result = mysqli_query($conn, $sql);
//echo "query executed <br>";
if (mysqli_num_rows($result) > 0) {
  // output data of each row
  while($row = mysqli_fetch_assoc($result)) {
   // echo "id: " . $row["id"] . "<br>";
	$data[]=$row;
  }
} 

mysqli_close($conn);
echo json_encode($data);
?>
