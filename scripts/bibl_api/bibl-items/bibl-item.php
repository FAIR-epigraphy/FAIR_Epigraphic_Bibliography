<?php
require '../config.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if (isset($postdata)) {
  $method = trim($request->method);
  if ($method == 'addBiblioItemLink') {
    echo json_encode(addBiblioItemLink($request, $conn));
  } else if ($method == 'getAllBiblioItemLinks') {
    echo json_encode(getAllBiblioItemLinks($request, $conn));
  } else if ($method == 'addBiblioParentChildItem') {
    echo json_encode(addBiblioParentChildItem($request, $conn));
  } else if ($method == 'getAllBiblioParentChildItems') {
    echo json_encode(getAllBiblioParentChildItems($request, $conn));
  } else if ($method == 'getBiblioParentChildItemsByCallNo') {
    echo json_encode(getBiblioParentChildItemsByCallNo($request, $conn));
  } else if ($method == 'UpdateChildCategory') {
    echo json_encode(UpdateChildCategory($request, $conn));
  } else if ($method == 'deleteChildItem') {
    echo json_encode(deleteChildItem($request, $conn));
  } else if ($method == 'addBiblioItemParent') {
    echo json_encode(addBiblioItemParent($request, $conn));
  } else if ($method == 'getAllItemResourceTypes') {
    echo json_encode(getAllItemResourceTypes($request, $conn));
  } else if ($method == 'UpdateItemResourceTypeByCallNumber') {
    echo json_encode(UpdateItemResourceTypeByCallNumber($request, $conn));
  } else if ($method == 'getItemByCallNumber') {
    echo json_encode(getItemByCallNumber($request, $conn));
  } else if ($method == 'addItemAbbr') {
    echo json_encode(addItemAbbr($request, $conn));
  } else if ($method == 'getItemAbbr') {
    echo json_encode(getItemAbbr($request, $conn));
  } else if ($method == 'addAlternateTitle') {
    echo json_encode(addAlternateTitle($request, $conn));
  } else if ($method == 'getAlternateTitle') {
    echo json_encode(getAlternateTitle($request, $conn));
  } else if ($method == 'getAllAlternateTitle') {
    echo json_encode(getAllAlternateTitle($request, $conn));
  }
} else {
  http_response_code(404);
}

