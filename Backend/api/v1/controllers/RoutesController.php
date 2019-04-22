<?php
namespace app\api\v1\controllers;

use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use app\api\v1\models\Locations;
use yii\data\ActiveDataProvider;

class RoutesController extends ActiveController
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
        unset($actions['delete'], $actions['create'],$actions['update']);

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

    public function actionAdd() {
        $request = \Yii::$app->getRequest()->post();

        $route_data = json_decode($request['route']);
        $points_data = json_decode($request['points']);

        $sql0 = "SELECT * FROM routes WHERE name = '$route_data->name' OR full_name = '$route_data->full_name'";
        $pre = (new \yii\db\Query())->select('*')->from('routes')
            ->where("name = '$route_data->name' OR full_name = '$route_data->full_name'")
            ->all();
        if(isset($pre[0])) {
            return ['success' => false, 'reason' => "data exist"];
        }

        $uid = $userId = \Yii::$app->user->identity->id;
        $sql = "insert into routes (name, full_name, type, notice, created_by) values ('".$route_data->name."', '".$route_data->full_name."', ".substr($route_data->type, -1).", '".$route_data->notice."', $uid)";
        \Yii::$app->db->createCommand($sql)->execute();

        $ids = (new \yii\db\Query())->select('*')->from('routes')
            ->where("name = '".$route_data->name."'")->limit(1)->all();
        $id = $ids[0]['id'];
        $route_id = $id;
        $i = 1;
        foreach ($points_data as $point) {
            $sql = "insert into route_points (lat, lng, route_id, `order`) values ('".$point->latitude."', '".$point->longitude."', ".$id.", ".$i.")";
            \Yii::$app->db->createCommand($sql)->execute();
            $i++;
        }

        if(isset($request['stops'])) {
            $stops = json_decode($request['stops']);
            $uid = $userId = \Yii::$app->user->identity->id;
            $sql0 = "DELETE FROM route_stops WHERE route_id = $id";
            \Yii::$app->db->createCommand($sql0)->execute();

            $i = 1;
            $rs = [];
            foreach ($stops as $stp) {
                $con = isset($stp->content) ? $stp->content : '';
                $rev_lat = isset($stp->reverse) ? $stp->reverse->lat : 0;
                $rev_lng = isset($stp->reverse) ? $stp->reverse->lng : 0;
                if(!isset($stp->id)) {
                    $sql1 = "INSERT INTO stops (name, voice, lat, lng, rev_lat, rev_lng, created_by) VALUES ('$stp->name', '$con', $stp->lat, $stp->lng, $rev_lat, $rev_lng, $uid)";
                    \Yii::$app->db->createCommand($sql1)->execute();

                    $idss = (new \yii\db\Query())->select('*')->from('stops')
                        ->where(['name' => $stp->name, 'voice' => $con])->limit(1)->all();
                    $ids = $idss[0]['id'];
                    $stop = ['id' => $ids, 'order' => $i];
                    $stp->id = $ids;
                } else {
                    $sql1 = "UPDATE stops SET name = '$stp->name', lat = $stp->lat, lng = $stp->lng, voice = '".$con."', rev_lat = $rev_lat, rev_lng = $rev_lng WHERE id = $stp->id";
                    \Yii::$app->db->createCommand($sql1)->execute();
                    $stop = ['id' => $stp->id, 'order' => $i];
                }
                $sql3 = "INSERT INTO route_stops (route_id, stop_id, `order`) VALUES ($id, ".$stop['id'].", $i)";
                \Yii::$app->db->createCommand($sql3)->execute();
                $i++;
                $rs[] = $stp;
            }
        }

        return ['success' => true, 'id' => $id];
    }

    public function actionGet() {
        $request = \Yii::$app->getRequest()->get();

        $query = (new \yii\db\Query())->select('*')->from('routes')->where(['id' => $request['id']])->all();

        $points = (new \yii\db\Query())->select('*')->from('route_points')->where(['route_id' => $query[0]['id']])
            ->orderBy('order ASC')->all();

        $types = ['linear-0', 'circle-1', 'special-2'];
        foreach ($points as $k => $p) {
            $points[$k]['latitude'] = $points[$k]['lat'];
            $points[$k]['longitude'] = $points[$k]['lng'];
            $points[$k]['icon'] = './assets/img/route-point.ico';
            unset($points[$k]['lat']);
            unset($points[$k]['lng']);


        }

        $query[0]['points'] = $points;
        $query[0]['type'] = $types[$query[0]['type']];

        $stops = (new \yii\db\Query())->select(['route_stops.*', 'stops.name', 'stops.voice as content', 'stops.lat', 'stops.lng', 'stops.rev_lat', 'stops.rev_lng', 'stops.id as sid'])
            ->from('route_stops')
            ->join('LEFT JOIN', 'stops', 'stops.id = route_stops.stop_id')
            ->where(['route_stops.route_id' => $request['id']])
            ->orderBy('route_stops.order ASC')->all();

        foreach ($stops as $k =>$s) {
            $stops[$k]['icon'] = './assets/img/stop-icon.png';
            $stops[$k]['id'] = $stops[$k]['sid'];
            if($stops[$k]['rev_lat'] > 0 && $stops[$k]['rev_lng'] > 0) {
                $stops[$k]['reverse'] = ['lat' => $stops[$k]['rev_lat'], 'lng' => $stops[$k]['rev_lng']];
            }
            unset($stops[$k]['sid']);
        }
        $query[0]['stops'] = $stops;
        return $query[0];
    }

    public function actionEdit() {
        $request = \Yii::$app->getRequest()->post();

        $route_data = json_decode($request['route']);
        $points_data = json_decode($request['points']);
        $id = json_decode($request['id']);

        $sql = "UPDATE routes SET name = '$route_data->name', full_name = '$route_data->full_name', type = '".substr($route_data->type, -1)."', notice = '$route_data->notice' WHERE id = $id";
        \Yii::$app->db->createCommand($sql)->execute();

        $sql2 = "DELETE FROM route_points WHERE route_id = $id";
        \Yii::$app->db->createCommand($sql2)->execute();

        $i = 1;
        foreach ($points_data as $point) {
            $sql = "insert into route_points (lat, lng, route_id, `order`) values ('".$point->latitude."', '".$point->longitude."', ".$id.", ".$i.")";
            \Yii::$app->db->createCommand($sql)->execute();
            $i++;
        }

        if(isset($request['stops'])) {
            $stops = json_decode($request['stops']);
            $uid = $userId = \Yii::$app->user->identity->id;
            $sql0 = "DELETE FROM route_stops WHERE route_id = $id";
            \Yii::$app->db->createCommand($sql0)->execute();

            $i = 1;
            $rs = [];
            foreach ($stops as $stp) {
                $con = isset($stp->content) ? $stp->content : '';
                $rev_lat = isset($stp->reverse) ? $stp->reverse->lat : 0;
                $rev_lng = isset($stp->reverse) ? $stp->reverse->lng : 0;
                if(!isset($stp->id)) {
                    $sql1 = "INSERT INTO stops (name, voice, lat, lng, rev_lat, rev_lng, created_by) VALUES ('$stp->name', '$con', $stp->lat, $stp->lng, $rev_lat, $rev_lng, $uid)";
                    \Yii::$app->db->createCommand($sql1)->execute();

                    $idss = (new \yii\db\Query())->select('*')->from('stops')
                        ->where(['name' => $stp->name, 'voice' => $con])->limit(1)->all();
                    $ids = $idss[0]['id'];
                    $stop = ['id' => $ids, 'order' => $i];
                    $stp->id = $ids;
                } else {
                    $sql1 = "UPDATE stops SET name = '$stp->name', lat = $stp->lat, lng = $stp->lng, voice = '$con', rev_lat = $rev_lat, rev_lng = $rev_lng WHERE id = $stp->id";
                    \Yii::$app->db->createCommand($sql1)->execute();
                    $stop = ['id' => $stp->id, 'order' => $i];
                }
                $sql3 = "INSERT INTO route_stops (route_id, stop_id, `order`) VALUES ($id, ".$stop['id'].", $i)";
                \Yii::$app->db->createCommand($sql3)->execute();
                $i++;
                $rs[] = $stp;
            }
        }

        return ['success' => true, 'stps' => $rs];
    }

    public function actionRemove() {
        $request = \Yii::$app->getRequest()->post();
        $id = $request['id'];

        $sql2 = "DELETE FROM routes WHERE id = $id";
        \Yii::$app->db->createCommand($sql2)->execute();

        $sql2 = "DELETE FROM route_points WHERE route_id = $id";
        \Yii::$app->db->createCommand($sql2)->execute();

        return ['success' => true];
    }
}