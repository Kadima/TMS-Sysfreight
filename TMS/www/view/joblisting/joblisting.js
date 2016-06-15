'use strict';
app.controller('JoblistingListCtrl', ['$scope', '$state', '$ionicLoading', '$ionicPopup', '$ionicFilterBar', '$ionicActionSheet', 'ApiService',
  function($scope, $state, $ionicLoading, $ionicPopup, $ionicFilterBar, $ionicActionSheet, ApiService) {
    var filterBarInstance,
      dataResults = new Array();
    // $scope.Search = {
    //   BookingNo: ''
    // };
    $scope.returnMain = function() {
      $state.go('index.main', {}, {
        reload: true
      });
    };
    // $('#txt-BookingNo').on('keydown', function(e) {
    //   if (e.which === 9 || e.which === 13) {
    //     getBookingNo();
    //   }
    // });
    var getBookingNo = function() {
      if (dbTms) {
        dbTms.transaction(function(tx) {
          dbSql = 'select * from Tobk1_Accept';
          tx.executeSql(dbSql, [], function(tx, results) {
            if (results.rows.length > 0) {
              for (var i = 0; i < results.rows.length; i++) {
                var tobk1_acc = results.rows.item(i);
                var jobs = [{
                  bookingno: tobk1_acc.BookingNo,
                  JobNo: tobk1_acc.JobNo,
                  action: is.equal(tobk1_acc.JobType, 'DE') ? 'Deliver' : 'Collect',
                  amt: tobk1_acc.TotalPcs + ' ' + tobk1_acc.UomCode,
                  time: checkDatetime(tobk1_acc.DeliveryEndDateTime),
                  code: tobk1_acc.CustomerCode,
                  customer: {
                    name: tobk1_acc.CustomerName,
                    address: tobk1_acc.ToAddress1 + tobk1_acc.ToAddress2 + tobk1_acc.ToAddress3 + tobk1_acc.ToAddress4
                  },
                  status: {
                    inprocess: is.equal(tobk1_acc.CompletedFlag, 'Y') ? false : true,
                    success: is.equal(tobk1_acc.CompletedFlag, 'Y') ? true : false,
                    failed: false
                  }
                }];
                dataResults = dataResults.concat(jobs);
                $scope.jobs = dataResults;
              }
            } else {
              var strUri = '/api/tms/tobk1?DriverCode=' + sessionStorage.getItem('strDriverCode');
              ApiService.GetParam(strUri, true).then(function success(result) {
                var results = result.data.results;
                if (is.not.empty(results)) {
                  for (var intI = 0; intI < results.length; intI++) {
                    var tobk1_acc = results[intI];
                    var jobs = [{
                      bookingno: tobk1_acc.BookingNo,
                      JobNo: tobk1_acc.JobNo,
                      action: is.equal(tobk1_acc.JobType, 'DE') ? 'Deliver' : 'Collect',
                      amt: tobk1_acc.TotalPcs + ' ' + tobk1_acc.UomCode,
                      time: checkDatetime(tobk1_acc.DeliveryEndDateTime),
                      code: tobk1_acc.CustomerCode,
                      customer: {
                        name: tobk1_acc.CustomerName,
                        address: tobk1_acc.ToAddress1 + tobk1_acc.ToAddress2 + tobk1_acc.ToAddress3 + tobk1_acc.ToAddress4
                      },
                      status: {
                        inprocess: is.equal(tobk1_acc.CompletedFlag, 'Y') ? false : true,
                        success: is.equal(tobk1_acc.CompletedFlag, 'Y') ? true : false,
                        failed: false
                      }
                    }];
                    dataResults = dataResults.concat(jobs);
                    $scope.jobs = dataResults;

                  }
                }
              });

            }
          });
        }, dbError);
      }
    };
    getBookingNo();
    $scope.showFilterBar = function() {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.jobs,
        expression: function(filterText, value, index, array) {
          return value.bookingno.indexOf(filterText) > -1;
        },
        //filterProperties: ['bookingno'],
        update: function(filteredItems, filterText) {
          $scope.jobs = filteredItems;
          if (filterText) {
            console.log(filterText);
          }
        }
      });
    };

    $scope.refreshItems = function() {
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
      }
      $timeout(function() {
        getBookingNo();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };

    $scope.gotoDetail = function(job) {
      console.log(job.JobNo);
      $state.go('jobListingDetail', {
        'BookingNo': job.bookingno,
        'JobNo': job.JobNo
      }, {
        reload: true
      });
    };
  }
]);

