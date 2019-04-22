<?php
namespace app\api\v1\models;

use Yii;
use yii\base\Model;
use yii\db\ActiveRecord;

class Help extends ActiveRecord
{
    public static function tableName()
    {
        return "ci_user_help";
    }
    public static function primaryKey() {
        return ['id'];
    }

    //public function rules(){
    //    return [
    //       [['user_id'],'integer'],
    //        [['screen'], 'string'],
    //        [['action_date'], 'date', 'format'=>'yyyy-MM-dd'],
     //       [['time_start', 'time_to', 'time_from', 'time_end'], 'date', 'format'=>'HH:mm:ss']
     //  ];
   // }

}
