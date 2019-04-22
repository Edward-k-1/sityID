<?php
/**
 * Created by PhpStorm.
 * User: oleksandr
 * Date: 26.08.16
 * Time: 22:51
 */


namespace app\api\v1\models;
use Yii;
use yii\base\Model;
use yii\db\ActiveRecord;

class Users extends ActiveRecord
{
    public function fields()
    {
        $fields = parent::fields();

        // remove fields that contain sensitive information
        unset($fields['auth_key'], $fields['password_hash'], $fields['password_reset_token'],$fields['token']);

        return $fields;
    }
}