app.controller('JoblistingCtrl', ['$scope', '$state', '$stateParams',
  function($scope, $state, $stateParams) {
    $scope.List = {
      BookingNo: $stateParams.BookingNo
    };
    if (dbTms) {
      dbTms.transaction(function(tx) {
        dbSql = 'select * from Tobk1_Accept';
        tx.executeSql(dbSql, [], function(tx, results) {
          if (results.rows.length > 0) {
            for (var i = 0; i < results.rows.length; i++) {
              if ($scope.List.BookingNo === results.rows.item(i).BookingNo) {
                var UomCode = is.undefined(results.rows.item(i).UOMCode) ? '' : results.rows.item(i).UOMCode;
                $scope.jobs = [{
                  action: 'Collect',
                  amt: results.rows.item(i).TotalPcs + ' ' + UomCode,
                  time: moment(results.rows.item(i).DeliveryEndDateTime).format('DD-MMM-YYYY'),
                  code: results.rows.item(i).CustomerCode,
                  customer: {
                    name: results.rows.item(i).CustomerName,
                    address: results.rows.item(i).ToAddress1 + results.rows.item(i).ToAddress2 + results.rows.item(i).ToAddress3 + results.rows.item(i).ToAddress4
                  },
                  status: {
                    inprocess: false,
                    success: true,
                    failed: false
                  }
                }]

              }
            }
          }
        });
      }, dbError);
    }



    // $scope.jobs = [{
    //   action: 'Collect',
    //   amt: '2 PKG',
    //   time: '09:00 - 12:00',
    //   code: 'PC 601234',
    //   customer: {
    //     name: 'John Tan',
    //     address: '150 Jurong East...'
    //   },
    //   status: {
    //     inprocess: false,
    //     success: true,
    //     failed: false
    //   }
    // }, {
    //   action: 'Deliver',
    //   amt: '1 PKG',
    //   time: '11:00 - 13:00',
    //   code: 'PC 603234',
    //   customer: {
    //     name: 'Kenny Wong',
    //     address: '32 Jurong East...'
    //   },
    //   status: {
    //     inprocess: true,
    //     success: false,
    //     failed: false
    //   }
    // }, {
    //   action: 'Collect',
    //   amt: '1 PKG',
    //   time: '12:30 - 15:00',
    //   code: 'PC 605061',
    //   customer: {
    //     name: 'Mary Lim',
    //     address: '50 Jurong East...'
    //   },
    //   status: {
    //     inprocess: false,
    //     success: false,
    //     failed: false
    //   }
    // }, {
    //   action: 'Collect',
    //   amt: '1 PKG',
    //   time: '14:00 - 16:00',
    //   code: 'PC 643456',
    //   customer: {
    //     name: 'Lim Soon Hock',
    //     address: '165 Jurong North...'
    //   },
    //   status: {
    //     inprocess: false,
    //     success: false,
    //     failed: true
    //   }
    // }];

    $scope.returnSearch = function() {
      $state.go('jobListing', {}, {
        reload: true
      });
    };
    $scope.gotoDetail = function(job) {
      $state.go('jobListingDetail', {}, {
        reload: true
      });
    };
  }
]);

