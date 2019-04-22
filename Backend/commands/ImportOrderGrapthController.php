<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */


namespace app\commands;

use \app\api\v1\models\Workers;
use \app\api\v1\models\WorkersGraphs;


//use yii\base\Exception;
use yii\console\Controller;
use yii\helpers\Console;
use \app\api\v1\models\GraphsOrders;

/**
 * This command echoes the first argument that you have entered.
 *
 * This command is provided as an example for you to learn how to create console commands.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class ImportOrderGrapthController extends Controller
{
    /**
     * This command echoes what you have entered as the message.
     * @param string $message the message to be echoed.
     */
    private $daemon_runed = true;

    public function actionIndex($message = 'hello world')
    {
        $flag_rob_is_loaded = false;


        $url = "http://10.11.1.114/asdu/api/schedule/";
        for ($i = 1; $i < 10; $i++) {
            try {
                $response = \Httpful\Request::get($url . $i)->send();
                if ($response->code == 200 && is_array($response->body)) {
                    \Yii::$app->db->createCommand("Delete from " . GraphsOrders::tableName() . " where day_type=$i")->execute();
                    $array = $response->body;
                    foreach ($array as $item) {
                        try {
                            GraphsOrders::createAndFillModel(json_decode(json_encode($item), true));
                        } catch (\Exception $ex) {
                            echo " Foreach  error $i: " . $ex->getMessage() . "\n";
                        }
                    }
                }
            } catch (\Httpful\Exception\ConnectionErrorException $ex) {
                echo "Error http://10.11.1.114/DayOrdersTemp/api/Dotecon/$i" . $ex->getMessage() . "\n";
            }
        }
    }




}
