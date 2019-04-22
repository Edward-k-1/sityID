<?php
namespace app\api\v1\controllers;


use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use app\api\v1\models\Users;
use yii\data\ActiveDataProvider;

class PaymentController extends ActiveController
{
    public $modelClass = 'app\api\v1\models\Users';
//    public function behaviors()
//    {
//        $behaviors = parent::behaviors();
//        $behaviors['authenticator'] = [
//            'class' => HttpBearerAuth::className(),
//            'except' => ['options'],
//        ];
//        $behaviors['corsFilter'] = [
//            'class' => \yii\filters\Cors::className(),
//            'cors' => [
//                // restrict access to
//                'Origin' => ['http://localhost:4200'],
//                // Allow only POST and PUT methods
//                'Access-Control-Request-Method' => ['POST', 'PUT', 'GET', 'OPTIONS'],
//                // Allow only headers 'X-Wsse'
//                'Access-Control-Request-Headers' => ['X-Wsse', 'Authorization'],
//                // Allow credentials (cookies, authorization headers, etc.) to be exposed to the browser
//                'Access-Control-Allow-Credentials' => true,
//                // Allow OPTIONS caching
//                'Access-Control-Max-Age' => 3600,
//                // Allow the X-Pagination-Current-Page header to be exposed to the browser.
//                'Access-Control-Expose-Headers' => ['X-Pagination-Current-Page', 'Authorization'],
//                'Access-Control-Allow-Headers' => ['Content-Type', 'Authorization']
//            ],
//
//        ];
//        return $behaviors;
//    }

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index']);
        unset($actions['delete'], $actions['create'],$actions['update']);

        return $actions;
    }

    public function actionConfirm()
    {
        $request = \Yii::$app->getRequest()->post();
    if(isset($request['data'])) {
        $result= json_decode( base64_decode($request['data']) );
        $s = "insert into ci_transactions_responces (transaction_id, data) values ($result->order_id, '".$request['data']."')";
        $cs = \Yii::$app->db->createCommand($s)->execute();
        if( $result->status == 'success' || $result->status == 'sandbox' ) {
            $sql = "update ci_transactions_in set is_confirmed = 1 where id = " . $result->order_id;
            $c = \Yii::$app->db->createCommand($sql)->execute();

            $usr = (new \yii\db\Query())->select(['ci_users.id', 'ci_users.wallet', 'ci_transactions_in.amount'])->from('ci_transactions_in')
                ->join('LEFT JOIN', 'ci_users', 'ci_transactions_in.user_id = ci_users.id')
                ->where(['ci_transactions_in.id' => $result->order_id])->all();
            $am = $usr[0]['wallet'] + $usr[0]['amount'];
            $i = $usr[0]['id'];
            $ss = "update ci_users set wallet = $am where id = ". $i;
            $c = \Yii::$app->db->createCommand($ss)->execute();
        }


    } else {
        $s = "insert into ci_transactions_responces (transaction_id, data) values (0, '".json_encode($request)."')";
        $cs = \Yii::$app->db->createCommand($s)->execute();
    }

    }


}