<?php

namespace app\api\modules\v1_1c\models;

use Faker\Provider\DateTime;
use Yii;
use yii\base\NotSupportedException;
use yii\behaviors\BlameableBehavior;
use yii\behaviors\TimestampBehavior;
use \yii\web\IdentityInterface;
use yii\db\Expression;

class Vehicle extends \yii\db\ActiveRecord implements IdentityInterface
{
    public $id;
    public $username;
    public $password;
    public $authKey;
    public $accessToken;
    /***
    * Return table name.
         *
         * @return {string} Data Base table name.
    */
    public static function tableName()
    {
        return '{{%vehicles}}';
    }
    /**
     * @inheritdoc
     */
    public static function primaryKey()
    {
        return ['id'];
    }
    /**
     * Define rules for validation
     */
    public function rules()
    {
        return [
            [['state_number', 'created_at', 'updated_at'], 'required']
        ];
    }

    /**
     * @inheritdoc
     */
    public static function findIdentity($id)
    {
        return isset(self::$vehicles[$id]) ? new static(self::$vehicles[$id]) : null;
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        foreach (self::$vehicles as $vehicle) {
            if ($vehicle['accessToken'] === $token) {
                return new static($vehicle);
            }
        }

        return null;
    }
    /**
     * @inheritdoc
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @inheritdoc
     */
    public function getAuthKey()
    {
        return $this->authKey;
    }

    /**
     * @inheritdoc
     */
    public function validateAuthKey($authKey)
    {
        return $this->authKey === $authKey;
    }

    /**
     *
     * @return {object} Vehicle data.
     */
    public function getAll() {
        $result = Vehicle::find()
            ->orderBy('id')
            ->all();
        if (empty($result)){
            return null;
        }
        else{
            return $result;
        }
    }

    /*public function behaviors()
    {
        return [
            [
                'class' => TimestampBehavior::className(),
                'createdAtAttribute' => 'created_at,updated_at',
                'updatedAtAttribute' => 'updated_at',
                'value' => new Expression('NOW()'),
            ],
        ];
    }*/

    /**
     *
     * @param integer $idFrom1C
     * @return {object} One Vehicle by 1c_sync_id.
     */
    public function getRecordBy1CId($idFrom1C) {
        $result = Vehicle::find()
            ->where(['sync_1c_id' => $idFrom1C])
            ->one();
        if (empty($result)){
            return null;
        }
        else{
            return $result;
        }
    }

    /**
     *
     * @param array $vehicle
     * @return {object} .
     */
    //TODO change add time to behaviors, user_id add, fix bug with validation
    public function addRecord($vehicle) {
        if(isset($vehicle->parks_id)){
            $park = Park::getRecordBy1CId($vehicle->parks_id);
            if(isset($park)){
                $parkID = $park->getPrimaryKey();
            }
            else{
                $parkID = NULL;
                //return array("error"=> "No such park $vehicle->parks_id");
            }
        }
        else{
            $parkID = NULL;
        }

        if(isset($vehicle->vehicle_models_id)){
            $vehicleModel = VehicleModel::getRecordBy1CId($vehicle->vehicle_models_id);
            if(isset($vehicleModel)){
                $vehicleModelID = $vehicleModel->getPrimaryKey();
            }
            else{
                $vehicleModelID = NULL;
                //return array("error"=> "No such vehicle Model $vehicle->vehicle_models_id");
            }
        }
        else{
            $vehicleModelID = NULL;
        }

        if(isset($vehicle->vehicle_models_views_id)){
            $vehicleModelView = VehicleModelView::getRecordBy1CId($vehicle->vehicle_models_views_id);
            if(isset($vehicleModelView)){
                $vehicleModelViewID = $vehicleModelView->getPrimaryKey();
            }
            else{
                $vehicleModelViewID = NULL;
                //return array("error"=> "No such Vehicle Model View $vehicle->vehicle_models_views_id");
            }
        }
        else{
            $vehicleModelViewID = NULL;
        }

        if(isset($vehicle->vehicle_models_types_id)){
            $vehicleModelType = VehicleModelType::getRecordBy1CId($vehicle->vehicle_models_types_id);
            if(isset($vehicleModelType)){
                $vehicleModelTypeID = $vehicleModelType->getPrimaryKey();
            }
            else{
                $vehicleModelType = VehicleModelType::getRecordBy1CId("01505");
                if(isset($vehicleModelType)){
                    $vehicleModelTypeID = $vehicleModelType->getPrimaryKey();
                }
                else{
                    $vehicleModelTypeID = NULL;
                    //return array("error"=> "No such Vehicle Model Type $vehicle->vehicle_models_types_id");
                }
            }
        }
        else{
            $vehicleModelTypeID = NULL;
        }

        $newVehicle = new Vehicle();
        $newVehicle->state_number = isset($vehicle->state_number) ? $vehicle->state_number : NULL;
        $newVehicle->garage_number = isset($vehicle->garage_number) ? $vehicle->garage_number : NULL;
        $newVehicle->board_number = isset($vehicle->board_number) ? $vehicle->board_number : NULL;
        $newVehicle->sync_1c_id = isset($vehicle->sync_1c_id) ? $vehicle->sync_1c_id : NULL;
        $newVehicle->vehicle_models_id = $vehicleModelID;
        $newVehicle->carriers_id = 1;
        $newVehicle->vehicle_models_views_id = $vehicleModelViewID;
        $newVehicle->vehicle_models_types_id = $vehicleModelTypeID;
        $newVehicle->parks_id = $parkID;
        $newVehicle->author_id = 1;
        $newVehicle->updater_id = 1;
        $newVehicle->created_at = time();
        $newVehicle->updated_at = time();
        $newVehicle->save(false);
        if (empty($newVehicle)){
            return null;
        }
        else{
            return $newVehicle->sync_1c_id;
        }
    }

