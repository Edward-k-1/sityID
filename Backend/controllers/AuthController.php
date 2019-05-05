<?php

namespace app\controllers;
use yii\rest\ActiveController;
use app\models\User;


class AuthController extends ActiveController
{
    public $modelClass = 'app\models\User';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::className(),
            'cors' => [
                // restrict access to
                'Origin' => ['http://localhost:4200'],
                // Allow only POST and PUT methods
                'Access-Control-Request-Method' => ['POST', 'PUT', 'GET'],
                // Allow only headers 'X-Wsse'
                'Access-Control-Request-Headers' => ['X-Wsse'],
                // Allow credentials (cookies, authorization headers, etc.) to be exposed to the browser
                'Access-Control-Allow-Credentials' => true,
                // Allow OPTIONS caching
                'Access-Control-Max-Age' => 3600,
                // Allow the X-Pagination-Current-Page header to be exposed to the browser.
                'Access-Control-Expose-Headers' => ['X-Pagination-Current-Page'],
                'Access-Control-Allow-Headers' => ['Content-Type', 'Authorization']
            ],

        ];
        return $behaviors;
    }

    public function actions(){
        $actions = parent::actions();
        unset($actions['create']);
        unset($actions['update']);
        unset($actions['delete']);
        unset($actions['view']);
        unset($actions['index']);
        return $actions;
    }

    /****
     * Create action login which validate password and if confirm send token
     */
    public function actionLogin()
    {
        $request = \Yii::$app->getRequest()->post();
	//$request = json_decode(file_get_contents("php://input"));
	//$login = $request;
	//return $login;
        $user =  User::find()->where(['username'=>$request['username']])->orWhere(['phone' => $request['username']])->one();
        if($user!==null && isset($request["password"]) && $user->validatePassword($request["password"]))
        {
            return ['success'=>true,'token'=>$user->token,'username'=>$user->username,'email'=>$user->email,'type'=>$user->type,'id'=>$user->id, 'wallet'=>$user->wallet, 'phone'=>$user->phone];
        }
        return ["success"=>false];
    }

    public function actionRegister() {
        $request = \Yii::$app->getRequest()->post();

        $query = (new \yii\db\Query())->select('*')->from('ci_users')
            ->where(['phone' => $request['phone']])->all();
        if(count($query) > 0) {
            return ['status' => 'restricted', 'code' => 101];
        }

//        $code = rand(1000, 999999);
//        $sql = "insert into ci_phone_confirm (phone, code) values (".$request['phone'].", $code)";
//        \Yii::$app->db->createCommand($sql)->execute();
        $phone = substr($request['phone'], 1);
        $options = array(
            'http' => array(
                'method'  => 'POST',
//                'content' => '?api_key=02037de97bbc330134e0cd57d4c6f362&via=sms&phone_number=38'.$phone.'&country_code=38', //production
                'content' => 'api_key=SBadtoOSC6QthvkvuBynWJX8u80A8jma&via=sms&phone_number='.$phone.'&country_code=380',   //testing
                'header'=> "Content-type: application/x-www-form-urlencoded\r\n"
            )
        );
        $context  = stream_context_create($options);
        $result = file_get_contents('https://api.authy.com/protected/json/phones/verification/start', false, $context);
        $response = json_decode($result, true);
        return ['status' => 'code_sent', 'code' => 1, 'data' => $response];
    }

    public function actionConfirm() {
        $request = \Yii::$app->getRequest()->post();
        $phone = substr($request['phone'], 1);
        $code = $request['code'];
        try {
            $result = file_get_contents('https://api.authy.com/protected/json/phones/verification/check?api_key=SBadtoOSC6QthvkvuBynWJX8u80A8jma&verification_code='.$code.'&phone_number='.$phone.'&country_code=380',
                false);
            $response = json_decode($result, true);
        } catch (\Exception $e) {
            $response = ['success'=>false];
        }

        if(!$response['success']) {
            return ['success'=>false];
        }

        $user = new User;
        $user->username = $request['username'];
        $user->email = '';
        $user->phone = $request['phone'];
        $user->created_at = time();
        $user->author_id = 0;
        $user->auth_key = $this->generateRandomString();
        $user->password_reset_token = $this->generateRandomString();
        $user->password_hash = \Yii::$app->getSecurity()->generatePasswordHash($request['password']);
        $user->type = 0;
        $user->wallet = 0;
        $user->token = $this->generateRandomString();
//        $user->save();
        try {
            $user->save();
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 2, 'error' => $e, 'message' => $e->getMessage()];
        }
        return ['status' => true, 'code' => 0, 'message' => 'User successfully created.'];
//        return $response;
//        if($response['success'])
    }

    private function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}