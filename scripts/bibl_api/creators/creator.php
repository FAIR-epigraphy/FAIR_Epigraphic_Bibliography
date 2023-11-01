<?php
require '../config.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if (isset($postdata)) {
  $method = trim($request->method);
  if ($method == 'addCreatorVIAF') {
    echo json_encode(addCreatorVIAF($request, $conn));
  } else if ($method == 'addCreatorORCID') {
    echo json_encode(addCreatorORCID($request, $conn));
  } else if ($method == 'getVIAFByCreator') {
    echo json_encode(getVIAFByCreator($request, $conn));
  } else if ($method == 'getVIAFByCreatorByCallNo') {
    echo json_encode(getVIAFByCreatorByCallNo($request, $conn));
  }
} else {
  http_response_code(404);
}

function getVIAFByCreatorByCallNo($request, $conn)
{
  try {
    $data = array();
    $callNumber = trim($request->callNumber);

    $sql = "SELECT * FROM bibl_item_creator Where callNumber = '$callNumber'";

    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
      // output data of each row
      while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
      }
    }

    return $data;
  } catch (Exception $e) {
    return 'Error: ' . $e->getMessage();
  }
}

function getVIAFByCreator($request, $conn)
{
  try {
    $data = array();
    $first_name = trim($request->creator->firstName);
    $last_name = trim($request->creator->lastName);

    $sql = "SELECT * FROM bibl_item_creator Where first_name = '$first_name' AND last_name = '$last_name'";

    $result = mysqli_query($conn, $sql);
    //return $frist_name . $last_name;

    if (mysqli_num_rows($result) > 0) {
      // output data of each row
      while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
      }
    }

    return $data;
  } catch (Exception $e) {
    return 'Error: ' . $e->getMessage();
  }
}
function addCreatorVIAF($request, $conn)
{
  try {
    $first_name = trim($request->creator->firstName);
    $last_name = trim($request->creator->lastName);
    $creatorType = trim($request->creator->creatorType);
    $callNumber = trim($request->callNumber);
    $VIAF = trim($request->creator->VIAF->value);
    $userId = trim($request->userId);

    $sql = '';
    //return getVIAFByCreator($request, $conn);
    if (count(getVIAFByCreator($request, $conn)) > 0) {
      $sql = "UPDATE bibl_item_creator SET VIAF = '$VIAF', modified_by = '$userId' 
                Where first_name = '$first_name' AND last_name = '$last_name'";
    } else {
      $sql = "INSERT INTO bibl_item_creator (first_name, last_name, VIAF, callNumber, creatorType, added_by) 
                    Values ('$first_name', '$last_name', '$VIAF', '$callNumber', '$creatorType', '$userId')";
    }

    if (mysqli_query($conn, $sql)) {
      return 'success';
    }
  } catch (Exception $e) {
    return 'Error: ' . $e->getMessage();
  }
}

function addCreatorORCID($request, $conn)
{
  try {
    $first_name = trim($request->creator->firstName);
    $last_name = trim($request->creator->lastName);
    $creatorType = trim($request->creator->creatorType);
    $callNumber = trim($request->callNumber);
    $ORCID = trim($request->creator->ORCID->value);
    $userId = trim($request->userId);

    $sql = '';
    //return getVIAFByCreator($request, $conn);
    if (count(getVIAFByCreator($request, $conn)) > 0) {
      $sql = "UPDATE bibl_item_creator SET ORCID = '$ORCID', modified_by = '$userId'  
                Where first_name = '$first_name' AND last_name = '$last_name'";
    } else {
      $sql = "INSERT INTO bibl_item_creator (first_name, last_name, ORCID, callNumber, creatorType, added_by) 
                    Values ('$first_name', '$last_name', '$ORCID', '$callNumber', '$creatorType', '$userId')";
    }

    if (mysqli_query($conn, $sql)) {
      return 'success';
    }
  } catch (Exception $e) {
    return 'Error: ' . $e->getMessage();
  }
}

?>