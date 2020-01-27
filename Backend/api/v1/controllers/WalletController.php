<?php
namespace app\api\v1\controllers;


use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use app\api\v1\models\Users;
use yii\data\ActiveDataProvider;

class WalletController extends ActiveController
{
    public $modelClass = 'app\api\v1\models\Users';
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
                'Access-Control-Request-Method' => ['POST', 'PUT', 'GET', 'OPTIONS','DELETE'],
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

    public function actionIndex()
    {
        $request = \Yii::$app->getRequest()->get();
        $user = \Yii::$app->user->identity;

        return ['status' => true, 'wallet' => $user->wallet, 'type' => $user->type];
    }

    public function actionPays() {
        $request = \Yii::$app->getRequest()->post();
        $userId = \Yii::$app->user->identity->id;
        $amount = $request['amount'];

        $sql = "insert into ci_transactions_in (user_id, amount,  is_confirmed) values ($userId, $amount, 0)";
        $c = \Yii::$app->db->createCommand($sql)->execute();
        if($c) {
            $ids = (new \yii\db\Query())->select('*')->from('ci_transactions_in')
                ->orderBy('id DESC')->limit(1)->all();
            $id = $ids[0]['id'];
        } else {
            return ['status' => false, 'error' => 'DB error'];
        }

        $public_key = 'i29657637046';
        $private_key= 'M06SiICMPqajNxxzMs2wwAGoXmmMG69jMjZd9RPI';

        $liqpay = new LiqPay($public_key, $private_key);
        $html = $liqpay->cnb_form(array(
            'version'=>'3',
            'action'         => 'pay',
            'amount'         => $amount, // сумма заказа
            'currency'       => 'UAH',
            /* перед этим мы ведь внесли заказ в  таблицу,
            $insert_id = $wpdb->query( 'insert into table_orders' );
            */
            'description'    => 'Оплата заказа № '.$id,
            'order_id'       => $id,
            // если пользователь возжелает вернуться на сайт
            'result_url'	=>	'http://id.lutsk.ua/',
            /*
                если не вернулся, то Webhook LiqPay скинет нам сюда информацию из формы,
                в частонсти все тот же order_id, чтобы заказ
                 можно было обработать как оплаченый
            */
            'server_url'	=>	'http://api.lutsk.ua/v1/payment/confirm',
            'language'		=>	'ru', // uk, en
            'sandbox'=>'1' // и куда же без песочницы,
            // не на реальных же деньгах тестировать
        ));

        return array("status"=> true, 'form'=>$html, 'order_num'=>$id);
    }

    public function actionHistory() {
        $userId = \Yii::$app->user->identity->id;

        $data = (new \yii\db\Query())->select('ci_transactions_in.*')->from('ci_transactions_in')
            ->where(['user_id' => $userId])->orderBy('ci_transactions_in.id DESC')->limit(5)->all();

        return ['status' => true, 'data'=> $data];
    }

    public function actionCadd() {
        $userId = \Yii::$app->user->identity->id;
        $request = \Yii::$app->getRequest()->post();
        $obmez = 'необмежено';
        $status = 'активна';

        $data = (new \yii\db\Query())->select('*')->from('ci_user_cards')
            ->where(['card_uid' => $request['card_uid']])->all();

        if(count($data) > 0) {
            return ['status' => false, 'reason' => 'Дана картка вже існує в системі'];
        }

        $sql = "insert into ci_user_cards (user_id, card_uid, name, rstr, rstr_period, obmez, status) values
                  ($userId, '".$request['card_uid']."', '".$request['name']."', 0 ,0, '$obmez', '$status')";
        $c = \Yii::$app->db->createCommand($sql)->execute();

        if($c) {
            return ['status' => true];
        } else {
            return ['status' => false, 'reason' => 'Сталася внутрішня помилка'];
        }
    }

    public function actionCards() {
        $userId = \Yii::$app->user->identity->id;

        $data = (new \yii\db\Query())->select('ci_user_cards.*')->from('ci_user_cards')
            ->where(['user_id' => $userId])->orderBy('ci_user_cards.id DESC')->all();

        return ['status' => true, 'data'=> $data];

    }

     public function actionWallet() {
        $userId = \Yii::$app->user->identity->id;

        $sql1 = "DELETE FROM ci_user_cards WHERE id=id";

        if(mysqli_query( $sql1)) {
            return ['status' => true];
        } else {
            return ['status' => false, 'reason' => 'Сталася внутрішня помилка'];
        }
    }
    public function actionWallets() {
        $userId = \Yii::$app->user->identity->id;
        $data = (new \yii\db\Query())->select('ci_user_cards.*')->from('ci_user_cards')
            ->where(['user_id' => $userId])->orderBy('ci_user_cards.id DESC')->all();

        return ['status' => true, 'data'=> $data];

    }
    public function actionUbdate() {
        $userId = \Yii::$app->user->identity->id;
        /*$qrKey = \Yii::$app->security->generateRandomString(20);*/
        /*$userAgent = \Yii::$app->request->userAgent;*/
        $request = \Yii::$app->getRequest()->post();

        /*$data = (new \yii\db\Query())->select('*')->from('ci_user_qr')
            ->where(['poizdka' => $request['poizdka']])->all();

        if(count($data) > 0) {
            return ['status' => false, 'reason' => 'Дане питання вже було задане'];
        }*/

        $sql1 = "UPDATE ci_user_cards SET name = " .$request['name'].", card_uid = " .$request['card_uid'].", obmez = ".$request['obmez'].", pine = ".$request['pine'].", status = ".$request['status']."  WHERE id=$userId";
        $c = \Yii::$app->db->createCommand($sql1)->execute();

        if($c) {
            return ['status' => true];
        } else {
            return ['status' => false, 'reason' => 'Сталася внутрішня помилка'];
        }
    }
    public function actionUbdates() {
        $userId = \Yii::$app->user->identity->id;
        $data = (new \yii\db\Query())->select('ci_user_cards.*')->from('ci_user_cards')
            ->where(['user_id' => $userId])->orderBy('ci_user_cards.id DESC')->all();

        return ['status' => true, 'data'=> $data];

    }
}
