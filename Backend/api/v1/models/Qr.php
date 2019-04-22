<?php
/**
 * Created by PhpStorm.
 * User: EdikU
 * Date: 10.04.2019
 * Time: 13:29
 */

namespace app\api\v1\models;

use Yii;
use yii\base\Model;
use yii\db\ActiveRecord;

class Qr extends ActiveRecord
{
    public static function tableName()
    {
        return "ci_user_qr";
        return "ci_users";
        return "ci_transactios";
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
