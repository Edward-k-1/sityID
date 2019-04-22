<?php

namespace app\api\modules\v1_1c\models;

class VehicleModel extends \yii\db\ActiveRecord implements \yii\web\IdentityInterface
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
        return '{{%vehicle_models}}';
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
            [['name'], 'required']
        ];
    }

    /**
     * @inheritdoc
     */
    public static function findIdentity($id)
    {
        return isset(self::$vehicleModels[$id]) ? new static(self::$vehicleModels[$id]) : null;
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        foreach (self::$vehicleModels as $vehicle) {
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
     * @return {object} VehicleModel data.
     */
    public function getAll() {
        $result = VehicleModel::find()
            ->orderBy('id')
            ->all();
        if (empty($result)){
            return null;
        }
        else{
            return $result;
        }
    }

    /**
     *
     * @param integer $idFrom1C
     * @return {object} One VehicleModel by 1c_sync_id.
     */
    public function getRecordBy1CId($idFrom1C) {
        $result = VehicleModel::find()
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
     * @param array $vehicleModel
     * @return {object} .
     */
    //TODO change add time to behaviors, user_id add, fix bug with validation
    public function addRecord($vehicleModel) {
        if(isset($vehicleModel->vehicle_models_types_id)){
            $vehicleModelType = VehicleModelType::getRecordBy1CId($vehicleModel->vehicle_models_types_id);
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
                    //return array("error"=> "No such vehicle_models_types_id $vehicleModel->vehicle_models_types_id");
                }
            }
        }
        else {
            $vehicleModelTypeID = NULL;
        }
        $newVehicleModel = new VehicleModel();
        $newVehicleModel->name = isset($vehicleModel->name) ? $vehicleModel->name : NULL;
        $newVehicleModel->sync_1c_id = isset($vehicleModel->sync_1c_id) ? $vehicleModel->sync_1c_id : NULL;
        $newVehicleModel->vehicle_models_types_id = $vehicleModelTypeID;
        $newVehicleModel->author_id = 1;
        $newVehicleModel->updater_id = 1;
        $newVehicleModel->created_at = time();
        $newVehicleModel->updated_at = time();
        $newVehicleModel->save();
        if (empty($newVehicleModel)){
            return null;
        }
        else{
            return $newVehicleModel->sync_1c_id;
        }
    }

    /**
     *
     * @param array $vehicleModel
     * @param array $updateVehicleModel
     * @return {object} .
     */
    //TODO change update time to behaviors, user_id update, fix bug with validation
    public function updateRecord($vehicleModel, $updateVehicleModel) {
        if(isset($vehicleModel->vehicle_models_types_id)){
            $vehicleModelType = VehicleModelType::getRecordBy1CId($vehicleModel->vehicle_models_types_id);
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
                    //return array("error"=> "No such vehicle_models_types_id $vehicleModel->vehicle_models_types_id");
                }
            }
            $updateVehicleModel->vehicle_models_types_id = $vehicleModelTypeID;
        }
        $updateVehicleModel->name = isset($vehicleModel->name) ? $vehicleModel->name : NULL;
        $updateVehicleModel->sync_1c_id = isset($vehicleModel->sync_1c_id) ? $vehicleModel->sync_1c_id : NULL;
        $updateVehicleModel->updated_at = time();
        $updateVehicleModel->save(false);
        if (empty($updateVehicleModel)){
            return null;
        }
        else{
            return $updateVehicleModel->sync_1c_id;
        }
    }

    /**
     *
     * @param integer $vehicleModelId
     * return {object}
     */

    public function deleteRecord($vehicleModelId){
        $vehicleModel = VehicleModel::findOne($vehicleModelId);
        try{
            $sync_1c_id = $vehicleModel->sync_1c_id;
            $vehicleModel->delete();
            return $sync_1c_id;
        }
        catch (Exception $e){
            return $e->getMessage();
        }

    }
}
