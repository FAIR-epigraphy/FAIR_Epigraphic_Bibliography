<?php

require '../config.php';

//$user_obj = json_decode($_POST['user_info']);

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);


//print_r($user_obj);
 if(isset($postdata))
 {
    
     $data = array();
     $pwd = trim($request->password);
     $username = trim($request->username);

     //$hash_pass = password_hash($pwd, PASSWORD_DEFAULT);

     $sql = "SELECT usr.id, usr.username, r.role_name from bibl_user_info usr
 	    INNER JOIN bibl_user_role ur on usr.id = ur.user_id
 	    INNER JOIN bibl_role r on ur.role_id = r.id
         WHERE username='$username' and user_password = SHA1('$pwd')";

    //echo $hash_pass;
    //echo "create query <br>";
    $result = mysqli_query($conn, $sql);
    //echo "query executed <br>";
    if (mysqli_num_rows($result) > 0) {
        // output data of each row
        while($row = mysqli_fetch_assoc($result)) {
        // echo "id: " . $row["id"] . "<br>";
            $data[]=$row;
        }
        echo json_encode($data);
    }
    else
    {
        echo json_encode(null);
    } 
 }
 else
 {
     http_response_code(404);
 }

?>
