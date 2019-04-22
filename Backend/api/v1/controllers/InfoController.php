<?php
namespace app\api\v1\controllers;

use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use app\api\v1\models\Locations;
use yii\data\ActiveDataProvider;

class InfoController extends ActiveController
{
    public $modelClass = 'app\api\v1\models\Locations';
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

        $query = (new \yii\db\Query())->select(['routes.*', 'users.username'])
            ->from('routes')
            ->join('LEFT JOIN', 'users', 'routes.created_by = users.id')
            ->orderBy('id ASC')->all();

        $types = ['Лінійний', 'Кільцевий', 'Спеціальний'];
        foreach ($query as $k => $v) {
//            $query[$k]['creation_time'] = date('Y.m.d', $query[$k]['creation_time']) . date('H.i.s', $query[$k]['creation_time']);
            $query[$k]['created_by'] = $query[$k]['username'];
            unset($query[$k]['username']);
            $query[$k]['type'] = $types[$query[$k]['type']];

        }

        return $query;
    }

    public function actionMenu() {
        $objects = (new \yii\db\Query())->select('count(*) as count')->from('objects')->all();
        $routes = (new \yii\db\Query())->select('count(*) as count')->from('routes')->all();
        $from = time() - 60 * 60 * 5;
        $to = $from + 60 * 60 * 19;
        $transactions = (new \yii\db\Query())->select('count(*) as count')->from('transactions')
            ->where('transactions.unixtime > '.$from)->andWhere('transactions.unixtime < '.$to)->all();

        return ['objects' => $objects['count'], 'routes' => $routes['count'], 'transactions' => $transactions['count']];
    }


}