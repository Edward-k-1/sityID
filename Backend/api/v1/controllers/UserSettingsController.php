<?php
namespace app\api\v1\controllers;

use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use app\api\v1\models\UserSettings;
use yii\data\ActiveDataProvider;

use yii\db\ActiveRecord;
use yii\web\BadRequestHttpException;


class UserSettingsController extends \yii\rest\ActiveController
{
    public $modelClass = 'app\api\v1\models\UserSettings';

    /* public function behaviors()
     {
         $behaviors = parent::behaviors();
         $behaviors['authenticator'] = [
             'class' => HttpBearerAuth::className()
         ];
         return $behaviors;
     }*/
    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index']);
        // unset($actions['delete'], $actions['create'],$actions['update']);
        return $actions;
    }

    public function actionIndex()
    {
        $query = UserSettings::find();
        $request = \Yii::$app->getRequest()->get();

        if(isset($request['uid']) && isset($request['zone'])) {
            $query = (new \yii\db\Query())
                ->select(['tbl_user_settings.*'])
                ->from('tbl_user_settings')
                ->where(['user_id' => $request['uid']])
                ->all();

            return $query[0];
        }

        if (isset($request['get-all']))        {
            $pagination = false;
        }
        else{
            $pagination = [
                'defaultPageSize' => 1000,
                'pageSizeLimit' => [0, 1000],
            ];
        }
        $activeData = new ActiveDataProvider([
            'query' => $query,
            'pagination' => $pagination
        ]);
        return $activeData;
    }

}