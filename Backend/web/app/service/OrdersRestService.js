app.service('OrdersRestService', ['$resource','AuthService','$filter','$rootScope','$q', function ($resource,AuthService,$filter,$rootScope,$q) {
  var autorization = 'Bearer ' + AuthService.getToken();
  var headers = {'Authorization': autorization};
  this.updateToken = function()
  {
    autorization = 'Bearer ' + AuthService.getToken();
    headers = {'Authorization': autorization};
  };

  function updateToken() {
      autorization = 'Bearer ' + AuthService.getToken();
      headers = {'Authorization': autorization};
  }

  this.user = $rootScope.UserData;

  this.getResource = function()
  {
    this.updateToken();

    return $resource('/v1/orders/:id', null,
        { 'get':    {method:'GET',isArray:true,headers: headers},
          'query':  {method:'GET', isArray:true,headers: headers},
          'update': { method:'PUT',headers: headers },
          'save':  {method:'POST', headers: headers},
          'delete':  {method:'DELETE', headers: headers},
          'getCurrentOrders':  {method:'get', headers: headers, isArray:true,url:"/v1/orders/get-current-workshifts"}
        });
  };
    //////////////////////// new ////////////////////////////////
    this.loadPublicResources = function() {
        this.updateToken();
        var resources = {
            orders:$resource('/v1/orders2/:id', null, {
                'get':{method:'GET',isArray:false,headers: headers},
                'query':{method:'GET', isArray:true,headers: headers},
                'update':{ method:'PUT',headers: headers },
                'save':{method:'POST', headers: headers},
                'delete':{method:'DELETE', headers: headers},
                'sync_graphs':{method:'GET',isArray:false,headers: headers,url:"/v1/orders2/sync-graphs"}
                }),
            calendar:$resource('/v1/orders-calendar/:id', null, {
                'get':{method:'GET',isArray:false,headers: headers},
                'query':{method:'GET', isArray:true,headers: headers},
                'update':{ method:'PUT',headers: headers },
                'save':{method:'POST', headers: headers},
                'delete':{method:'DELETE', headers: headers}
                })
        }
        return resources;
    };


  //////////////////////////////////////////////////////////
  this.getOrdersResource = function() {
      this.updateToken();

      return $resource('/v1/orders2/:id', null,
          { 'get':    {method:'GET',isArray:false,headers: headers},
              'query':  {method:'GET', isArray:true,headers: headers},
              'update': { method:'PUT',headers: headers },
              'save':  {method:'POST', headers: headers},
              'delete':  {method:'DELETE', headers: headers}
          });
  };
    this.getGlueResource = function() {
        this.updateToken();

        return $resource('/v1/orders-glue/:id', null,
            { 'get':    {method:'GET',isArray:true,headers: headers},
                'query':  {method:'GET', isArray:true,headers: headers},
                'update': { method:'PUT',headers: headers },
                'save':  {method:'POST', headers: headers},
                'delete':  {method:'DELETE', headers: headers}
            });
    };
    this.getWorkshiftsResource = function() {
        this.updateToken();

        return $resource('/v1/workshifts-data/:id', null,
            { 'get':    {method:'GET',isArray:true,headers: headers},
                'query':  {method:'GET', isArray:true,headers: headers},
                'update': { method:'PUT',headers: headers },
                'save':  {method:'POST', headers: headers},
                'delete':  {method:'DELETE', headers: headers}
            });
    };
    this.getRoutesResource = function() {
        this.updateToken();

        return $resource('/v1/routes/:id', null,
            { 'get':    {method:'GET',isArray:true,headers: headers},
                'query':  {method:'GET', isArray:true,headers: headers},
                'update': { method:'PUT',headers: headers },
                'save':  {method:'POST', headers: headers},
                'delete':  {method:'DELETE', headers: headers}
            });
    };
    this.getGraphsDataResource = function() {
        this.updateToken();

        return $resource('/v1/graphs-orders/:id', null,
            { 'get':    {method:'GET',isArray:true,headers: headers},
                'query':  {method:'GET', isArray:true,headers: headers},
                'update': { method:'PUT',headers: headers },
                'save':  {method:'POST', headers: headers},
                'delete':  {method:'DELETE', headers: headers}
            });
    };
    this.getCalendarResource = function() {
        this.updateToken();

        return $resource('/v1/orders-calendar/:id', null,
            { 'get':    {method:'GET',isArray:false,headers: headers},
                'query':  {method:'GET', isArray:true,headers: headers},
                'update': { method:'PUT',headers: headers },
                'save':  {method:'POST', headers: headers},
                'delete':  {method:'DELETE', headers: headers}
            });
    };
    function getWorkersResource() {
        updateToken();

        return $resource('/v1/workers/:id', null,
            { 'get':    {method:'GET',isArray:false,headers: headers},
                'query':  {method:'GET', isArray:true,headers: headers},
                'update': { method:'PUT',headers: headers },
                'save':  {method:'POST', headers: headers},
                'delete':  {method:'DELETE', headers: headers}
            });
    };
    function getVehiclesResource() {
        updateToken();

        return $resource('/v1/vehicles/:id', null,
            { 'get':    {method:'GET',isArray:false,headers: headers},
                'query':  {method:'GET', isArray:true,headers: headers},
                'update': { method:'PUT',headers: headers },
                'save':  {method:'POST', headers: headers},
                'delete':  {method:'DELETE', headers: headers}
            });
    };
    this.getWorkersTimeResource = function() {
        updateToken();

        return $resource('/v1/workers-job-time/:id', null,
            { 'get':    {method:'GET',isArray:false,headers: headers},
                'query':  {method:'GET', isArray:true,headers: headers},
                'update': { method:'PUT',headers: headers },
                'save':  {method:'POST', headers: headers},
                'delete':  {method:'DELETE', headers: headers},
                'GetWorkersJobWeekTime': {method:'GET',isArray:false,headers: headers,url:"/v1/workers-job-time/get-workers-job-work-week-time"},
                'GetWorkersJobMonthTime': {method:'GET',isArray:false,headers: headers,url:"/v1/workers-job-time/get-workers-job-month-time"}
            });
    };

    this.getWorkersTime = function(id) {

    };

    this.newOrder = function(route, graph, type) {
      var order = {
          date: $filter('date')(new Date(), 'yyyy-MM-dd'),
          route: route,
          graph: graph,
          graph_data:undefined,
          graph_type:undefined,
          type: type,
          status: {
              finished: false,
              state: 0
          },
          workshift_1: {
              time: {
                  from:undefined,
                  to:undefined,
                  art:25,
                  dinner: {
                      1: {
                          from:undefined,
                          duration:undefined,
                          place:undefined
                      },
                      2: {
                          from:undefined,
                          duration:undefined,
                          place:undefined
                      }
                  },
                  checkpoint: {
                      start: {
                          time:undefined,
                          place:undefined
                      },
                      end: {
                          time:undefined,
                          place:undefined
                      }
                  },
                  work_time:undefined
              },
              driver: {
                  id: 0,
                  data: {
                      name: undefined,
                      bn: undefined
                  }
              },
              conductor: {
                  id: 0,
                  data: {
                      name: undefined,
                      bn: undefined
                  }
              },
              vehicle: {
                  id:undefined,
                  data: {
                      bn:undefined,
                      sn:undefined,
                      model:undefined
                  },
                  tep: {
                      fuelConsume:undefined,
                  },
                  use:undefined
              },
              data: {
                  path:undefined,
                  rolls:undefined
              },
              change_data: {
                  route:undefined,
                  graph:undefined,
                  time: {
                      from:undefined,
                      to: undefined,
                      dinner: {
                          1: {
                              from:undefined,
                              duration:undefined,
                              place:undefined
                          },
                          2: {
                              from:undefined,
                              duration:undefined,
                              place:undefined
                          }
                      },
                      checkpoint: {
                          start: {
                              time:undefined,
                              place:undefined
                          },
                          end: {
                              time:undefined,
                              place:undefined
                          }
                      },
                      work_time:undefined
                  }
              }
          },
          user: undefined,

          setDate: function(input) {
              this.date = $filter('date')(input, 'yyyy-MM-dd');
          },
          setGraphType: function(input) {
              this.graph_type = input;
          },
          setState: function(input) {
              this.status.state = input;
          },
          countTep: function() {

          },
          setUser: function(userObject) {
              this.user = {
                  id: userObject.id
              }
          }
      };

      if(order.type > 0) {
          order.workshift_2 = {
              time: {
                  from:undefined,
                  to:undefined,
                  art:undefined,
                  dinner: {
                      1: {
                          from:undefined,
                          duration:undefined,
                          place:undefined
                      },
                      2: {
                          from:undefined,
                          duration:undefined,
                          place:undefined
                      }
                  },
                  checkpoint: {
                      start: {
                          time:undefined,
                          place:undefined
                      },
                      end: {
                          time:undefined,
                          place:undefined
                      }
                  },
                  work_time:undefined
              },
              driver: {
                  id: 0,
                  data: {
                      name: undefined,
                      bn: undefined
                  }
              },
              conductor: {
                  id: 0,
                  data: {
                      name: undefined,
                      bn: undefined
                  }
              },
              vehicle: {
                  id:undefined,
                  data: {
                      bn:undefined,
                      sn:undefined,
                      model:undefined
                  },
                  tep: {
                      fuelConsume:undefined,
                  },
                  use:undefined
              },
              data: {
                  path:undefined,
                  rolls:undefined
              }
          };
      }

      return order;
  };

  function OrdersExeption(message, error) {
      this.message = message;
      this.name = "Помилка збереження наряду";
      this.data = error;
  }

  this.deleteSave = function(r, g, d, o) {
      var order_res = this.getOrdersResource();
      var glue_res = this.getGlueResource();
      var workshift_res = this.getWorkshiftsResource();
      var d = $filter('date')(d, 'yyyy-MM-dd');
      order_res.query({route:r, graph:g, date:d}, function(data, response) {
          // console.log('fdfdfd',data);
          order_res.delete({id:data[0].id});
          glue_res.delete({id:data[0].glue_id});
          for(var i = 0; i < data.length; i++) {
              workshift_res.delete({id:data[i].wid});
          }
      }, function(error) {console.log(error);});
      this.save(o);
  };

  this.deleteByDate = function(r, g, d) {
      var order_res = this.getOrdersResource();
      var glue_res = this.getGlueResource();
      var workshift_res = this.getWorkshiftsResource();
      var d = $filter('date')(d, 'yyyy-MM-dd');
      order_res.query({route:r, graph:g, date:d}, function(data, response) {
          // console.log('fdfdfd',data);
          order_res.delete({id:data[0].id});
          glue_res.delete({id:data[0].glue_id});
          for(var i = 0; i < data.length; i++) {
              workshift_res.delete({id:data[i].wid});
          }
      }, function(error) {console.log(error);});
  };

  this.save = function(object) {

      var workers_attached = '/' + object.workshift_1.driver.id + '//' + object.workshift_1.conductor.id + '/';

      if(object.workshift_2 && object.workshift_2.driver && object.workshift_2.conductor) {
          workers_attached = workers_attached + '/' + object.workshift_2.driver.id + '//' + object.workshift_2.conductor.id + '/';
      }

      var glue_item = {
          w1_time: object.workshift_1.time.work_time.full,
          w2_time: 0,
          workers_attached: workers_attached,
          tep_id:0
      };
      if(object.workshift_2) {
          glue_item.w2_time = object.workshift_2.time.work_time.full;
      }

      console.log('glue_item', glue_item);

      var glue_res = this.getGlueResource();
      var order_res = this.getOrdersResource();
      var workshift_res = this.getWorkshiftsResource();

      glue_res.save(glue_item, function(data, response) {
          console.log('glue_item-saved', data);

          var order_item = {
              route: object.route,
              graph: object.graph,
              status: 0,
              state: object.status.state,
              is_finished: 0,
              glue_id: data.id,
              action_date: object.date,
              type: object.type,
              graph_type: object.graph_type,
              time_start: $filter('date')(object.workshift_1.time.from, 'HH:mm:ss'),
              time_to: $filter('date')(object.workshift_1.time.to, 'HH:mm:ss'),
              time_from: '00:00:00',
              time_end: '00:00:00',
              created_at: Math.round((new Date()).getTime() / 1000),
              updated_at: Math.round((new Date()).getTime() / 1000),
              author_id: object.user.id,
              updater_id: object.user.id
          };



          var workshift_item = {
              number: 1,
              glue_id: data.id,
              veh: object.workshift_1.vehicle.id,
              drv: object.workshift_1.driver.id,
              con: object.workshift_1.conductor.id,
              time_start: $filter('date')(object.workshift_1.time.from, 'HH:mm:ss'),
              time_end: $filter('date')(object.workshift_1.time.to, 'HH:mm:ss'),
              time_d1: $filter('date')(object.workshift_1.time.dinner[1].from, 'HH:mm:ss'),
              time_d2: $filter('date')(object.workshift_1.time.dinner[2].from, 'HH:mm:ss'),
              route: object.route,
              graph: object.graph,
              c_route: object.workshift_1.change_data.route ? object.workshift_1.change_data.route : '0',
              c_graph: object.workshift_1.change_data.graph ? object.workshift_1.change_data.graph : 0
          };

          workshift_res.save(workshift_item, function(data, response) {
              console.log('workshift_item-saved', data);
          }, function(error) {throw new OrdersExeption('Помилка збереження Зміни', error);})

          if(object.workshift_2) {
              var workshift2_item = {
                  number: 2,
                  glue_id: data.id,
                  veh: object.workshift_2.vehicle.id,
                  drv: object.workshift_2.driver.id,
                  con: object.workshift_2.conductor.id,
                  time_start: $filter('date')(object.workshift_2.time.from, 'HH:mm:ss'),
                  time_end: $filter('date')(object.workshift_2.time.to, 'HH:mm:ss'),
                  time_d1: $filter('date')(object.workshift_2.time.dinner[1].from, 'HH:mm:ss'),
                  time_d2: $filter('date')(object.workshift_2.time.dinner[2].from, 'HH:mm:ss'),
                  route: object.route,
                  graph: object.graph,
                  c_route: '0',
                  c_graph: 0
              };
              workshift_res.save(workshift2_item, function(data, response) {
                  console.log('workshift_item-saved2', data);
              }, function(error) {throw new OrdersExeption('Помилка збереження Зміни', error);})
          }
          // if(object.type == 1) {
          //     order_item.time_from = $filter('date')(object.workshift_2.time.from, 'HH:mm:ss');
          //     order_item.time_end = $filter('date')(object.workshift_2.time.to, 'HH:mm:ss');
          //
          //     workshift_item.change1 = object.workshift_2.driver.id;
          //     workshift_item.change2 = object.workshift_2.conductor.id
          // }
          // if(object.type > 1) {
          //     order_item.time_from = $filter('date')(object.workshift_2.time.from, 'HH:mm:ss');
          //     order_item.time_end = $filter('date')(object.workshift_2.time.to, 'HH:mm:ss');
          //
          //     workshift_item.change1 = object.changeData.route;
          //     workshift_item.change2 = object.changeData.graph;
          // }

          console.log('order_item', order_item);
          console.log('workshift_item', workshift_item);


          order_res.save(order_item, function(data, response) {
              console.log('order_item-saved', data);
          }, function(error) {throw new OrdersExeption('Помилка збереження Наряду', error);});






      }, function(error) {throw new OrdersExeption('Помилка збереження Клею', error);});


  };

  function getWorker(id) {
      var worker_res = getWorkersResource();
      return worker_res.get({id:id});
  }

  function getVehicle(id) {
      var vehicle_res = getVehiclesResource();
      return vehicle_res.get({id:id});
  }


  this.createOrder = function(data) {
      //console.log('dddd',data);
      var order = {
          date: data.action_date,
          route: data.route,
          graph: data.graph,
          graph_type: data.graph_type,
          type: data.type,
          status: {
              finished: data,
              state: data
          },
          vehicle: {
              id:data.veh,
              data: {
                  bn:undefined,
                  sn:undefined,
                  model:undefined
              },
              tep: {
                  fuelConsume:undefined,
              }
          },
          user: data.updater_id,

          setDate: function(input) {
              this.date = $filter('date')(input, 'yyyy-MM-dd');
          },
          setGraphType: function(input) {
              this.graph_type = input;
          },
          setState: function(input) {
              this.status.state = input;
          },
          countTep: function() {

          },
          setUser: function(userObject) {
              this.user = {
                  id: userObject.id
              }
          }
      };
      order.vehicle.data = getVehicle(order.vehicle.id);
      switch(data.type){
          case '0':
              order.workshift_1 = {
                  time: {
                      from:data.time_start,
                      to:data.time_to
                  },
                  driver: {
                      id: data.drv,
                      data: {
                          name: undefined,
                          bn: undefined
                      }
                  },
                  conductor: {
                      id: data.con,
                      data: {
                          name: undefined,
                          bn: undefined
                      }
                  },
                  data: {
                      path:undefined,
                      rolls:undefined
                  }
              };
              order.workshift_1.driver.data = getWorker(order.workshift_1.driver.id);
              break;
          default:
              order.workshift_1 = {
                  time: {
                      from:data.time_start,
                      to:data.time_to
                  },
                  driver: {
                      id: data.drv,
                      data: {
                          name: undefined,
                          bn: undefined
                      }
                  },
                  conductor: {
                      id: data.con,
                      data: {
                          name: undefined,
                          bn: undefined
                      }
                  },
                  tepData: {
                      path:undefined,
                      rolls:undefined
                  }
              };
              order.workshift_2 = {
                  time: {
                      from:data.time_from,
                      to:data.time_end
                  },
                  driver: {
                      id: data.change1,
                      data: {
                          name: undefined,
                          bn: undefined
                      }
                  },
                  conductor: {
                      id: data.change2,
                      data: {
                          name: undefined,
                          bn: undefined
                      }
                  },
                  tepData: {
                      path:undefined,
                      rolls:undefined
                  }
              };
              order.workshift_1.driver.data = getWorker(order.workshift_1.driver.id);
              order.workshift_1.conductor.data = getWorker(order.workshift_1.conductor.id);

              order.workshift_2.driver.data = getWorker(order.workshift_2.driver.id);
              order.workshift_2.conductor.data = getWorker(order.workshift_2.conductor.id);
              break;
          case '22':
              order.workshift_1 = {
                  time: {
                      from:data.time_start,
                      to:data.time_to
                  },
                  driver: {
                      id: data.drv,
                      data: {
                          name: undefined,
                          bn: undefined
                      }
                  },
                  conductor: {
                      id: data.con,
                      data: {
                          name: undefined,
                          bn: undefined
                      }
                  },
                  data: {
                      path:undefined,
                      rolls:undefined
                  }
              };
              order.workshift_2 = {
                  time: {
                      from:data.time_from,
                      to:data.time_end
                  }
              };
              order.changeData = {
                  route:data.change1,
                  graph:data.change2,
                  tepData: {
                      path:undefined,
                      rolls:undefined
                  }
              };
              order.workshift_1.driver.data = getWorker(order.workshift_1.driver.id);
              order.workshift_1.conductor.data = getWorker(order.workshift_1.conductor.id);
              break;
          case '32':
              order.workshift_1 = {
                  time: {
                      from:data.time_start,
                      to:data.time_to
                  },
                  driver: {
                      id: data.drv,
                      data: {
                          name: undefined,
                          bn: undefined
                      }
                  },
                  conductor: {
                      id: data.con,
                      data: {
                          name: undefined,
                          bn: undefined
                      }
                  },
                  data: {
                      path:undefined,
                      rolls:undefined
                  }
              };
              order.workshift_2 = {
                  time: {
                      from:data.time_from,
                      to:data.time_end
                  }
              };
              order.changeData = {
                  route:data.change1,
                  graph:data.change2,
                  tepData: {
                      path:undefined,
                      rolls:undefined
                  }
              };
              order.workshift_1.driver.data = getWorker(order.workshift_1.driver.id);
              order.workshift_1.conductor.data = getWorker(order.workshift_1.conductor.id);
              break;
      }
    return order;
  };

  // this.loadOrders = function(date) {
  //     if(!date) {
  //         date = new Date();
  //     }
  //     date = $filter('date')(date, 'yyyy:MM:dd');
  //
  //     var gr_res = this.getRoutesResource();
  //     var orders_res = this.getOrdersResource();
  //     var glue_res = this.getGlueResource();
  //     var workshift_res = this.getWorkshiftsResource();
  //
  //
  //     var orders = [];
  //
  //
  //     gr_res.query({routes2:0,parks_id:this.user.pid}, function(data, response) {
  //         console.log('routes2', data);
  //         data.forEach(function(route) {
  //
  //            orders_res.get({route:route.r, graph:route.g, date:date}, function(data, response) {
  //                if(data[0]) {
  //                    var orders_data = createOrder(data[0]);
  //                } else {
  //                    var orders_data = data[0];
  //                }
  //
  //                var obj = {
  //                    route: route.r,
  //                    graph: route.g,
  //                    order: orders_data
  //                };
  //                console.log('od', obj);
  //                orders.push(obj);
  //            }, function(error) {throw new OrdersExeption('Помилка завантаження наряду на '+route.r+'/'+route.g, error);});
  //         });
  //           console.log('all orders', orders);
  //
  //     }, function(error) {throw new OrdersExeption('Помилка завантаження графіків', error);});
  // };


}
]);
