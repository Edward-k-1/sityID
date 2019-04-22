<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */


namespace app\commands;

use app\api\v1\models\OrdersSync;
use \app\api\v1\models\Workers;
use \app\api\v1\models\WorkersGraphs;


//use yii\base\Exception;
use yii\console\Controller;
use yii\db\Query;
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
class ExportDaemonController extends Controller
{
    /**
     * This command echoes what you have entered as the message.
     * @param string $message the message to be echoed.
     */
    private $daemon_runed = true;

    public function actionIndex($message = 'hello world')
    {
        while($this->daemon_runed)
        {
            $query = new Query();
            try {
                $result = OrdersSync::find()->all();
                if (count($result)>0) {

                    foreach ($result as &$item) {
                        echo $item->orders_id . "\n";
                        echo $item->id . "\n";
                        /*
                         * Generate json
                         * **/

                    }
                    $response = true;
                    if ($response == true) {
                        foreach ($result as &$item)
                        {
                            $item->delete();
                        }

                    }
                }
            }
            catch(\Exception $ex)
            {
                echo $ex->getMessage()."\n";

            }
            sleep(5);
            echo "next iteration\n";

        }



    }


}