function getAllBiblioItemLinks($request, $conn)
{
  try {
    $data = array();
    $callNumber = trim($request->callNumber);

    $sql = "SELECT * FROM bibl_item_links Where callNumber = '$callNumber'";

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
function addBiblioItemLink($request, $conn)
{
  try {
    $callNumber = trim($request->callNumber);
    $link = trim($request->link);
    $userId = trim($request->userId);

    //return getVIAFByCreator($request, $conn);
    // if (count(getVIAFByCreator($request, $conn)) > 0) {
    //     return 'Error: Already exist.';
    // }
    //return $frist_name . $last_name . $creatorType . $callNumber . $VIAF;

    $sql = "INSERT INTO bibl_item_links (callNumber, link, added_by) Values ('$callNumber', '$link', '$userId')";
    //return $sql;

    if (mysqli_query($conn, $sql)) {
      return 'success';
    }
  } catch (Exception $e) {
    return 'Error: ' . $e->getMessage();
  }
}

function addBiblioParentChildItem($request, $conn)
{
  try {
    $parent_callNumber = trim($request->parent_callNumber);
    $child_callNumber = trim($request->child_callNumber);
    //$cat_id = trim($request->cat_id);
    $added_by = trim($request->added_by);
    $parent_zotero_item_key = trim($request->parent_zotero_item_key);
    $child_zotero_item_key = trim($request->child_zotero_item_key);

    if(isParenChildRelExists($request, $conn))
    {
      return 'success';
    }

    $sql = "INSERT INTO bibl_parent_child_items (parent_callNumber, child_callNumber, added_by, parent_zotero_item_key, child_zotero_item_key)
              Values ('$parent_callNumber', '$child_callNumber', '$added_by', '$parent_zotero_item_key', '$child_zotero_item_key')";

    if (mysqli_query($conn, $sql)) {
      return 'success';
    }
  } catch (Exception $e) {
    return 'Error: ' . $e->getMessage();
  }
}

function isParenChildRelExists($request, $conn)
{
  try {
    $parent_callNumber = trim($request->parent_callNumber);
    $child_callNumber = trim($request->child_callNumber);

    $sql = "SELECT *
              FROM bibl_parent_child_items 
              WHERE parent_callNumber = '$parent_callNumber' and child_callNumber = '$child_callNumber'";

    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
      // output data of each row
      return true;
    }
    return false;
  } catch (Exception $e) {
    return 'Error: ' . $e->getMessage();
  }
}

function UpdateChildCategory($request, $conn)
{
  try {
    $parent_callNumber = trim($request->parent_callNumber);
    $child_callNumber = trim($request->child_callNumber);
    $cat_id = trim($request->cat_id);
    $userId = trim($request->userId);

    $sql = "UPDATE bibl_parent_child_items SET cat_Id = '$cat_id', modified_by = '$userId'  
                WHERE parent_callNumber = '$parent_callNumber' and child_callNumber = '$child_callNumber';";

    if (mysqli_query($conn, $sql)) {
      return 'success';
    }
  } catch (Exception $e) {
    return 'Error: ' . $e->getMessage();
  }
}

function deleteChildItem($request, $conn)
{
  try {
    $parent_callNumber = trim($request->parent_callNumber);
    $child_callNumber = trim($request->child_callNumber);

    $request->callNumber = $child_callNumber;

    if (count(getBiblioParentChildItemsByCallNo($request, $conn)) > 0) {
      return 'Error: This item can not be deleted. It is parent.';
    }

    $sql = "DELETE FROM  bibl_parent_child_items
                WHERE parent_callNumber = '$parent_callNumber' and child_callNumber = '$child_callNumber';";

    if (mysqli_query($conn, $sql)) {
      return 'success';
    }
  } catch (Exception $e) {
    return 'Error: ' . $e->getMessage();
  }
}

function addBiblioItemParent($request, $conn)
{
  try {
    $parent_callNumber = trim($request->callNumber);
    $parent_zotero_item_key = trim($request->zotero_item_key);
    $added_by = trim($request->added_by);

    $sql = "INSERT INTO bibl_parent_child_items (parent_callNumber, added_by, parent_zotero_item_key)
              Values ('$parent_callNumber', '$added_by', '$parent_zotero_item_key')";

    if (mysqli_query($conn, $sql)) {
      return 'success';
    }
  } catch (Exception $e) {
    return 'Error: ' . $e->getMessage();
  }
}

function addItemAbbr($request, $conn)
{
  try {
    $abbr = trim($request->itemAbbr->abbr);
    $source = trim($request->itemAbbr->source);
    $callNumber = trim($request->itemAbbr->callNumber);
    $userId = trim($request->userId);

    $sql = "INSERT INTO bibl_item_abbr (callNumber, abbr, source, added_by)
              Values ('$callNumber', '$abbr', '$source', '$userId')";

    if (mysqli_query($conn, $sql)) {
      return 'success';
    }
  } catch (Exception $e) {
    return 'Error: ' . $e->getMessage();
  }
}

function getItemAbbr($request, $conn)
{
  try {
    $data = array();
    $callNumber = trim($request->callNumber);
    $abbr = trim($request->abbr);

    $sql = "SELECT * from bibl_AIEGL_Abbreviations aiegl
                INNER JOIN bibl_AIEGL_SEG_Abbr aieg_seg ON aiegl.id = aieg_seg.aiegl_id 
                INNER JOIN bibl_SEG_Abbreviations seg ON seg.id = aieg_seg.seg_id
                WHERE aiegl.abbreviation = '$abbr'";

    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
      // output data of each row
      while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
      }
    }

    $sql = "SELECT * FROM bibl_item_abbr item
              WHERE callNumber = '$callNumber';";

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

function getAllBiblioParentChildItems($request, $conn)
{
  try {
    $data = array();

    $sql = "SELECT parent_callNumber, child_callNumber, cat.cat_name 
              FROM bibl_parent_child_items pcRel
              LEFT JOIN bibl_item_category cat on pcRel.cat_id = cat.id";

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
function getBiblioParentChildItemsByCallNo($request, $conn)
{
  try {
    $data = array();
    $callNumber = trim($request->callNumber);

    $sql = "SELECT parent_callNumber, child_callNumber, cat.cat_name, pcRel.cat_id
              FROM bibl_parent_child_items pcRel
              LEFT JOIN bibl_item_category cat on pcRel.cat_id = cat.id
              WHERE parent_callNumber = '$callNumber'";

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
function getAllItemResourceTypes($request, $conn)
{
  try {
    $data = array();

    $sql = "SELECT * FROM bibl_resourceType
              ORDER BY resourceTypeGeneral ASC;";

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

function getItemByCallNumber($request, $conn)
{
  try {
    $data = array();
    $callNumber = trim($request->callNumber);

    $sql = "SELECT * FROM bibl_item item
              INNER JOIN bibl_resourceType rt on item.resourceTypeId = rt.id
              WHERE callNumber = '$callNumber';";

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

function UpdateItemResourceTypeByCallNumber($request, $conn)
{
  try {
    $callNumber = trim($request->callNumber);
    $resourceTypeId = trim($request->resourceTypeId);
    $userId = trim($request->userId);

    $sql = '';
    if (count(getItemByCallNumber($request, $conn)) > 0) {
      $sql = "UPDATE bibl_item SET resourceTypeId = '$resourceTypeId', modified_by='$userId'  
                WHERE callNumber = '$callNumber';";
    } else {
      $sql = "INSERT INTO bibl_item (callNumber, resourceTypeId, added_by) 
                VALUES ('$callNumber', '$resourceTypeId', '$userId')";
    }

    if (mysqli_query($conn, $sql)) {
      return 'success';
    }
  } catch (Exception $e) {
    return 'Error: ' . $e->getMessage();
  }
}

function addAlternateTitle($request, $conn)
{
  try {
    $altTitle = trim($request->itemTitle->altTitle);
    $lang = trim($request->itemTitle->lang);
    $langKey = trim($request->itemTitle->langKey);
    $callNumber = trim($request->itemTitle->callNumber);
    $userId = trim($request->userId);

    $sql = "INSERT INTO bibl_item_title (callNumber, title, lang, lang_key, added_by)
              Values ('$callNumber', '$altTitle', '$lang', '$langKey', '$userId')";

    if (mysqli_query($conn, $sql)) {
      return 'success';
    }
  } catch (Exception $e) {
    return 'Error: ' . $e->getMessage();
  }
}

function getAlternateTitle($request, $conn)
{
  try {
    $data = array();

    $callNumber = trim($request->callNumber);

    $sql = "SELECT * FROM bibl_item_title WHERE callNumber = '$callNumber'";
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

function getAllAlternateTitle($request, $conn)
{
  try {
    $data = array();

    $sql = "SELECT * FROM bibl_item_title";
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
?>