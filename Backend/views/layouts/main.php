<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use app\assets\AppAsset;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
<!--    <link rel="stylesheet" href="/node_modules/angular-material/angular-material.css">-->
<!--    <link rel="stylesheet" href="/node_modules/v-acordion/v-accordion.min.css">-->
<!--    <link rel="stylesheet" href="/node_modules/ui-grid/ui-grid.min.css">-->
<!--    <link rel="stylesheet" href="/node_modules/scrollbar/ng-slim-scroll.css">-->
<!--    <link rel="stylesheet" href="/node_modules/angular-tree-widget/angular-tree-widget.min.css">-->
<!--    <link rel='stylesheet' href='/includes/dist/textAngular.css'>-->
<!--    <link rel='stylesheet' href='/includes/contextmenu.css'>-->
<!--    <link rel='stylesheet' href='/includes/angular-resizable.css'>-->

    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body ng-app="MakAtp" ng-cloak ng-controller="MainController">
<?php $this->beginBody() ?>
<?php echo $content; ?>

<!--<script src="/app/js/jquery-3.1.0.min.js"></script>-->
<!--<script src="/app/js/GridController.js"></script>-->
<!--<script src="/app/js/datef.js"></script>-->
<!--<script src="/app/js/FileSaver.min.js"></script>-->
<!---->
<!--<script src="/node_modules/angular/angular.js"></script>-->
<!--<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.js"></script>-->
<!--<script src="/node_modules/angular/angular-resource.min.js"></script>-->
<!--<script src="/node_modules/angular/angular-cookies.js"></script>-->
<!--<script src="/node_modules/angular-aria/angular-aria.js"></script>-->
<!--<script src="/node_modules/angular-animate/angular-animate.js"></script>-->
<!--<script src="/node_modules/angular-material/angular-material.js"></script>-->
<!--<script src="/node_modules/v-acordion/v-accordion.min.js"></script>-->
<!--<script src="/node_modules/ui-grid/ui-grid.min.js"></script>-->
<!--<script src="/node_modules/scrollbar/ng-slim-scroll.min.js"></script>-->
<!--<script src="/node_modules/angular-animate/angular-animate.min.js"></script>-->
<!--<script src="/node_modules/angular-tree-widget/angular-recursion.js"></script>-->
<!--<script src="/node_modules/angular-tree-widget/angular-tree-widget.min.js"></script>-->
<!--<script src="/node_modules/date.js"></script>-->
<!--<script src="/node_modules/ng-upload/ng-file-upload-all.min.js"></script>-->
<!--<script src="/node_modules/ng-img-crop/ng-img-crop.js"></script>-->
<!---->
<!---->
<!---->
<!--<script src="/app/app.js"></script>-->
<!---->
<!---->
<!--<script src="/app/service/AuthService.js"></script>-->
<!--<script src="/app/service/FullPopupLoader.js"></script>-->
<!--<script src="/app/service/LanguageService.js"></script>-->
<!--<script src="/app/service/CarrierRestService.js"></script>-->
<!--<script src="/app/service/ParksRestService.js"></script>-->
<!--<script src="/app/service/EditedStorageService.js"></script>-->
<!--<script src="/app/service/UserRestService.js"></script>-->
<!--<script src="/app/service/VehicleTypesRestService.js"></script>-->
<!--<script src="/app/service/WorkerViewsRestService.js"></script>-->
<!--<script src="/app/service/WorkersRestService.js"></script>-->
<!--<script src="/app/service/VehiclesRestService.js"></script>-->
<!--<script src="/app/service/VehicleModelsRestService.js"></script>-->
<!--<script src="/app/service/VehicleModelsViewsRestService.js"></script>-->
<!--<script src="/app/service/MonitoringCompanyRestService.js"></script>-->
<!--<script src="/app/service/GraphsRestService.js"></script>-->
<!--<script src="/app/service/RoutesRestService.js"></script>-->
<!--<script src="/app/service/OrdersRestService.js"></script>-->
<!--<script src="/app/service/WorkshiftsOrdersRestService.js"></script>-->
<!--<script src="/app/service/VehiclesWorkshiftRestService.js"></script>-->
<!--<script src="/app/service/ConductorsWorkshiftRestService.js"></script>-->
<!--<script src="/app/service/DriversWorkshiftRestService.js"></script>-->
<!--<script src="/app/service/VehiclesTcdRestService.js"></script>-->
<!--<script src="/app/service/MessagesRestService.js"></script>-->
<!--<script src="/app/service/MedicalServiceRestService.js"></script>-->
<!--<script src="/app/service/CardListenerRestService.js"></script>-->
<!--<script src="/app/service/CheckpointRestService.js"></script>-->
<!--<script src="/app/service/SmartCardRestService.js"></script>-->
<!--<script src="/app/service/RepeatOptionsRestService.js"></script>-->
<!--<script src="/app/service/GlobalStorage.js"></script>-->
<!--<script src="/app/service/OrdersPrinterRestService.js"></script>-->
<!--<script src="/app/service/AlertsRestService.js"></script>-->
<!--<script src="/app/service/WorkshiftsRestService.js"></script>-->
<!--<script src="/app/service/SchedulesRestService.js"></script>-->
<!--<script src="/app/service/FuelConsumptionRestService.js"></script>-->
<!--<script src="/app/service/RouteLengthRestService.js"></script>-->
<!--<script src="/app/service/ZeroFlightRestService.js"></script>-->
<!--<script src="/app/service/WorkshiftCompleteRestService.js"></script>-->
<!--<script src="/app/service/WorkersGraphsRestService.js"></script>-->
<!--<script src="/app/service/WorkersStatesRestService.js"></script>-->
<!--<script src="/app/service/VehiclesStatesRestService.js"></script>-->
<!--<script src="/app/service/SettingsRestService.js"></script>-->
<!--<script src="/app/filters/customUnixTime.js"></script>-->
<!--<script src="/app/filters/filters.js"></script>-->
<!--<script src="/app/controller/LoginController.js"></script>-->
<!--<script src="/app/controller/MainController.js"></script>-->
<!--<script src="/app/controller/MainPageHeaderController.js"></script>-->
<!--<script src="/app/controller/AcordeonController.js"></script>-->
<!--<script src="/app/controller/accordeon/MonitoringController.js"></script>-->
<!--<script src="/app/controller/accordeon/VehiclesController.js"></script>-->
<!--<script src="/app/controller/accordeon/RoutesController.js"></script>-->
<!--<script src="/app/controller/accordeon/OrdersController.js"></script>-->
<!--<script src="/app/controller/accordeon/CarriersParksController.js"></script>-->
<!--<script src="/app/controller/accordeon/WorkersController.js"></script>-->
<!--<script src="/app/controller/accordeon/SmartCardController.js"></script>-->
<!--<script src="/app/controller/accordeon/NotificationController.js"></script>-->
<!--<script src="/app/controller/accordeon/ReportsController.js"></script>-->
<!--<script src="/app/controller/accordeon/UsersController.js"></script>-->
<!--<script src="/app/controller/accordeon/CheckpointsController.js"></script>-->
<!--<script src="/app/controller/accordeon/ScreenController.js"></script>-->
<!--<script src="/app/controller/accordeon/AlertsController.js"></script>-->
<!--<script src="/app/controller/accordeon/DictionaryController.js"></script>-->
<!--<script src="/app/controller/accordeon/CalendarController.js"></script>-->
<!--<script src="/app/controller/accordeon/TechnicalPerformanceIndicatorController.js"></script>-->
<!--<script src="/app/controller/PageContentController.js"></script>-->
<!--<script src="/app/controller/grid/CarriersGridController.js"></script>-->
<!--<script src="/app/controller/grid/ParksGridController.js"></script>-->
<!--<script src="/app/controller/grid/WorkersGridController.js"></script>-->
<!--<script src="/app/controller/grid/WorkersGraphsGridController.js"></script>-->
<!--<script src="/app/controller/grid/OrdersGridController.js"></script>-->
<!--<script src="/app/controller/grid/VehiclesGridController.js"></script>-->
<!--<script src="/app/controller/grid/MonitoringGridController.js"></script>-->
<!--<script src="/app/controller/grid/MonitoringCompanyGridController.js"></script>-->
<!--<script src="/app/controller/grid/WorkersExportController.js"></script>-->
<!--<script src="/app/controller/grid/CheckpointsGridController.js"></script>-->
<!--<script src="/app/controller/grid/orders/EditOrderDialogController.js"></script>-->
<!--<script src="/app/controller/grid/orders/DialogEditWorlshiftComplete.js"></script>-->
<!--<script src="/app/controller/grid/ScreenGridController.js"></script>-->
<!--<script src="/app/controller/grid/AlertsGridController.js"></script>-->
<!--<script src="/app/controller/grid/CalendarGridController.js"></script>-->
<!--<script src="/app/controller/popup/vtkStatusChangeController.js"></script>-->
<!--<script src="/app/controller/popup/mcStatusChangeController.js"></script>-->
<!--<script src="/app/controller/popup/mcWindowController.js"></script>-->
<!--<script src="/app/controller/popup/tcdWindowController.js"></script>-->
<!--<script src="/app/controller/popup/pgWindowController.js"></script>-->
<!--<script src="/app/controller/popup/AddOrderController.js"></script>-->
<!--<script src="/app/controller/popup/GenerateOrdersController.js"></script>-->
<!--<script src="/app/controller/popup/OrdersExportController.js"></script>-->
<!--<script src="/app/controller/popup/AlertEditController.js"></script>-->
<!--<script src="/app/controller/popup/addGraphController.js"></script>-->
<!--<script src="/app/controller/popup/AddRouteController.js"></script>-->
<!--<script src="/app/controller/popup/manageWorkersStatesController.js"></script>-->
<!--<script src="/app/controller/popup/manageVehiclesStatesController.js"></script>-->
<!--<script src="/app/controller/popup/CompleteOrderController.js"></script>-->
<!--<script src="/app/controller/popup/CheckOrdersController.js"></script>-->
<!--<script src="/app/controller/popup/CalendarEditController.js"></script>-->
<!--<script src="/app/controller/popup/ScreenSettingsController.js"></script>-->
<!--<script src="/app/controller/DataLoaderCtrl.js"></script>-->
<!--<script src="/app/controller/grid/SmartCardCreatorGridController.js"></script>-->
<!--<script src="/app/controller/grid/smartcards/EditSmartCardsDialogController.js"></script>-->
<!--<script src="/app/controller/grid/smartcards/AddSmartCardsDialogController.js"></script>-->
<!--<script src="/app/controller/grid/MonitoringTabController.js"></script>-->
<!--<script src="/app/controller/grid/MonitoringWorkshitComplete.js"></script>-->
<!---->
<!---->
<!--<script src="/app/controller/grid/dictionary/FuelConsumptionGridController.js"></script>-->
<!--<script src="/app/controller/grid/dictionary/RoutesLengthGridController.js"></script>-->
<!--<script src="/app/controller/grid/dictionary/ZeroFlightGridController.js"></script>-->
<!--<script src="/app/controller/grid/DictionaryGridController.js"></script>-->
<!---->
<!---->
<!--<script src="/includes/excellentexport.min.js"></script>-->
<!--<script src="/includes/angular-drag-and-drop-lists.js"></script>-->
<!--<!--<script src="/includes/ngDraggable.js"></script>-->-->
<!--<script src="/includes/angular-dragdrop.js"></script>-->
<!--<script src="/includes/angular-resizable.js"></script>-->
<!--<script src="/includes/Sortable.js"></script>-->
<!--<script src="/includes/angular-legacy-sortable.js"></script>-->
<!---->
<!--<link rel="stylesheet" href="/includes/ngDialog.min.css">-->
<!--<link rel="stylesheet" href="/includes/ngDialog-theme-default.min.css">-->
<!--<script src="/includes/ngDialog.js"></script>-->
<!---->
<!---->
<!---->
<!--<script src="/app/directive/select-countdown.js"></script>-->
<!--<script src="/app/directive/ml_sidebar_left.js"></script>-->
<!--<script src="/app/directive/ml_sidebar_bottom.js"></script>-->
<!--<script src="/app/directive/ml_sidebar_right.js"></script>-->
<!--<script src="/app/directive/ml_select.js"></script>-->
<!---->
<!--<script src='/includes/dist/textAngular-rangy.min.js'></script>-->
<!--<script src='/includes/dist/textAngular-sanitize.min.js'></script>-->
<!--<script src='/includes/dist/textAngular.min.js'></script>-->
<!--<script src='/includes/moment-with-locales.min.js'></script>-->
<!--<script src='/includes/contextmenu.js'></script>-->

MAC 2 backend service alpha test


<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
