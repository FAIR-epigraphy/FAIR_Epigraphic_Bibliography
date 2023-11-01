<?php

require '../config.php';
require '../mail.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if (isset($postdata)) {
  $method = trim($request->method);
  if ($method == 'getUserInfoById') {
    $userId = trim($request->userId);
    echo json_encode(getUserInfoById($userId, $conn));
  } else if ($method == 'getAllUsers') {
    echo json_encode(getAllUsers($conn));
  } else if ($method == 'getAllRoles') {
    echo json_encode(getAllRoles($conn));
  } else if ($method == 'addUser') {
    echo json_encode(addUser($request, $conn));
  }else if($method == 'deleteUser'){
    $userId = trim($request->userId);
    echo json_encode(deleteUser($userId, $conn));
  }
} else {
  http_response_code(404);
}
////////////////////////////////////////////////////////////
///////////////// METHODS
function getUserInfoById($userId, $conn)
{
  try {
    $data = array();
    $sql = "SELECT usr.id, usr.username, r.role_name from bibl_user_info usr
                  INNER JOIN bibl_user_role ur on usr.id = ur.user_id
                  INNER JOIN bibl_role r on ur.role_id = r.id
                WHERE usr.id=$userId";

    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
      // output data of each row
      while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
      }
      return $data;
    } else {
      return null;
    }
  } catch (Exception $e) {
    return $e->getMessage();
  }
}

function getAllUsers($conn)
{
  try {
    $data = array();
    $sql = "SELECT usr.id, usr.username, r.role_name from bibl_user_info usr
                  INNER JOIN bibl_user_role ur on usr.id = ur.user_id
                  INNER JOIN bibl_role r on ur.role_id = r.id
              WHERE r.role_name <> 'Admin'";

    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
      // output data of each row
      while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
      }
      return $data;
    } else {
      return null;
    }
  } catch (Exception $e) {
    return $e->getMessage();
  }
}
////////////////////////////////////////////
function getAllRoles($conn)
{
  try {
    $data = array();
    $sql = "SELECT * FROM bibl_role WHERE role_name <> 'Admin'";

    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
      // output data of each row
      while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
      }
      return $data;
    } else {
      return null;
    }
  } catch (Exception $e) {
    return $e->getMessage();
  }
}
///////////////////////////////////////////
function addUser($request, $conn)
{
  try {
    $userName = trim($request->userName);
    $roleId = trim($request->roleId);
    $password = generate_password();

    if(count(isUsernameExist($userName, $conn)) > 0)
    {
        return 'Error: username is already exist.';
    }
    
    $sql = "INSERT INTO bibl_user_info (username, user_password) Values ('$userName', SHA1('$password'))";
    //return $sql;

    if(mysqli_query($conn, $sql)){
      $last_id = mysqli_insert_id($conn);
      $sql = "INSERT INTO bibl_user_role (user_id, role_id) VALUES ('$last_id', '$roleId')";
      if(mysqli_query($conn, $sql)){
        return sendEmailToUser($userName, $password);
        //return 'success';
      }
    }
  } catch (Exception $e) {
    return $e->getMessage();
  }
}

function deleteUser($userId, $conn)
{
  try {
    //$sql = "DELETE FROM bibl_user_info WHERE id = '$userId'; DELETE FROM bibl_user_role WHERE user_id = '$userId';";
    $sql = "DELETE bibl_user_info, bibl_user_role 
              FROM bibl_user_info, bibl_user_role 
              WHERE bibl_user_info.id = '$userId' AND bibl_user_info.id = bibl_user_role.user_id";

    if(mysqli_query($conn, $sql)){
        return 'success';
    }
  } catch (Exception $e) {
    return $e->getMessage();
  }
}
////////////////////////////////////////////
function isUsernameExist($userName ,$conn)
{
  $data = array();
  $sql = "SELECT * FROM bibl_user_info WHERE username = '$userName'";
  $result = mysqli_query($conn, $sql);

  if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while ($row = mysqli_fetch_assoc($result)) {
      $data[] = $row;
    }
    return $data;
  } else {
    return $data;
  }
}

function generate_password($length = 20){
  $chars =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.
            '0123456789`-=~!@#$%^&*()_+,./<>?;:[]{}\|';

  $str = '';
  $max = strlen($chars) - 1;

  for ($i=0; $i < $length; $i++)
    $str .= $chars[random_int(0, $max)];

  return $str;
}

function sendEmailToUser($email, $password)
{
  return SendEmail($email, $password);
}
?>