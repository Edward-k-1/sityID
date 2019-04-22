<?php

namespace app\api\modules\v1_1c\models;

use Yii;

class Worker extends \yii\db\ActiveRecord
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
        return '{{%workers}}';
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
            [['name', 'basic_number', 'created_at', 'updated_at'], 'required']
        ];
    }

    /**
     * @inheritdoc
     */

    /**
     *
     * @return {object} Worker data.
     */
    public function getAll() {
        $result = Worker::find()
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
     * @return {object} One Worker by 1c_sync_id.
     */
    public function getRecordBy1CId($idFrom1C) {
        $result = Worker::find()
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
     * @param array $worker
     * @return {object} .
     */
    //TODO change add time to behaviors, user_id add, fix bug with validation
    public function addRecord($worker) {
        if(isset($worker->parks_id)){
            $park = Park::getRecordBy1CId($worker->parks_id);
            if(isset($park)){
                $parkID = $park->getPrimaryKey();
            }
            else{
                $parkID = NULL;
                //return array("error"=> "No such parks_id $worker->parks_id");
            }
        }
        else{
            $parkID = NULL;
        }
        if(isset($worker->worker_views_id)){
            $worker_views = WorkerView::getRecordBy1CId($worker->worker_views_id);
            if(isset($worker_views)){
                $workerViewsID = $worker_views->getPrimaryKey();
            }
            else{
                $workerViewsID = NULL;
                //return array("error"=> "No such worker_views_id $worker->worker_views_id");
            }
        }
        else {
            $workerViewsID = NULL;
        }
        if(isset($worker->date_added)){
            $date_added = Yii::$app->formatter->asDate($worker->date_added, 'yyyy-MM-dd');
        }
        else{
            $date_added = NULL;
        }
        if(isset($worker->date_of_dismissal)){
            $date_of_dismissal = Yii::$app->formatter->asDate($worker->date_of_dismissal, 'yyyy-MM-dd');
        }
        else{
            $date_of_dismissal = NULL;
        }
        $newWorker = new Worker();
        $newWorker->name = isset($worker->name) ? $worker->name : NULL;
        $newWorker->last_name = isset($worker->last_name) ? $worker->last_name : NULL;
        $newWorker->first_name = isset($worker->first_name) ? $worker->first_name : NULL;
        $newWorker->middle_name = isset($worker->middle_name) ? $worker->middle_name : NULL;
        $newWorker->basic_number = isset($worker->basic_number) ? $worker->basic_number : NULL;
        $newWorker->company_number = isset($worker->company_number) ? $worker->company_number : NULL;
        $newWorker->status = isset($worker->status) ? $worker->status : NULL;
        $newWorker->date_added = $date_added;
        $newWorker->date_of_dismissal = $date_of_dismissal;
        $newWorker->sync_1c_id = isset($worker->sync_1c_id) ? $worker->sync_1c_id : NULL;
        $newWorker->parks_id = $parkID;
        $newWorker->author_id = 1;
        $newWorker->updater_id = 1;
        $newWorker->worker_views_id = $workerViewsID;
        $newWorker->created_at = time();
        $newWorker->updated_at = time();
        $newWorker->save(false);
        if (empty($newWorker)){
            return null;
        }
        else{
            return $newWorker->sync_1c_id;
        }
    }

    /**
     *
     * @param array $worker
     * @param array $updateWorker
     * @return {object} .
     */
    //TODO change update time to behaviors, user_id update, fix bug with validation
    public function updateRecord($worker, $updateWorker) {
        if(isset($worker->parks_id)){
            $park = Park::getRecordBy1CId($worker->parks_id);
            if(isset($park)){
                $parkID = $park->getPrimaryKey();
            }
            else{
                $parkID = NULL;
                //return array("error"=> "No such parks_id $worker->parks_id");
            }
            $updateWorker->parks_id = $parkID;
        }
        if(isset($worker->worker_views_id)){
            $worker_views = WorkerView::getRecordBy1CId($worker->worker_views_id);
            if(isset($worker_views)){
                $workerViewsID = $worker_views->getPrimaryKey();
            }
            else{
                $workerViewsID = NULL;
                //return array("error"=> "No such worker_views_id $worker->worker_views_id");
            }
            $updateWorker->worker_views_id = $workerViewsID;
        }

        if(isset($worker->date_added)){
            $date_added = Yii::$app->formatter->asDate($worker->date_added, 'yyyy-MM-dd');
        }
        else{
            $date_added = NULL;
        }
        if(isset($worker->date_of_dismissal)){
            $date_of_dismissal = Yii::$app->formatter->asDate($worker->date_of_dismissal, 'yyyy-MM-dd');
        }
        else{
            $date_of_dismissal = NULL;
        }
        $updateWorker->name = isset($worker->name) ? $worker->name : NULL;
        $updateWorker->last_name = isset($worker->last_name) ? $worker->last_name : NULL;
        $updateWorker->first_name = isset($worker->first_name) ? $worker->first_name : NULL;
        $updateWorker->middle_name = isset($worker->middle_name) ? $worker->middle_name : NULL;
        $updateWorker->basic_number = isset($worker->basic_number) ? $worker->basic_number : NULL;
        $updateWorker->company_number = isset($worker->company_number) ? $worker->company_number : NULL;
        $updateWorker->status = isset($worker->status) ? $worker->status : NULL;
        $updateWorker->date_added = $date_added;
        $updateWorker->date_of_dismissal = $date_of_dismissal;
        $updateWorker->sync_1c_id = isset($worker->sync_1c_id) ? $worker->sync_1c_id : NULL;
        $updateWorker->updated_at = time();
        $updateWorker->save(false);
        if (empty($updateWorker)){
            return null;
        }
        else{
            return $updateWorker->sync_1c_id;
        }
    }

    /**
     *
     * @param integer $workerId
     * return {object}
     */

    public function deleteRecord($workerId){
        $worker = Worker::findOne($workerId);
        try{
            $sync_1c_id = $worker->sync_1c_id;
            $worker->delete();
            return $sync_1c_id;
        }
        catch (Exception $e){
            return $e->getMessage();
        }

    }

}
