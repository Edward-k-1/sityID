<?php
/**
 * Created by PhpStorm.
 * User: walex
 * Date: 14.03.17
 * Time: 16:43
 */

$ips = file('remove_list.txt');
$ips = json_decode(json_encode($ips));


$removed = [];
$log = [];
$c = 1;
foreach ($ips as $ip) {
    $r = exec('ipfw add 00013 deny ip from '.$ip.' to any');
    sleep(1);
    $log[] = $r;
    $removed[] = $ip.'//'.time();
    $c++;
}

file_put_contents('removed_list.txt', implode('--', $removed));
file_put_contents('removed_log.txt', implode('--', $log));
print 'Додано: '.$c.' правил на заборону доступу';