app.controller('JoblistingDetailCtrl', ['ENV', '$scope', '$state', '$ionicActionSheet', '$cordovaSms', '$stateParams', 'ApiService',
  function(ENV, $scope, $state, $ionicActionSheet, $cordovaSms, $stateParams, ApiService) {
    $scope.BookingNo = $stateParams.BookingNo;
    // $scope.CompletedFlagDetail = $stateParams.CompletedFlagDetail;
    // console.log($stateParams.BookingNo + 'aaaa' + $scope.CompletedFlagDetail);
    $scope.tobk2 = {
        AllBalance: 0,
        Deposit:0,
        Discount:0,
        Collected:0
       };
    var dataResults = new Array();
    var showTobk = function() {
      if (is.not.empty($scope.BookingNo)) {
        var strUri = '/api/tms/tobk2?BookingNo=' + $scope.BookingNo;
        ApiService.GetParam(strUri, true).then(function success(result) {
          var results = result.data.results;
          if (is.not.empty(results)) {
            $scope.JobType = results[0].JobType;
            for (var intI = 0; intI < results.length; intI++) {
              var Tobk2 = [{
                ContainerType: results[intI].ContainerType,
                DeliveryPcs: results[intI].DeliveryPcs,
                Pcs: results[intI].Pcs
              }]
              dataResults = dataResults.concat(Tobk2);
              $scope.Tobk2S = dataResults;
              $scope.tobk2.AllBalance =  results[intI].TotalChargeWeight;
              $scope.tobk2.Deposit =results[intI].TotalGrossWeight;
               $scope.tobk2.Discount=results[intI].TotalVolume;
            }
          }
          if (is.equal($scope.JobType, 'DE')) {
            $scope.title = 'Deliver : ' + $scope.BookingNo;
          } else {
            $scope.title = 'Collect : ' + $scope.BookingNo;
          }
        });
      }
    };
    showTobk();

    $scope.showActionSheet = function() {
      var actionSheet = $ionicActionSheet.show({
        buttons: [{
          text: '<a class="button" ng-href="tel:08605925888865">CALL</a>'
        }, {
          text: 'SMS'
        }],
        //destructiveText: 'Delete',
        titleText: 'Select Picture',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          if (index === 0) {
            // ng-href="tel:08605925888865"
          } else if (index === 1) {
            SMS();
          }
          return true;
        }
      });
    };
    $scope.gotoConfirm = function() {
      $state.go('jobListingConfirm', {
        'BookingNo': $scope.BookingNo,
        'JobNo': $stateParams.JobNo
      }, {
        reload: true
      });
    };
    $scope.returnList = function() {
      $state.go('jobListingList', {}, {});
    };
    var SMS = function() {
      $scope.PhoneNumber = '18065981961'; //default PhoneNumber
      $scope.message = 'sms'; //default sms message
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.close();
      }
      var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
          intent: 'INTENT' // send SMS with the native android SMS messaging
            //intent: '' // send SMS without open any other app
        }
      };
      var success = function() {};
      var error = function(e) {};
      $cordovaSms.send($scope.PhoneNumber, $scope.message, options, success, error);
    }
  }
]);
app.controller('JoblistingConfirmCtrl', ['$scope', '$state', '$stateParams', 'ApiService','$ionicPopup',
  function($scope, $state, $stateParams, ApiService,$ionicPopup) {
    var alertPopup = null;
    var showPopup = function(title, type, callback) {
      if (alertPopup !== null) {
        alertPopup.close();
        alertPopup = null;
      }
      alertPopup = $ionicPopup.alert({
        title: title,
        okType: 'button-' + type
      });
      if (typeof(callback) == 'function') callback(alertPopup);
    };

    $scope.returnSearch = function() {
      $state.go('jobListing', {}, {
        reload: true
      });
    };
    // var getDownLoadImg =function(){
      var strUri = '/api/tms/tobk1/attach?JobNo=' + $stateParams.JobNo;
      console.log(strUri);
      ApiService.GetParam(strUri, true).then(function success(result) {
                    if (result.data.results != null && result.data.results.length > 0) {
                        $scope.signature = 'data:image/png;base64,'+result.data.results;
                    } else {
                        $scope.SignatureTobk1 = null;
                        alertPopup = $ionicPopup.alert({
                            title: 'No Attachment Found',
                            okType: 'button-calm'
                        });
                        alertPopup.then(function(res) {
                            console.log('No Attachment Found');
                            // $scope.returnSearch();
                        });
                    }
                });
    // };
    $scope.returnList = function() {
      $state.go('jobListingList', {}, {});
    };
    $scope.confirm = function() {
      var strUri = '/api/tms/tobk1/confirm?BookingNo=' + $stateParams.BookingNo;
      ApiService.GetParam(strUri, true).then(function success(result) {
        var tobk1 = {
          CompletedFlag: 'Y',
          BookingNo: $stateParams.BookingNo
        }
        db_update_Tobk1_Accept(tobk1);
        uploadPhoto();
        showPopup('Confirm Success','calm',function(popup){
          popup.close();
          $scope.returnList();
        });
      });
    };

    var uploadPhoto = function() {
      var jsonData = {
        'Base64': $scope.signature,
        'FileName': 'signature.png'
      };
      var strUri = '/api/tms/upload/img?JobNo=' + $stateParams.JobNo;
      ApiService.Post(strUri, jsonData, true).then(function success(result) {
        console.log(strUri + 'updatephoto');
      });
    };

    $scope.returnDetail = function() {
      $state.go('jobListingDetail', {
        BookingNo: $stateParams.BookingNo
      }, {
        reload: true
      });
    };
    var canvas = document.getElementById('signatureCanvas');
    resizeCanvas();
    var signaturePad = new SignaturePad(canvas);
    //signaturePad.backgroundColor = "white";
    //signaturePad.minWidth = 2;
    //signaturePad.maxWidth = 4.5;
    $scope.clearCanvas = function() {
   $scope.signature = null;
    signaturePad.clear();


    }
    $scope.saveCanvas = function() {
      var sigImg = signaturePad.toDataURL();
      $scope.signature = sigImg;
    }

    function resizeCanvas() {
      var ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth - 50;
      canvas.height = window.innerHeight / 4 - 50;
    };
  }
]);