    /**
     *
     * @param array $vehicle
     * @param array $updateVehicle
     * @return {object} .
     */
    //TODO change update time to behaviors, user_id update, fix bug with validation
    public function updateRecord($vehicle, $updateVehicle) {
        if(isset($vehicle->parks_id)){
            $park = Park::getRecordBy1CId($vehicle->parks_id);
            if(isset($park)){
                $parkID = $park->getPrimaryKey();
            }
            else{
                $parkID = NULL;
                //return array("error"=> "No such parks_id $vehicle->parks_id");
            }
            $updateVehicle->parks_id = $parkID;
        }

        if(isset($vehicle->vehicle_models_id)){
            $vehicleModel = VehicleModel::getRecordBy1CId($vehicle->vehicle_models_id);
            if(isset($vehicleModel)){
                $vehicleModelID = $vehicleModel->getPrimaryKey();
            }
            else{
                $vehicleModelID = NULL;
                //return array("error"=> "No such vehicle_models_id $vehicle->vehicle_models_id");
            }
            $updateVehicle->vehicle_models_id = $vehicleModelID;
        }

        if(isset($vehicle->vehicle_models_views_id)){
            $vehicleModelView = VehicleModelView::getRecordBy1CId($vehicle->vehicle_models_views_id);
            if(isset($vehicleModelView)){
                $vehicleModelViewID = $vehicleModelView->getPrimaryKey();
            }
            else{
                $vehicleModelViewID = NULL;
                //return array("error"=> "No such vehicle_models_views_id $vehicle->vehicle_models_views_id");
            }
            $updateVehicle->vehicle_models_views_id = $vehicleModelViewID;
        }

        if(isset($vehicle->vehicle_models_types_id)){
            $vehicleModelType = VehicleModelType::getRecordBy1CId($vehicle->vehicle_models_types_id);
            if(isset($vehicleModelType)){
                $vehicleModelTypeID = $vehicleModelType->getPrimaryKey();
            }
            else{
                $vehicleModelType = VehicleModelType::getRecordBy1CId("01505");
                if(isset($vehicleModelType)){
                    $vehicleModelTypeID = $vehicleModelType->getPrimaryKey();
                }
                else{
                    $vehicleModelTypeID = NULL;
                    //return array("error"=> "No such vehicle_models_types_id $vehicle->vehicle_models_types_id");
                }
            }
            $updateVehicle->vehicle_models_types_id = $vehicleModelTypeID;
        }

        $updateVehicle->state_number = isset($vehicle->state_number) ? $vehicle->state_number : NULL;
        $updateVehicle->garage_number = isset($vehicle->garage_number) ? $vehicle->garage_number : NULL;
        $updateVehicle->board_number = isset($vehicle->board_number) ? $vehicle->board_number : NULL;
        $updateVehicle->sync_1c_id = isset($vehicle->sync_1c_id) ? $vehicle->sync_1c_id : NULL;
        $updateVehicle->carriers_id = 1;
        $updateVehicle->updated_at = time();
        $updateVehicle->save(false);
        if (empty($updateVehicle)){
            return null;
        }
        else{
            return $updateVehicle->sync_1c_id;
        }
    }

    /**
     *
     * @param integer $vehicleId
     * return {object}
     */

    public function deleteRecord($vehicleId){
        $vehicle = Vehicle::findOne($vehicleId);
        try{
            $sync_1c_id = $vehicle->sync_1c_id;
            $vehicle->delete();
            return $sync_1c_id;
        }
        catch (Exception $e){
            return $e->getMessage();
        }
    }

}
