<?php
require '../config.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if (isset($postdata)) {
    $method = trim($request->method);
    if ($method == 'addCategory') {
        echo json_encode(addCategory($request, $conn));
    } else if ($method == 'deleteCategory') {
        $catId = trim($request->catId);
        echo json_encode(deleteCategory($catId, $conn));
    }else if($method == 'getAllCategories')
    {
        echo json_encode(getAllCategories($conn));
    }
} else {
    http_response_code(404);
}

function getAllCategories($conn)
{
  try {
    $data = array();
    $sql = "SELECT * FROM bibl_item_category";

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
    return 'Error: ' . $e->getMessage();
  }
}
function addCategory($request, $conn)
{
    try {
        $cat_name = trim($request->cat_name);

        if (count(isCatagoryExist($cat_name, $conn)) > 0) {
            return 'Error: category name is already exist.';
        }

        $sql = "INSERT INTO bibl_item_category (cat_name) Values ('$cat_name')";
        //return $sql;

        if (mysqli_query($conn, $sql)) {
            return 'success';
        }
    } catch (Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
}

function deleteCategory($catId, $conn)
{
    try {
        // $sql = "DELETE bibl_role, bibl_user_role, bibl_user_info FROM bibl_role
        //             LEFT JOIN bibl_user_role ON bibl_role.id = bibl_user_role.role_id
        //             LEFT JOIN bibl_user_info ON bibl_user_role.user_id = bibl_user_info.id
        //             WHERE bibl_role.id = '$roleId';";

        // if (count(isUerRoleExists($catId, $conn)) > 0) {
        //     return 'Error: If you delete the role then it also deletes users. Please contact with Imran Asif.';
        // }

        $sql = "DELETE FROM bibl_item_category WHERE id = '$catId';";
        if (mysqli_query($conn, $sql)) {
            return 'success';
        }

    } catch (Exception $e) {
        return $e->getMessage();
    }
}

function isCategoryChildExists($roleId, $conn)
{
    $data = array();
    $sql = "SELECT * FROM bibl_user_role WHERE role_id = '$roleId'";
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

function isCatagoryExist($cat_name, $conn)
{
    $data = array();
    $sql = "SELECT * FROM bibl_item_category WHERE cat_name = '$cat_name'";
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
?>