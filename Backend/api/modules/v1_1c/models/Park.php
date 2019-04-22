<?php

namespace app\api\modules\v1_1c\models;

class Park extends \yii\db\ActiveRecord implements \yii\web\IdentityInterface
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
        return '{{%parks}}';
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
        return isset(self::$parks[$id]) ? new static(self::$parks[$id]) : null;
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        foreach (self::$parks as $park) {
            if ($park['accessToken'] === $token) {
                return new static($park);
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
     * @return {object} Park data.
     */
    public function getAll() {
        $result = Park::find()
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
     * @return {object} One Park by 1c_sync_id.
     */
    public function getRecordBy1CId($idFrom1C) {
        $result = Park::find()
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
     * @param array $park
     * @return {object} .
     */
    //TODO change add time to behaviors, user_id add, fix bug with validation
    public function addRecord($park) {
        $newPark = new Park();
        $newPark->name = isset($park->name) ? $park->name : NULL;
        $newPark->carriers_id = 1;
        $newPark->sync_1c_id = isset($park->sync_1c_id) ? $park->sync_1c_id : NULL;
        $newPark->author_id = 1;
        $newPark->updater_id = 1;
        $newPark->created_at = time();
        $newPark->updated_at = time();
        $newPark->save();
        if (empty($newPark)){
            return null;
        }
        else{
            return $newPark->sync_1c_id;
        }
    }

    /**
     *
     * @param array $park
     * @param array $updatePark
     * @return {object} .
     */
    //TODO change update time to behaviors, user_id update, fix bug with validation
    public function updateRecord($park, $updatePark) {
        $updatePark->name = isset($park->name) ? $park->name : NULL;
        $updatePark->carriers_id = isset($park->carriers_id) ? $park->carriers_id : NULL;
        $updatePark->sync_1c_id = isset($park->sync_1c_id) ? $park->sync_1c_id : NULL;
        $updatePark->updated_at = time();
        $updatePark->save(false);
        if (empty($updatePark)){
            return null;
        }
        else{
            return $updatePark->sync_1c_id;
        }
    }

    /**
     *
     * @param integer $parkId
     * return {object}
     */

    public function deleteRecord($parkId){
        $park = Park::findOne($parkId);
        try{
            $sync_1c_id = $park->sync_1c_id;
            $park->delete();
            return $sync_1c_id;
        }
        catch (Exception $e){
            return $e->getMessage();
        }

    }
}
