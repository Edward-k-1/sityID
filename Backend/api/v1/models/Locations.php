<?php
/**
 * Created by PhpStorm.
 * User: walex
 * Date: 13.03.17
 * Time: 1:24
 */
namespace app\api\v1\models;

use Yii;
use yii\base\Model;
use yii\db\ActiveRecord;

class Locations extends ActiveRecord
{
    public static function tableName()
    {
        return "locations_last";
    }
    public static function primaryKey() {
        return ['id'];
    }

//    public function rules(){
//        return [
//            [['user_id'],'integer'],
//            [['screen'], 'string'],
////            [['action_date'], 'date', 'format'=>'yyyy-MM-dd'],
////            [['time_start', 'time_to', 'time_from', 'time_end'], 'date', 'format'=>'HH:mm:ss']
//        ];
//    }

}