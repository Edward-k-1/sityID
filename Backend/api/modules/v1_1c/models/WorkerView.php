<?php

namespace app\api\modules\v1_1c\models;

class WorkerView extends \yii\db\ActiveRecord implements \yii\web\IdentityInterface
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
        return '{{%worker_views}}';
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
        return isset(self::$workers[$id]) ? new static(self::$workers[$id]) : null;
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        foreach (self::$workers as $worker) {
            if ($worker['accessToken'] === $token) {
                return new static($worker);
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
     * @return {object} WorkerView data.
     */
    public function getAll() {
        $result = WorkerView::find()
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
     * @return {object} One WorkerView by 1c_sync_id.
     */
    public function getRecordBy1CId($idFrom1C) {
        $result = WorkerView::find()
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
     * @param array $workerView
     * @return {object} .
     */
    //TODO change add time to behaviors, user_id add, fix bug with validation
    public function addRecord($workerView) {
        $newWorkerView = new WorkerView();
        $newWorkerView->name = isset($workerView->name) ? $workerView->name : NULL;
        $newWorkerView->sync_1c_id = isset($workerView->sync_1c_id) ? $workerView->sync_1c_id : NULL;
        $newWorkerView->author_id = 1;
        $newWorkerView->updater_id = 1;
        $newWorkerView->created_at = time();
        $newWorkerView->updated_at = time();
        $newWorkerView->save();
        if (empty($newWorkerView)){
            return null;
        }
        else{
            return $newWorkerView->sync_1c_id;
        }
    }

    /**
     *
     * @param array $workerView
     * @param array $updateWorkerView
     * @return {object} .
     */
    //TODO change update time to behaviors, user_id update, fix bug with validation
    public function updateRecord($workerView, $updateWorkerView) {
        $updateWorkerView->name = isset($workerView->name) ? $workerView->name : NULL;
        $updateWorkerView->sync_1c_id = isset($workerView->sync_1c_id) ? $workerView->sync_1c_id : NULL;
        $updateWorkerView->updated_at = time();
        $updateWorkerView->save(false);
        if (empty($updateWorkerView)){
            return null;
        }
        else{
            return $updateWorkerView->sync_1c_id;
        }
    }

    /**
     *
     * @param integer $workerViewId
     * return {object}
     */

    public function deleteRecord($workerViewId){
        $workerView = WorkerView::findOne($workerViewId);
        try{
            $sync_1c_id = $workerView->sync_1c_id;
            $workerView->delete();
            return $sync_1c_id;
        }
        catch (Exception $e){
            return $e->getMessage();
        }

    }
}
