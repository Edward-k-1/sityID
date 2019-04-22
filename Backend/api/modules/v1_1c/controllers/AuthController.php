<?php

namespace app\api\modules\v1_1c\controllers;

use yii\rest\ActiveController;
use app\models\User;

class AuthController extends ActiveController
{
    public $modelClass = 'app\models\User';

    public function actionToken(){
        $requestString = '';
        foreach ($_POST as $item){
            $params[]= $item;
        }
        if (isset($params[0]) && isset($params[1])) {
            $user = User::findByUsername($params[0]);
            if (isset($user)) {
                $pass = $user->validatePassword($params[1]);
                if ($pass) {
                    return array(
                        'success' => true,
                        'token' => $user->getToken()
                    );
                } else {
                    return array(
                        'success' => false,
                        'error' => "Not valid pass"
                    );
                }
            } else {
                return array(
                    'success' => false,
                    'error' => "Not valid user"
                );
            }
        }
        else{
            return array(
                'success' => false,
                'error' => "Not valid params"
            );
        }
    }

}