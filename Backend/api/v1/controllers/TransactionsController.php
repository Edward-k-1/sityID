<?php
namespace app\api\v1\controllers;

use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use app\api\v1\models\Transactions;
use yii\data\ActiveDataProvider;

class TransactionsController extends ActiveController
{
    public $modelClass = 'app\api\v1\models\Transactions';
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
//        unset($actions['delete'], $actions['create'],$actions['update']);

        return $actions;
    }

    public function actionIndex()
    {
        $request = \Yii::$app->getRequest()->get();

        $query = (new \yii\db\Query())->select(['transactions.*', 'objects.name as object', 'mac_cards.notice as person', 'mac_cards.id as card_id'])->from('transactions')
            ->join('LEFT JOIN', 'objects', 'transactions.objects_id = objects.id')
            ->join('LEFT JOIN', 'mac_cards', 'mac_cards.card_id = UPPER(transactions.card)');

        if(isset($request['date'])) {
            $from = strtotime($request['date']);//17-09-2018
            $to = $from + 60 * 60 * 24;
            $query = $query->where('transactions.unixtime > '.$from)->andWhere('transactions.unixtime < '.$to);
        }
        $query = $query->orderBy('transactions.id DESC')->limit(1000)->all();

        $data = [];
        foreach ($query as $q) {
            $q['date'] = date('Y.m.d', $q['unixtime']);
            $q['time'] = date('H:i:s', $q['unixtime']);
            $q['card_id'] = $q['card'];
            $data[] = $q;
        }
        return $data;

    }

}