<?php

$params = require(__DIR__ . '/params.php');

$config = [
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'components' => [
        'request' => [
            'class' => '\yii\web\Request',
            'enableCookieValidation' => false,
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ],
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'user' => [
            'identityClass' => 'app\models\User',
            'enableAutoLogin' => false,
            'enableSession' => false,
            'loginUrl' => null,
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'useFileTransport' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => require(__DIR__ . '/db.php'),

        'authManager'  => [
            'class' => 'yii\rbac\PhpManager',
           /// 'defaultRoles' => ['guest','user','driver','conductor'],
        ],

        'urlManager' => [
            'enablePrettyUrl' => true,
            'enableStrictParsing' => false,
            'showScriptName' => false,
            'rules' => [
                ['class' => 'yii\rest\UrlRule','controller' => ['auth', 'auth/register', 'auth/confirm'],'tokens' => ['{id}' => '<id:\\w+>']],
                ['class' => 'yii\rest\UrlRule', 'pluralize' => false,'controller' => 'v1/user'],
                ['class' => 'yii\rest\UrlRule', 'pluralize' => false,'controller' => 'v1/cards',  'extraPatterns' => [
                        'OPTIONS <action:\w+>' => 'options'
                ]],
                ['class' => 'yii\rest\UrlRule', 'pluralize' => false,'controller' => ['v1/wallet', 'v1/wallet/pay', 'v1/payment', 'v1/qr', 'v1/help'  ],  'extraPatterns' => [
                    'OPTIONS <action:\w+>' => 'options',
                    'OPTIONS <action:\w+-\w+>' => 'options'
                ]],
                ['class' => 'yii\rest\UrlRule', 'pluralize' => false,'controller' => 'v1/transactions',  'extraPatterns' => [
                    'OPTIONS <action:\w+>' => 'options'
                ]],
                ['class' => 'yii\rest\UrlRule', 'controller' => ['v1_1c/worker',
                    'v1_1c/park',
                    'v1_1c/worker-view',
                    'v1_1c/vehicle',
                    'v1_1c/vehicle-model',
                    'v1_1c/vehicle-model-view',
                    'v1_1c/vehicle-model-type'],
                    'except' => ['delete', 'create', 'update', 'view'],
                    'extraPatterns' => ['POST sync' => 'sync']
                ],
                ['class' => 'yii\rest\UrlRule', 'controller' => ['v1_1c/auth'],
                    'except' => ['delete', 'create', 'update', 'index', 'view'],
                    'tokens' => [
                        '{action}' => '<action:[a-zA-Z0-9\\-]+>',
                    ],
                    'extraPatterns' => ['POST token' => 'token', 'OPTIONS <action:\w+>' => 'options' , 'OPTIONS <action:\w+-\w+>' => 'options']
                ],
            ],
        ],
    ],
    'modules' => [
        'v1' => [
            'class' => 'app\api\v1\Api',
        ],
        'v1_1c' => [
            'class' => 'app\api\modules\v1_1c\Api',
        ],
         'gii' => [
            'class' => 'yii\gii\Module',
            'allowedIPs' => ['127.0.0.1'], // Your allowed ips list

]
    ],

    'params' => $params,
];



/*
if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
    ];
}
*/
return $config;
