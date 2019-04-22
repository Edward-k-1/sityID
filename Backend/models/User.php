<?php

namespace app\models;
use yii\behaviors\TimestampBehavior;


class User extends \yii\db\ActiveRecord implements \yii\web\IdentityInterface
{
    const STATUS_ACTIVE = 1;

    public static function tableName()
    {
        return 'ci_users';
    }
    public function rules()
    {
        return [
            [[ 'status',], 'integer'],
            [['username', 'email'], 'string', 'max' => 255],

            [['username', 'phone'], 'required'],
            ['username', 'match', 'pattern' => '/^[a-z]\w*$/i']
        ];
    }

    public static function findIdentity($id)
    {
        return static::findOne(['id' => $id, 'status' => self::STATUS_ACTIVE]);
    }
    public static function findIdentityByAccessToken($token, $type = null)
    {
        return static::findOne(['token' => $token]);
    }
    public function getId()
    {
        return $this->id;
    }
    public function getAuthKey()
    {
        return $this->auth_key;
    }
    public function getToken(){
        return $this->token;
    }
    public function validateAuthKey($authKey)
    {
        return $this->getAuthKey() === $authKey;
    }
    public function behaviors()
    {
        return [
            TimestampBehavior::className(),
        ];
    }

    public function fields()
    {
        $fields = parent::fields();
        // remove fields that contain sensitive information
        //  unset($fields['auth_key'], $fields['password_hash'], $fields['password_reset_token'],$fields['access_token']);
        return $fields;
    }
    public static function findByUsername($username)
    {
        return static::findOne(['username' => $username, 'status' => self::STATUS_ACTIVE]);
    }
    public function validatePassword($password)
    {

        if (\Yii::$app->getSecurity()->validatePassword( $password,$this->password_hash)) {
            return true;
        }
        return false;
    }

}