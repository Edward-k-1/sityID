<?php
namespace app\api\v1\controllers;


use yii\rest\ActiveController;
use yii\filters\auth\HttpBearerAuth;
use app\api\v1\models\Cards;
use yii\data\ActiveDataProvider;


class OrdersController extends ActiveController
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

//        $query = Cards::find();
//
//        $activeData = new ActiveDataProvider([
//            'query' => $query,
//        ]);
//        return $activeData;
        return 0;
    }

    public function actionGet() {
        $request = \Yii::$app->getRequest()->get();
        $uid = $userId = \Yii::$app->user->identity->id;
        if(isset($request['date'])) {
            $date = date('Y-m-d', strtotime($request['date']));//17-09-2018
        } else {
            $date = date('Y-m-d', time());
        }

        $objects = (new \yii\db\Query())->select('*')->from('objects')->where(['users_id' => $uid])->all();

        foreach ($objects as $ok => $o) {
            $query = (new \yii\db\Query())->select('*')->from('orders')->where(['orders.date' => $date])
                ->orderBy('id ASC')->all();
            $objects[$ok]['order'] = count($query) > 0 ? $query[0] : false;
        }
//        $query = (new \yii\db\Query())->select(['objects.*', 'orders.notice', 'orders.created_by', 'orders.creation_time', 'orders.type', 'orders.id as order_id'])
//            ->from('objects')->join('LEFT JOIN', 'orders', 'objects.id = orders.object_id')
//            ->where(['orders.date' => $date])->andWhere(['objects.users_id' => $uid])->orderBy('objects.id ASC')
//            ->all();

        foreach ($objects as $k => $o) {
            if($o['order']) {
                $ways = (new \yii\db\Query())->select(['order_data.*', 'routes.name'])->from('order_data')
                    ->join('LEFT JOIN', 'routes', 'order_data.route_id = routes.id')
                    ->where(['order_id' => $o['order']['id']])->orderBy('id ASC')->all();
                foreach($ways as $wk => $wv) {
                    $ways[$wk]['from'] = substr($ways[$wk]['time_from'], -8, 5);
                    $ways[$wk]['to'] = substr($ways[$wk]['time_to'], -8, 5);
                    $ways[$wk]['per_from'] = ( substr($ways[$wk]['from'], 0, 2) + substr($ways[$wk]['from'], -2) / 60 ) / 0.24;
                    $ways[$wk]['per_len'] = ( substr($ways[$wk]['to'], 0, 2) + substr($ways[$wk]['to'], -2) / 60 ) / 0.24 - $ways[$wk]['per_from'];
                    unset($ways[$wk]['time_from']);
                    unset($ways[$wk]['time_to']);

                    $ways[$wk]['current'] = $this->getCurrentStat($ways[$wk], $o['id'], $date);
                }

                $objects[$k]['ways'] = $ways;
                $objects[$k]['ways_count'] = count($ways);
                $objects[$k]['route'] = $ways[0]['name'];
            } else {
                $objects[$k]['ways'] = $this->getWeysExpected($objects[$k], $date);
//                $objects[$k]['ways'] = false;
                $objects[$k]['ways_count'] = count($objects[$k]['ways']);
                $objects[$k]['route'] = '';
            }
            $objects[$k]['km'] = $this->getKm($objects[$k]['id'], $date);


        }

        return $objects;

    }

    private function getKm($id, $date) {
        $time_from = strtotime($date);
        $time_to = strtotime($date) + 60 * 60 *24;
        $coords = (new \yii\db\Query())->select('*')->from('locations')
            ->where(['objects_id' => $id])->andWhere('unixtime > ' . $time_from)
            ->andWhere('unixtime < ' . $time_to)
            ->orderBy('unixtime asc')->all();
        $km = 0;
        $last = false;
        foreach ($coords as $c) {
            if($last) {
                $km = $km + $this->getDistanceBetweenTwoPointHaversine($last['latitude'], $last['longitude'], $c['latitude'], $c['longitude']);
            }
            $last = $c;
        }
        return round($km / 1000, 1);

    }

    private function getDistanceBetweenTwoPointHaversine($startPointLat, $startPointLng, $endPointLat, $endPointLng) {
        /**
         * Earth radius in meters
         */
        $R = 6378137;

        $dLat = deg2rad($endPointLat - $startPointLat);
        $dLng = deg2rad($endPointLng - $startPointLng);

        $a = sin($dLat / 2) * sin($dLat / 2) + cos(deg2rad($startPointLat)) * cos(deg2rad($endPointLat)) * sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return ($R * $c);
    }


    private function getWeysExpected($o, $date) {
        $time_from = strtotime($date);
        $time_to = strtotime($date) + 60 * 60 *24;
        $coords = (new \yii\db\Query())->select('*')->from('locations')
            ->where(['objects_id' => $o['id']])->andWhere('unixtime > ' . $time_from)
            ->andWhere('unixtime < ' . $time_to)
            ->orderBy('unixtime asc')->all();

        $routes = (new \yii\db\Query())->select('*')->from('routes')->all();
        $ways = [];
        $last = $time_from;

        foreach ($routes as $r) {
            $last = $time_from;
            $query = (new \yii\db\Query())->select('*')->from('route_points')
                ->where(['route_id' => $r['id']])->orderBy('id ASC')->all();

            if(count($query) < 50) continue;
            $res = [];
            $last = 0;
            foreach ($query as $k => $p) {
                $co = false;
                foreach ($coords as $ck => $c) {
                    if(abs($c['latitude'] - $p['lat']) < 0.002 && abs($c['longitude'] - $p['lng']) < 0.002) {
                        if(count($res) > 1 && $res[count($res) - 1]['unixtime'] > $c['unixtime']) continue;
                        $co = ['index' => $k, 'unixtime' => $c['unixtime'], 'time' => date('H:i', $c['unixtime']) ];
                        $last = $ck;
                        break;
                    }
                }
                if($co) {
                    $res[] = $co;
                }
            }
            if(isset($res[0])) {
                $time_start = ( substr($res[0]['time'], 0, 2) + substr($res[0]['time'], -2) / 60 ) / 0.24;
                $time_len = ( substr($res[count($res) - 1]['time'], 0, 2) + substr($res[count($res) - 1]['time'], -2) / 60 ) / 0.24 - $time_start;
                $per = count($res) / ( count($query ) / 100 );

                $resp = ['start' => $time_start, 'len' => $time_len, 'per' => $per, 'fs_time' => $res[0]['time'], 'ff_time' => $res[count($res) - 1]['time']];

            } else {
                $resp = false;
            }
            if($resp['per'] > 50) {
                $r['current'] = $resp;
                $ways[] = $r;
            }


            $res = [];
            foreach ($query as $k => $p) {
                $co = false;
                foreach ($coords as $ck => $c) {
                    if(abs($c['latitude'] - $p['lat']) < 0.002 && abs($c['longitude'] - $p['lng']) < 0.002) {
                        if(count($res) > 1 && $res[count($res) - 1]['unixtime'] > $c['unixtime']) continue;
                        if($ck < $last) continue;
                        $co = ['index' => $k, 'unixtime' => $c['unixtime'], 'time' => date('H:i', $c['unixtime']) ];
                        break;
                    }
                }
                if($co) {
                    $res[] = $co;
                }
            }
            if(isset($res[0])) {
                $time_start = ( substr($res[0]['time'], 0, 2) + substr($res[0]['time'], -2) / 60 ) / 0.24;
                $time_len = ( substr($res[count($res) - 1]['time'], 0, 2) + substr($res[count($res) - 1]['time'], -2) / 60 ) / 0.24 - $time_start;
                $per = count($res) / ( count($query ) / 100 );

                $resp = ['start' => $time_start, 'len' => $time_len, 'per' => $per, 'fs_time' => $res[0]['time'], 'ff_time' => $res[count($res) - 1]['time']];

            } else {
                $resp = false;
            }
            if($resp['per'] > 50) {
                $r['current'] = $resp;
                $ways[] = $r;
            }


        }
        return $ways;

    }

    private function getCurrentStat($w, $id, $date) {
        $query = (new \yii\db\Query())->select('*')->from('route_points')
            ->where(['route_id' => $w['route_id']])->orderBy('id ASC')->all();
        $time_from = strtotime($date . ' ' . $w['from']) - 60 * 60;
        $time_to = strtotime($date . ' ' . $w['to']) - 60 * 60;
        $coords = (new \yii\db\Query())->select('*')->from('locations')
            ->where(['objects_id' => $id])->andWhere('unixtime > ' . $time_from)
            ->andWhere('unixtime < ' . $time_to)
            ->orderBy('unixtime asc')->all();

//        return [$time_from, $time_to, $coords];

        $res = [];
        foreach ($query as $k => $p) {
            $co = false;
            foreach ($coords as $c) {
                if(abs($c['latitude'] - $p['lat']) < 0.002 && abs($c['longitude'] - $p['lng']) < 0.002) {
                    if(count($res) > 1 && $res[count($res) - 1]['unixtime'] > $c['unixtime']) continue;
                    $co = ['index' => $k, 'unixtime' => $c['unixtime'], 'time' => date('H:i', $c['unixtime']) ];
                    break;
                }
            }
            if($co) {
                $res[] = $co;
            }
        }

        if(isset($res[0])) {
            $time_start = ( substr($res[0]['time'], 0, 2) + substr($res[0]['time'], -2) / 60 ) / 0.24;
            $time_len = ( substr($res[count($res) - 1]['time'], 0, 2) + substr($res[count($res) - 1]['time'], -2) / 60 ) / 0.24 - $time_start;
            $per = count($res) / ( count($query ) / 100 );

            $resp = ['start' => $time_start, 'len' => $time_len, 'per' => $per, 'fs_time' => $res[0]['time'], 'ff_time' => $res[count($res) - 1]['time']];

        } else {
            $resp = false;
        }
        return $resp;
    }

    public function actionCurrent() {

    }

}