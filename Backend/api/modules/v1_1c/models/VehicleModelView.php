<?php

namespace app\api\modules\v1_1c\models;

class VehicleModelView extends \yii\db\ActiveRecord implements \yii\web\IdentityInterface
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
        return '{{%vehicle_models_views}}';
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
        return isset(self::$vehicleModelViews[$id]) ? new static(self::$vehicleModelViews[$id]) : null;
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        foreach (self::$vehicleModelViews as $vehicle) {
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
     * @return {object} VehicleModelView data.
     */
    public function getAll() {
        $result = VehicleModelView::find()
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
     * @return {object} One VehicleModelView by 1c_sync_id.
     */
    public function getRecordBy1CId($idFrom1C) {
        $result = VehicleModelView::find()
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
     * @param array $vehicleModelView
     * @return {object} .
     */
    //TODO change add time to behaviors, user_id add, fix bug with validation
    public function addRecord($vehicleModelView) {
        $newVehicleModelView = new VehicleModelView();
        $newVehicleModelView->name = isset($vehicleModelView->name) ? $vehicleModelView->name : NULL;
        $newVehicleModelView->sync_1c_id = isset($vehicleModelView->sync_1c_id) ? $vehicleModelView->sync_1c_id : NULL;
        $newVehicleModelView->author_id = 1;
        $newVehicleModelView->updater_id = 1;
        $newVehicleModelView->created_at = time();
        $newVehicleModelView->updated_at = time();
        $newVehicleModelView->save();
        if (empty($newVehicleModelView)){
            return null;
        }
        else{
            return $newVehicleModelView->sync_1c_id;
        }
    }

    /**
     *
     * @param array $vehicleModelView
     * @param array $updateVehicleModelView
     * @return {object} .
     */
    //TODO change update time to behaviors, user_id update, fix bug with validation
    public function updateRecord($vehicleModelView, $updateVehicleModelView) {
        $updateVehicleModelView->name = isset($vehicleModelView->name) ? $vehicleModelView->name : NULL;
        $updateVehicleModelView->sync_1c_id = isset($vehicleModelView->sync_1c_id) ? $vehicleModelView->sync_1c_id : NULL;
        $updateVehicleModelView->updated_at = time();
        $updateVehicleModelView->save(false);
        if (empty($updateVehicleModelView)){
            return null;
        }
        else{
            return $updateVehicleModelView->sync_1c_id;
        }
    }

    /**
     *
     * @param integer $vehicleModelViewId
     * return {object}
     */

    public function deleteRecord($vehicleModelViewId){
        $vehicleModelView = VehicleModelView::findOne($vehicleModelViewId);
        try{
            $sync_1c_id = $vehicleModelView->sync_1c_id;
            $vehicleModelView->delete();
            return $sync_1c_id;
        }
        catch (Exception $e){
            return $e->getMessage();
        }

    }
}
