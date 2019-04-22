<?php

namespace app\api\modules\v1_1c\controllers;

use yii\console\Exception;
use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use app\api\modules\v1_1c\models\OrdersCalendar;

class OrdersCalendarController extends ActiveController
{
    public $modelClass = 'app\api\modules\v1_1c\models\OrdersCalendar';

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::className(),
        ];

        return $behaviors;
    }

    public function actionSync(){
        $requestString = '';
        foreach ($_REQUEST as $item){
            $requestString.= $item;
        }
        /*return $_REQUEST;
        if (isset($_REQUEST['params'])){*/
            $result = array(
                'success' => true
            );
            $dataFrom1C = json_decode($requestString);
            if(isset($dataFrom1C->requestType)) {
                $k=0;
                switch ($dataFrom1C->requestType) {
                    case 'update': {
                        foreach ($dataFrom1C->data as $item) {
                            $k++;
                            try {
                                if (isset($item->sync_1c_id)) {
                                    $orderCalendar = OrdersCalendar::getRecordBy1CId($item->sync_1c_id);
                                }
                                else{
                                    $result[$k]['error'] = "No such key sync_1c_id";
                                }

                            } catch (Exception $e) {
                                return $e->getMessage();
                            }
                            if (empty($orderCalendar)) {
                                $resultAdd = OrdersCalendar::addRecord($item);
                                $result[$k]['result'] = $resultAdd;
                                $result[$k]['requestType'] = 'create';

                            } else {
                                $resultUpdate = OrdersCalendar::updateRecord($item, $orderCalendar);
                                $result[$k]['result'] = $resultUpdate;
                                $result[$k]['requestType'] = 'update';
                            }
                        }
                        break;
                    }
                    case 'delete': {
                        foreach ($dataFrom1C->data as $item) {
                            $k++;
                            $result[$k]['requestType'] = 'delete';
                            try {
                                if (isset($item->sync_1c_id)) {
                                    $orderCalendar = OrdersCalendar::getRecordBy1CId($item->sync_1c_id);
                                }
                                else{
                                    $result[$k]['error'] = "No such key sync_1c_id";
                                    return $result;
                                }

                            } catch (Exception $e) {
                                return $e->getMessage();
                            }
                            if (empty($orderCalendar)) {
                                $result[$k]['error'] = "No such record in DataBase";

                            } else {
                                $resultDelete = OrdersCalendar::deleteRecord($orderCalendar->getPrimaryKey());
                                $result[$k]['result'] = $resultDelete;
                            }
                        }
                        break;
                    }
                    default: {
                        $result = array(
                            'success' => false,
                            'error' => 'Not valid requestType'
                        );
                    }
                }
            }
            else{
                $result = array(
                    'success' => false,
                    'error' => 'Not valid JSON'
                );
            }
        /*}
        else{
            $result = array(
                'success' => false,
                'error' => 'Not exist params'
            );
        }*/

        return $result;
    }
}
