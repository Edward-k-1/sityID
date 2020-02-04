<?php

namespace app\controllers;
use yii\rest\ActiveController;
use app\models\User;

require_once ("C:/sityID/Backend/controllers/twilio/src/Twilio/autoload.php");
use Twilio\Rest\Client;
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

  public function actions()
  {
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
    $user = User::find()->where(['username' => $request['username']])->orWhere(['phone' => $request['username']])->one();
    if ($user !== null && isset($request["password"]) && $user->validatePassword($request["password"])) {
      return ['success' => true, 'token' => $user->token, 'username' => $user->username, 'email' => $user->email, 'type' => $user->type, 'id' => $user->id, 'wallet' => $user->wallet, 'phone' => $user->phone];
    }
    return ["success" => false];
  }

  public function actionRegister()
  {
    $request = \Yii::$app->getRequest()->post();
    $query = (new \yii\db\Query())->select('*')->from('ci_users')
      ->where(['phone' => $request['phone']])->all();
    if (count($query) > 0) {
      return ['status' => 'restricted', 'code' => 101];
    }

//        $code = rand(1000, 999999);
//        $sql = "insert into ci_phone_confirm (phone, code) values (".$request['phone'].", $code)";
//        \Yii::$app->db->createCommand($sql)->execute();


    $phone = substr($request['phone'], 1);
    /* $options = array(
         'http' => array(
             'method'  => 'POST',
       //          'content' => '?api_key=02037de97bbc330134e0cd57d4c6f362&via=sms&phone_number=38'.$phone.'&country_code=38', //production
     //https://demo.twilio.com/welcome/sms/reply/
           //'content' => 'api_key=SBadtoOSC6QthvkvuBynWJX8u80A8jma&via=sms&phone_number='.$phone.'&country_code=380',   //testing
           'content' => 'api_key=ACf9b25e454ef3e87db44966bb67e3f28f&via=sms&phone_number='.$phone.'&country_code=380',
             'header'=> "Content-type: application/x-www-form-urlencoded\r\n"
         )
     );
     $context  = stream_context_create($options);
     $result = file_get_contents('https://api.authy.com/protected/json/phones/verification/start', false, $context);
     $response = json_decode($result, true);
 */
    // A Twilio number you own with SMS capabilities
    $twilio_number = "+16789741015";
    $account_sid = 'ACf9b25e454ef3e87db44966bb67e3f28f';
    $auth_token = '6e3123256301ed9ed6c2014beacae910';
    $sid = "ACb80e00a687e0d5769b8cd26e7add7815";
    $token = "06b28e7008dadc204ed8ac25a60ac7bd";

    $twilio = new  Client($sid, $token);

    $verification = $twilio->verify->v2->services("VAe0edea1b3b430d8ce1ace9e86f08bfaf")
      ->verifications
      ->create("+380" . $phone, "sms");
    $response = true; //["message"=>"User created successfully.","success" => true];
    // print($verification->status);
    return ['status' => 'code_sent', 'code' => 1, 'data' => $response]; //$response];
  }

  public function actionConfirm()
  {
    $request = \Yii::$app->getRequest()->post();
    $phone = substr($request['phone'], 1);
    $code = $request['code'];
    //try {
    //    $result = file_get_contents('https://api.authy.com/protected/json/phones/verification/check?api_key=SBadtoOSC6QthvkvuBynWJX8u80A8jma&verification_code='.$code.'&phone_number='.$phone.'&country_code=380',
    //       false);
    //   $response = json_decode($result, true);
    //} catch (\Exception $e) {
    //    $response = ['success'=>false];
    //}
    $sid = "ACb80e00a687e0d5769b8cd26e7add7815";
    $token = "06b28e7008dadc204ed8ac25a60ac7bd";
    $twilio = new Client($sid, $token);

    $verification_check = $twilio->verify->v2->services("VAe0edea1b3b430d8ce1ace9e86f08bfaf")
      ->verificationChecks
      ->create($code, // code
        array("to" => "+380" . $phone)
      );

    /*  print($verification_check->status);
        if(!$response['success']) {
            return ['success'=>false];
        }*/
    if ($verification_check->status == "pending") {
      return ['success' => false];
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

  private function generateRandomString($length = 10)
  {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
      $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
  }

  public function actionResetpass()
  {
    $sid = "ACb80e00a687e0d5769b8cd26e7add7815";
    $token = "06b28e7008dadc204ed8ac25a60ac7bd";

    $request = \Yii::$app->getRequest()->post();
    $phone = substr($request['phone2'], 1);

    $query = (new \yii\db\Query())->select('*')->from('ci_users')
      ->where(['phone' => $request['phone2']])->all();
    if (count($query) === 0) {
      return ['status' => 'restricted', 'code' => 101];
    }

    $twilio = new  Client($sid, $token);

    /*$verification = $twilio->verify->v2->services("VAe0edea1b3b430d8ce1ace9e86f08bfaf")
      ->verifications
      ->create("+380".$phone, "sms");*/
    $response = true; //["message"=>"User created successfully.","success" => true];
    // print($verification->status);
    return ['status' => 'code_sent', 'code' => 1, 'data' => $response];
  }

  public function actionCoder()
  {
    $request = \Yii::$app->getRequest()->post();
    $phone = substr($request['phone'], 1);
    $code = $request['code2'];
    $sid = "ACb80e00a687e0d5769b8cd26e7add7815";
    $token = "06b28e7008dadc204ed8ac25a60ac7bd";
    $twilio = new Client($sid, $token);

    /*$verification_check = $twilio->verify->v2->services("VAe0edea1b3b430d8ce1ace9e86f08bfaf")
      ->verificationChecks
      ->create($code, // code
        array("to" => "+380".$phone)
      );
*/
    //if($code = "123456") $verification_check = ['status' => 'pending']; else $verification_check = ['status' => 'approved'];
    /*  print($verification_check->status);
        if(!$response['success']) {
            return ['success'=>false];
        }*/
    /* if($verification_check->status == "pending")
     {
       return ['success'=>false];
     }

       return ['success'=>true];
   }*/
    return ['success' => true];
  }
  public function actionNewpass(){
    $request = \Yii::$app->getRequest()->post();
    $password = $request['pass'];
    $phone =  $request['phone2'];
    $fp = fopen('output.txt', 'w');
    $test = fwrite($fp, 'password: '.$password."\r\n ");
    $test = fwrite($fp, 'telephone: '.$phone."\r\n ");

    $hesh = \Yii::$app->getSecurity()->generatePasswordHash($password);
    $test = fwrite($fp, 'hash: '.$hesh."\r\n ");
    $sql1 = "UPDATE ci_users SET password_hash = '" .$hesh."' WHERE phone=$phone";
    if(!\Yii::$app->db->createCommand($sql1)->execute()) return ['status' => false];
    return ['status' => true];
  }
}
