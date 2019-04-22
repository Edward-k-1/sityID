<?php

namespace app\api\modules\v1_1c\models;

class VehicleModelType extends \yii\db\ActiveRecord implements \yii\web\IdentityInterface
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
        return '{{%vehicle_models_types}}';
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
        return isset(self::$vehicleModelTypes[$id]) ? new static(self::$vehicleModelTypes[$id]) : null;
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        foreach (self::$vehicleModelTypes as $vehicle) {
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
     * @return {object} VehicleModelType data.
     */
    public function getAll() {
        $result = VehicleModelType::find()
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
     * @return {object} One VehicleModelType by 1c_sync_id.
     */
    public function getRecordBy1CId($idFrom1C) {
        $result = VehicleModelType::find()
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
     * @param array $vehicleModelType
     * @return {object} .
     */
    //TODO change add time to behaviors, user_id add, fix bug with validation
    public function addRecord($vehicleModelType) {
        $newVehicleModelType = new VehicleModelType();
        $newVehicleModelType->name = isset($vehicleModelType->name) ? $vehicleModelType->name : NULL;
        $newVehicleModelType->sync_1c_id = isset($vehicleModelType->sync_1c_id) ? $vehicleModelType->sync_1c_id : NULL;
        $newVehicleModelType->author_id = 1;
        $newVehicleModelType->updater_id = 1;
        $newVehicleModelType->created_at = time();
        $newVehicleModelType->updated_at = time();
        $newVehicleModelType->save();
        if (empty($newVehicleModelType)){
            return null;
        }
        else{
            return $newVehicleModelType->sync_1c_id;
        }
    }

    /**
     *
     * @param array $vehicleModelType
     * @param array $updateVehicleModelType
     * @return {object} .
     */
    //TODO change update time to behaviors, user_id update, fix bug with validation
    public function updateRecord($vehicleModelType, $updateVehicleModelType) {
        $updateVehicleModelType->name = isset($vehicleModelType->name) ? $vehicleModelType->name : NULL;
        $updateVehicleModelType->sync_1c_id = isset($vehicleModelType->sync_1c_id) ? $vehicleModelType->sync_1c_id : NULL;
        $updateVehicleModelType->updated_at = time();
        $updateVehicleModelType->save(false);
        if (empty($updateVehicleModelType)){
            return null;
        }
        else{
            return $updateVehicleModelType->sync_1c_id;
        }
    }

    /**
     *
     * @param integer $vehicleModelTypeId
     * return {object}
     */

    public function deleteRecord($vehicleModelTypeId){
        $vehicleModelType = VehicleModelType::findOne($vehicleModelTypeId);
        try{
            $sync_1c_id = $vehicleModelType->sync_1c_id;
            $vehicleModelType->delete();
            return $sync_1c_id;
        }
        catch (Exception $e){
            return $e->getMessage();
        }

    }
}
