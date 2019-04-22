<?php
/**
 * Created by PhpStorm.
 * User: walex
 * Date: 24.01.17
 * Time: 9:52
 */

//function get_bort_data($sn) {
////    mysqli_connect('193.109.144.51', 'maklutsk', 'ShCheRazMinayu49')
//}
//
//function connect_db() {
//    $s = mysqli_connect('193.109.144.25', 'mak_atp', '8wZY5MGMHu7o');
//    mysqli_select_db('MakAtp');
//}
//
//if($_POST['lat'] && $_POST['lon']) {
//    connect_db();
//    mysqli_query("INSERT INTO tbl_meters VALUES ('', '".$_POST['lat']."', '".$_POST['lon']."');");
//}

//if($_GET['lat'] && $_GET['lon']) {
//    $s = mysqli_connect('193.109.144.25', 'mak_atp', '8wZY5MGMHu7o');
//    mysqli_select_db($s, 'MakAtp');
//    mysqli_query($s, "INSERT INTO tbl_meters (lat,lon) VALUES ('".$_GET['lat']."', '".$_GET['lon']."');");
//}

if($_GET['sn']) {
    $s = mysqli_connect('193.109.144.51', 'maklutsk', 'ShCheRazMinayu49');
    mysqli_select_db($s, 'MakLutsk');
    $r = mysqli_fetch_array(mysqli_query($s, "SELECT * FROM borts WHERE state_number LIKE '%".$_GET['sn']."%'"));
//    print_r($r);

    $d = date("Y-m-d");
//    echo $d;
    $r2 = mysqli_fetch_array(mysqli_query($s, "SELECT graphs_id, order_statuses_id FROM orders WHERE borts_id = '".$r['id']."' AND `from` = '".$d."'"));
//    $r2 = mysqli_query($s, "SELECT graphs_id FROM orders WHERE 'borts_id' = '".$r['id']."' AND 'from' = '".$d."'");
//    print_r($r2);
    $r3 = mysqli_fetch_array(mysqli_query($s, "SELECT graphs.name, routes.name as route_name FROM graphs JOIN routes ON graphs.routes_id = routes.id WHERE graphs.id = '".$r2['graphs_id']."'"));


    $response = [
        'id' => $r['id'],
        'bn' => $r['number'],
        'm' => $r3['route_name'],
        'g' => $r3['name'],
        'l' => $r2['order_statuses_id']
    ];
//    echo '<h2>Date: '.$d.'</h2>';
//    echo '<h2>ID: '.$r['id'].'</h2>';
//    echo '<h2>BN: '.$r['number'].'</h2>';
//    echo '<h2>M: '.$r3['route_name'].'</h2>';
//    echo '<h2>G: '.$r3['name'].'</h2>';
//    echo '<h2>L: '.$r['status'].'</h2>';
    echo json_encode($response);
}