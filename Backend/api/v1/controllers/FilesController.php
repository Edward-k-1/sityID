<?php
namespace app\api\v1\controllers;

use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use app\api\v1\models\Locations;
use yii\data\ActiveDataProvider;

class FilesController extends ActiveController
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

        $query = (new \yii\db\Query())->select(['locations_last.*', 'objects.name as object_name'])
            ->from('locations_last')
            ->join('LEFT JOIN', 'objects', 'locations_last.objects_id = objects.id')
            ->orderBy('locations_last.objects_id ASC')->all();

        foreach ($query as $k => $v) {
            $query[$k]['time'] = date('Y.m.d', $query[$k]['unixtime']);
            $query[$k]['date'] = date('H.i.s', $query[$k]['unixtime']);
            $query[$k]['is_active'] = time() - $query[$k]['unixtime'] > ( 60 * 5 ) ? false : true;
        }

        return $query;
    }

    public function actionVoice() {
        $request = \Yii::$app->getRequest()->get();

        $files = scandir("files/stops/");
        unset($files[0]);
        unset($files[1]);
        $r = [];
        foreach ($files as $file) {
            $r[] = ['name' => $file, 'link' => 'http://mak-backend.lt.ua/files/stops/'];
        }
        return $r;
    }

}