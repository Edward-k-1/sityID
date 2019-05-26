<?php
namespace app\api\v1\controllers;


use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use app\api\v1\models\Cards;
use yii\data\ActiveDataProvider;


class CardsController extends ActiveController
{
    public $modelClass = 'app\api\v1\models\Cards';
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
                'Access-Control-Request-Method' => ['POST','PUT','GET','OPTIONS'],
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

//        $query = Cards::find();
//
//        $activeData = new ActiveDataProvider([
//            'query' => $query,
//        ]);
//        return $activeData;
        $query = (new \yii\db\Query())->select('*')->from('mac_cards')->all();
        return $query;
    }
}
