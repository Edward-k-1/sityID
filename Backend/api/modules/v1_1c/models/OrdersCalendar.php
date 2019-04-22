<?php

namespace app\api\modules\v1_1c\models;

use Yii;
use yii\behaviors\TimestampBehavior;
use yii\behaviors\BlameableBehavior;

class OrdersCalendar extends \yii\db\ActiveRecord
{
    public $id;
    public $username;
    public $password;
    public $authKey;
    public $accessToken;
    public function behaviors()
    {
        return [
            TimestampBehavior::className(),
            ['class' => BlameableBehavior::className(),
                'createdByAttribute' => 'author_id',
                'updatedByAttribute' => 'updater_id',]
        ];
    }

    /***
    * Return table name.
         *
         * @return {string} Data Base table name.
    */
    public static function tableName()
    {
        return '{{%orders_calendar}}';
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
            [['date', 'type'], 'required'],
        [["date"],"safe"],
            [["type"],"integer"]
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
        $result = OrdersCalendar::find()
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
        $result = OrdersCalendar::find()
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
    public function addRecord($orders_calendar) {


        if(isset($orders_calendar->date)){
            $date = Yii::$app->formatter->asDate($orders_calendar->date, 'yyyy-MM-dd');
        }
        else{
            $date = NULL;
        }
        $newOrdersCalendar = new OrdersCalendar();
        $newOrdersCalendar->type = isset($orders_calendar->type) ? $orders_calendar->type : NULL;
        $newOrdersCalendar->date = isset($orders_calendar->date) ? $orders_calendar->date : NULL;
        $newOrdersCalendar->sync_1c_id = isset($newOrdersCalendar->sync_1c_id) ? $newOrdersCalendar->sync_1c_id : NULL;


        //$newOrdersCalendar->author_id = 1;
        //$newOrdersCalendar->updater_id = 1;
       // $newOrdersCalendar->created_at = time();
       // $newOrdersCalendar->updated_at = time();
        $newOrdersCalendar->save(false);
        if (empty($newOrdersCalendar)){
            return null;
        }
        else{
            return $newOrdersCalendar->sync_1c_id;
        }
    }

    /**
     *
     * @param array $ordersCalendar
     * @param array $updateOrderCalendar
     * @return {object} .
     */
    //TODO change update time to behaviors, user_id update, fix bug with validation
    public function updateRecord($ordersCalendar, $updateOrderCalendar) {



        $updateOrderCalendar->type = isset($ordersCalendar->type) ? $ordersCalendar->type : NULL;
        $updateOrderCalendar->date = isset($ordersCalendar->date) ? $ordersCalendar->date : NULL;
        $updateOrderCalendar->sync_1c_id = isset($ordersCalendar->sync_1c_id) ? $ordersCalendar->sync_1c_id : NULL;
        $updateOrderCalendar->save(false);
        if (empty($updateOrderCalendar)){
            return null;
        }
        else{
            return $updateOrderCalendar->sync_1c_id;
        }
    }

    /**
     *
     * @param integer $orderCalendarId
     * return {object}
     */

    public function deleteRecord($orderCalendarId){
        $ordersCalendar = OrdersCalendar::findOne($orderCalendarId);
        try{
            $sync_1c_id = $ordersCalendar->sync_1c_id;
            $ordersCalendar->delete();
            return $sync_1c_id;
        }
        catch (Exception $e){
            return $e->getMessage();
        }

    }

}
