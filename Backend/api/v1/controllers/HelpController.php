<?php
/**
 * Created by PhpStorm.
 * User: EdikU
 * Date: 01.04.2019
 * Time: 13:44
 */
namespace app\api\v1\controllers;

use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use app\api\v1\models\Help;
use yii\data\ActiveDataProvider;

class HelpController extends ActiveController
{
    public $modelClass = 'app\api\v1\models\Help';
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

   /* public function actionIndex()
    {
        $request = \Yii::$app->getRequest()->get();
        $user = \Yii::$app->user->identity;

        return ['status' => true, 'help' => $user->help, 'type' => $user->type];
    }*/

    public function actionIndex()
    {
        $request = \Yii::$app->getRequest()->get();

        $query = Help::find();

        $activeData = new ActiveDataProvider([
            'query' => $query,
        ]);
        return $activeData;
        $query = (new \yii\db\Query())->select('*')->from('ci_user_help')->all();
        return $query;
    }

    public function actionHelps() {
        $userId = \Yii::$app->user->identity->id;
        $userAgent = \Yii::$app->request->userAgent;
        $request = \Yii::$app->getRequest()->post();

        $data = (new \yii\db\Query())->select('*')->from('ci_user_help')
            ->where(['text' => $request['text']])->all();

        if(count($data) > 0) {
            return ['status' => false, 'reason' => 'Дане питання вже було задане'];
        }

        $sql = "insert into ci_user_help (email, text, user_agent, user_id ) values
        ( '". $request['email']."', '".$request['text']."', '".$userAgent."' ,$userId )";
        $c = \Yii::$app->db->createCommand($sql)->execute();

        if($c) {
            return ['status' => true];
        } else {
            return ['status' => false, 'reason' => 'Сталася внутрішня помилка'];
        }
    }
    public function actionHelp() {
        $userId = \Yii::$app->user->identity->id;

        $data = (new \yii\db\Query())->select('ci_user_help.*')->from('ci_user_help')
            ->where(['user_id' => $userId])->orderBy('ci_user_help.id DESC')->all();

        return ['status' => true, 'data'=> $data];

    }


}
