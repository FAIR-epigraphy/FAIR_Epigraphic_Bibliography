<?php
require '../config.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if (isset($postdata)) {
    $method = trim($request->method);
    if ($method == 'addRole') {
        echo json_encode(addRole($request, $conn));
    } else if ($method == 'deleteRole') {
        $roleId = trim($request->roleId);
        echo json_encode(deleteRole($roleId, $conn));
    }
} else {
    http_response_code(404);
}

function addRole($request, $conn)
{
    try {
        $role_name = trim($request->role_name);

        if (count(isRolenameExist($role_name, $conn)) > 0) {
            return 'Error: role name is already exist.';
        }

        $sql = "INSERT INTO bibl_role (role_name) Values ('$role_name')";
        //return $sql;

        if (mysqli_query($conn, $sql)) {
            return 'success';
        }
    } catch (Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
}

function deleteRole($roleId, $conn)
{
    try {
        // $sql = "DELETE bibl_role, bibl_user_role, bibl_user_info FROM bibl_role
        //             LEFT JOIN bibl_user_role ON bibl_role.id = bibl_user_role.role_id
        //             LEFT JOIN bibl_user_info ON bibl_user_role.user_id = bibl_user_info.id
        //             WHERE bibl_role.id = '$roleId';";

        if (count(isUerRoleExists($roleId, $conn)) > 0) {
            return 'Error: If you delete the role then it also deletes users. Please contact with Imran Asif.';
        }

        $sql = "DELETE FROM bibl_role WHERE id = '$roleId';";
        if (mysqli_query($conn, $sql)) {
            return 'success';
        }

    } catch (Exception $e) {
        return $e->getMessage();
    }
}

function isUerRoleExists($roleId, $conn)
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

function isRolenameExist($role_name, $conn)
{
    $data = array();
    $sql = "SELECT * FROM bibl_role WHERE role_name = '$role_name'";
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