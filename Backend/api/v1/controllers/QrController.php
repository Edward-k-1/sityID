<?php
/**
 * Created by PhpStorm.
 * User: EdikU
 * Date: 10.04.2019
 * Time: 13:27
 */

/**
 * Created by PhpStorm.
 * User: EdikU
 * Date: 01.04.2019
 * Time: 13:44
 */
namespace app\api\v1\controllers;

use app\api\v1\models\QR;
use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use yii\data\ActiveDataProvider;
use xj\qrcode\QRcode;
use xj\qrcode\widgets\Email;
use xj\qrcode\widgets\Text;

class QrController extends ActiveController
{
    public $modelClass = 'app\api\v1\models\QR';
    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::className(),
            'except' => ['options'],
        ];
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::className(),
            'cors' => [
                // restrict access to
                'Origin' => ['http://localhost:4200'],
                // Allow only POST and PUT methods
                'Access-Control-Request-Method' => ['POST', 'PUT', 'GET', 'OPTIONS'],
                // Allow only headers 'X-Wsse'
                'Access-Control-Request-Headers' => ['X-Wsse', 'Authorization'],
                // Allow credentials (cookies, authorization headers, etc.) to be exposed to the browser
                'Access-Control-Allow-Credentials' => true,
                // Allow OPTIONS caching
                'Access-Control-Max-Age' => 3600,
                // Allow the X-Pagination-Current-Page header to be exposed to the browser.
                'Access-Control-Expose-Headers' => ['X-Pagination-Current-Page', 'Authorization'],
                'Access-Control-Allow-Headers' => ['Content-Type', 'Authorization']
            ],

        ];
        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index']);
        unset($actions['delete'], $actions['create'],$actions['update']);

        return $actions;
    }

     /*public function actionIndex()
     {
         $request = \Yii::$app->getRequest()->get();
         $user = \Yii::$app->user->identity;

         return ['status' => true, 'QR' => $user->QR, 'type' => $user->type];
     }*/

    public function actionIndex()
    {
        $request = \Yii::$app->getRequest()->get();

        $query = Qr::find();

        $activeData = new ActiveDataProvider([
            'query' => $query,
        ]);
        return $activeData;
        $query = (new \yii\db\Query())->select('*')->from('ci_user_qr')->all();
        return $query;
    }

    public function actionQrs() {
        $userId = \Yii::$app->user->identity->id;
        $qrKey = \Yii::$app->security->generateRandomString(20);
        $Type = 'QR';
        /*$userAgent = \Yii::$app->request->userAgent;*/
        $request = \Yii::$app->getRequest()->post();

        /*$data = (new \yii\db\Query())->select('*')->from('ci_user_qr')
            ->where(['poizdka' => $request['poizdka']])->all();

        if(count($data) > 0) {
            return ['status' => false, 'reason' => 'Дане питання вже було задане'];
        }*/
        $sql2 = "insert into ci_transactios (user_id, amount, type) value
        ($userId, '".$request['tsina_qr']."', '$Type')";
        $c1 = \Yii::$app->db->createCommand($sql2)->execute();

        if($c1) {
            $sql = "insert into ci_user_qr (poizdka, tsina_qr, user_id, qr_key ) values
        ( '" . $request['poizdka']."', '".$request['tsina_qr']."' , $userId , '$qrKey' )";
            $c = \Yii::$app->db->createCommand($sql)->execute();

            if($c) {
                return ['status' => true];
            } else {
                return ['status' => false, 'reason' => 'Сталася внутрішня помилка'];
            }
        } else {
            return ['status' => false, 'reason' => 'Сталася внутрішня помилка'];
        }


    }
    public function actionQr() {
        $userId = \Yii::$app->user->identity->id;
        $data = (new \yii\db\Query())->select('ci_user_qr.*')->from('ci_user_qr')
            ->where(['user_id' => $userId])->orderBy('ci_user_qr.id DESC')->all();



        return ['status' => true, 'data'=> $data];

    }

   public function actionIndex1()
    {
        $request = \Yii::$app->getRequest()->get();

        $query = Qr::find();

        $activeData = new ActiveDataProvider([
            'query' => $query,
        ]);
        return $activeData;
        $query = (new \yii\db\Query())->select('*')->from('ci_users')->all();
        return $query;
    }

    public function actionWallets() {
        $userId = \Yii::$app->user->identity->id;
        /*$qrKey = \Yii::$app->security->generateRandomString(20);*/
        /*$userAgent = \Yii::$app->request->userAgent;*/
        $request = \Yii::$app->getRequest()->post();

        /*$data = (new \yii\db\Query())->select('*')->from('ci_user_qr')
            ->where(['poizdka' => $request['poizdka']])->all();

        if(count($data) > 0) {
            return ['status' => false, 'reason' => 'Дане питання вже було задане'];
        }*/

        $sql1 = "UPDATE ci_users SET wallet = wallet - " .$request['wallet']."  WHERE id=$userId";
        $c = \Yii::$app->db->createCommand($sql1)->execute();

        if($c) {
            return ['status' => true];
        } else {
            return ['status' => false, 'reason' => 'Сталася внутрішня помилка'];
        }
    }
    public function actionWallet() {
        $userId = \Yii::$app->user->identity->id;
        $data = (new \yii\db\Query())->select('ci_users.*')->from('ci_users')
            ->where(['user_id' => $userId])->orderBy('ci_users.id DESC')->all();

        return ['status' => true, 'data'=> $data];

    }

}
