/**
 * Created by walex on 28.11.16.
 */
app.controller('GenerateOrdersController', ['$scope','$http','$filter','data','OrdersRestService',"FullPopupLoader",
    'customUnixTimeFilter',"$timeout","$mdDialog","$rootScope",
    function ($scope,$http,$filter,data,OrdersRestService,FullPopupLoader,customUnixTimeFilter,$timeout,$mdDialog,$rootScope) {

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        $scope.data = data;
        $scope.lang = $rootScope.lang;

        $scope.selectedDate = new Date();
        $scope.userId = 0;

        $scope.generateForDate = function() {
            for(var i = 0; i < $scope.data.length; i++) {
                // var item = {
                //     "graphs_id": $scope.data[i].order.graphs_id,
                //     "schedules_id": $scope.data[i].order.schedules_id,
                //     "action_date": $scope.selectedDate.getTime()/1000 + 60*60*24,
                //     "workshifts_orders_id": $scope.data[i].order.workshifts_orders_id,
                //     "created_at": $scope.data[i].order.created_at,
                //     "updated_at": $scope.data[i].order.updated_at,
                //     "author_id": $scope.data[i].order.author_id,
                //     "updater_id": $scope.data[i].order.updater_id
                // };

                var order_item = {
                    route: $scope.data[i].order_data.route,
                    graph: $scope.data[i].order_data.graph,
                    status: 0,
                    state: 1,
                    is_finished: 0,
                    glue_id: $scope.data[i].order_data.glue_id,
                    action_date: $filter('date')($scope.selectedDate, 'yyyy-MM-dd'),
                    type: $scope.data[i].order_data.type,
                    graph_type: $scope.data[i].order_data.graph_type,
                    time_start: $scope.data[i].order_data.time_start,
                    time_to: $scope.data[i].order_data.time_to,
                    time_from: $scope.data[i].order_data.time_from,
                    time_end: $scope.data[i].order_data.time_end,
                    created_at: Math.round((new Date()).getTime() / 1000),
                    updated_at: Math.round((new Date()).getTime() / 1000),
                    author_id: $scope.data[i].order_data.author_id,
                    updater_id: $scope.data[i].order_data.updater_id
                };

                var resource = OrdersRestService.getOrdersResource();
                resource.save(order_item, function(data, response) {

                }, function(error) {console.log(error);});
            }
            $mdDialog.hide();
        }

    }]);