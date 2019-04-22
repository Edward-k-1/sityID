<?php

namespace app\api\modules\v1_1c\controllers;

use yii\console\Exception;
use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use app\api\modules\v1_1c\models\Vehicle;

class VehicleController extends ActiveController
{
    public $modelClass = 'app\api\modules\v1_1c\models\Vehicle';

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
                                    $vehicle = Vehicle::getRecordBy1CId($item->sync_1c_id);
                                }
                                else{
                                    $result[$k]['error'] = "No such key sync_1c_id";
                                }

                            } catch (Exception $e) {
                                return $e->getMessage();
                            }
                            if (empty($vehicle)) {
                                $resultAdd = Vehicle::addRecord($item);
                                $result[$k]['result'] = $resultAdd;
                                $result[$k]['requestType'] = 'create';

                            } else {
                                $resultUpdate = Vehicle::updateRecord($item, $vehicle);
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
                                    $vehicle = Vehicle::getRecordBy1CId($item->sync_1c_id);
                                }
                                else{
                                    $result[$k]['error'] = "No such key sync_1c_id";
                                    return $result;
                                }

                            } catch (Exception $e) {
                                return $e->getMessage();
                            }
                            if (empty($vehicle)) {
                                $result[$k]['error'] = "No such record in Vehicle DataBase";

                            } else {
                                $resultDelete = Vehicle::deleteRecord($vehicle->getPrimaryKey());
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
