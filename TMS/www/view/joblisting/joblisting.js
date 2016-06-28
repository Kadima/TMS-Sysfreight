'use strict';
app.controller('JoblistingListCtrl', ['ENV', '$scope', '$state', '$ionicLoading', '$ionicPopup', '$ionicFilterBar', '$ionicActionSheet', 'ApiService', '$ionicPlatform', '$cordovaSQLite', '$rootScope',
  function(ENV, $scope, $state, $ionicLoading, $ionicPopup, $ionicFilterBar, $ionicActionSheet, ApiService, $ionicPlatform, $cordovaSQLite, $rootScope) {
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

    console.log(moment().add(2, 'hours').format('HH:mm:ss'));
    console.log('momnet');
    // $('#txt-BookingNo').on('keydown', function(e) {
    //   if (e.which === 9 || e.which === 13) {
    //     getBookingNo();
    //   }
    // });
    var checkJobType = function(JobType) {
      if (is.equal(JobType, 'CO')) {
        return 'Collect';
      } else if (is.equal(JobType, 'DE')) {
        return 'Deliver';
      } else {
        return 'Transport';
      }
    };

    var checkPostalCode = function(JobType, FromPostalCode, ToPostalCode) {
      if (is.equal(JobType, 'CO')) {
        return FromPostalCode;
      } else {
        return ToPostalCode;
      }
    };

    var checkName = function(JobType, FromName, ToName) {
      if (is.equal(JobType, 'CO')) {
        return FromName;
      } else {
        return ToName;
      }
    };

    var checkAddress = function(JobType, FromAddress, ToAddress) {
      if (is.equal(JobType, 'CO')) {
        return FromAddress;
      } else {
        return ToAddress;
      }
    };

    var getBookingNo = function() {
      if (!ENV.fromWeb) {
        $ionicPlatform.ready(function() {
          $cordovaSQLite.execute(db, 'SELECT * FROM sqlLite_Tobk1')
            .then(
              function(results) {
                if (results.rows.length > 0) {
                  for (var i = 0; i < results.rows.length; i++) {
                    var tobk1_acc = results.rows.item(i);
                    var jobs = [{
                      bookingno: tobk1_acc.BookingNo,
                      JobNo: tobk1_acc.JobNo,
                      // action:: is.equal(tobk1_acc.JobType, 'DE') ? 'Deliver' : 'Collect',
                      action: checkJobType(tobk1_acc.JobType),
                      amt: tobk1_acc.TotalPcs + ' ' + tobk1_acc.UomCode,
                      time: checkDatetime(tobk1_acc.EstimateDeliveryDateTime),
                      code: 'PC ' + checkPostalCode(tobk1_acc.JobType, tobk1_acc.FromPostalCode, tobk1_acc.ToPostalCode),
                      customer: {
                        name: checkName(tobk1_acc.JobType, tobk1_acc.FromName, tobk1_acc.ToName),
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
                          // action: is.equal(tobk1_acc.JobType, 'DE') ? 'Deliver' : 'Collect',
                          action: checkJobType(tobk1_acc.JobType),
                          amt: tobk1_acc.TotalPcs + ' ' + tobk1_acc.UomCode,
                          time: checkDatetime(tobk1_acc.EstimateDeliveryDateTime),
                          code: 'PC ' + checkPostalCode(tobk1_acc.JobType, tobk1_acc.FromPostalCode, tobk1_acc.ToPostalCode),
                          customer: {
                            name: checkName(tobk1_acc.JobType, tobk1_acc.FromName, tobk1_acc.ToName),
                            address: checkAddress(tobk1_acc.JobType, tobk1_acc.FromAddress1 + tobk1_acc.FromAddress2 + tobk1_acc.FromAddress3 + tobk1_acc.FromAddress4, tobk1_acc.ToAddress1 + tobk1_acc.ToAddress2 + tobk1_acc.ToAddress3 + tobk1_acc.ToAddress4)
                          },
                          status: {
                            inprocess: is.equal(tobk1_acc.CompletedFlag, 'Y') ? false : true,
                            success: is.equal(tobk1_acc.CompletedFlag, 'Y') ? true : false,
                            failed: false
                          }
                        }];
                        dataResults = dataResults.concat(jobs);
                        $scope.jobs = dataResults;
                        $rootScope.sqlLite_add_Tobk1(results[intI]);
                      }
                    }
                  });
                }
              },
              function(error) {}
            );
        });
      } else {
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
                    // action:: is.equal(tobk1_acc.JobType, 'DE') ? 'Deliver' : 'Collect',
                    action: checkJobType(tobk1_acc.JobType),
                    amt: tobk1_acc.TotalPcs + ' ' + tobk1_acc.UomCode,
                    time: checkDatetime(tobk1_acc.EstimateDeliveryDateTime),
                    code: 'PC ' + checkPostalCode(tobk1_acc.JobType, tobk1_acc.FromPostalCode, tobk1_acc.ToPostalCode),
                    customer: {
                      name: checkName(tobk1_acc.JobType, tobk1_acc.FromName, tobk1_acc.ToName),
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
                        // action: is.equal(tobk1_acc.JobType, 'DE') ? 'Deliver' : 'Collect',
                        action: checkJobType(tobk1_acc.JobType),
                        amt: tobk1_acc.TotalPcs + ' ' + tobk1_acc.UomCode,
                        time: checkDatetime(tobk1_acc.EstimateDeliveryDateTime),
                        code: 'PC ' + checkPostalCode(tobk1_acc.JobType, tobk1_acc.FromPostalCode, tobk1_acc.ToPostalCode),
                        customer: {
                          name: checkName(tobk1_acc.JobType, tobk1_acc.FromName, tobk1_acc.ToName),
                          address: checkAddress(tobk1_acc.JobType, tobk1_acc.FromAddress1 + tobk1_acc.FromAddress2 + tobk1_acc.FromAddress3 + tobk1_acc.FromAddress4, tobk1_acc.ToAddress1 + tobk1_acc.ToAddress2 + tobk1_acc.ToAddress3 + tobk1_acc.ToAddress4)
                        },
                        status: {
                          inprocess: is.equal(tobk1_acc.CompletedFlag, 'Y') ? false : true,
                          success: is.equal(tobk1_acc.CompletedFlag, 'Y') ? true : false,
                          failed: false
                        }
                      }];
                      dataResults = dataResults.concat(jobs);
                      $scope.jobs = dataResults;
                      db_add_Tobk1_Accept(results[intI]);
                    }
                  }
                });
              }
            });
          }, dbError);
        }
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
                  time: moment(results.rows.item(i).EstimateDeliveryDateTime).format('DD-MMM-YYYY'),
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

app.controller('JoblistingDetailCtrl', ['ENV', '$scope', '$state', '$ionicActionSheet', '$cordovaSms', '$stateParams', 'ApiService', '$ionicPlatform', '$cordovaSQLite', '$rootScope',
  function(ENV, $scope, $state, $ionicActionSheet, $cordovaSms, $stateParams, ApiService, $ionicPlatform, $cordovaSQLite, $rootScope) {
    $scope.BookingNo = $stateParams.BookingNo;
    // $scope.CompletedFlagDetail = $stateParams.CompletedFlagDetail;
    // console.log($stateParams.BookingNo + 'aaaa' + $scope.CompletedFlagDetail);
    // $scope.tobk2 = {
    //     AllBalance: 0,
    //     Deposit:0,
    //     Discount:0,
    //     Collected:0
    //    };
    $scope.Detail = {
      tobk1: {
        BookingNo: $stateParams.BookingNo,
      },
      PhoneNumber: 'tel:08605925888865'
    };
    var dataResults = new Array();
    var showTobk = function() {
      if (is.not.empty($scope.Detail.tobk1.BookingNo)) {
        if (!ENV.fromWeb) {
          $ionicPlatform.ready(function() {
            $cordovaSQLite.execute(db, "SELECT * FROM sqlLite_Tobk1 where BookingNo='" + $scope.Detail.tobk1.BookingNo + "'")
              .then(
                function(results) {
                  if (results.rows.length > 0) {
                    $scope.Detail.tobk1 = results.rows.item(0);
                    showDetailTitle($scope.Detail.tobk1.JobType, $scope.Detail.tobk1.JobNo);
                  }
                },
                function(error) {}
              );
          });
        } else {
          if (dbTms) {
            dbTms.transaction(function(tx) {
              dbSql = "select * from Tobk1_Accept where BookingNo='" + $scope.Detail.tobk1.BookingNo + "'";
              tx.executeSql(dbSql, [], function(tx, results) {
                if (results.rows.length > 0) {
                  $scope.Detail.tobk1 = results.rows.item(0);
                  showDetailTitle($scope.Detail.tobk1.JobType, $scope.Detail.tobk1.JobNo);
                }
              });
            }, dbError);
          }
        }
      }
    };
    showTobk();

    var showDetailTitle = function(JobType, JobNo) {
      if (is.equal(JobType, 'CO')) {
        $scope.title = 'Job-Collection : ' + JobNo;
      } else if (is.equal(JobType, 'DE')) {
        $scope.title = 'Job-Delivery : ' + JobNo;
      } else {
        $scope.title = 'Job-Transport : ' + JobNo;
      }
    };

    $scope.capturePhoto = function() {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 25,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      });

      function onSuccess(imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
      }

      function onFail(message) {
        // alert('Failed because: ' + message);
      }

    };

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
      var tobk1 = {
        Note: $scope.Detail.tobk1.Note,
        BookingNo: $scope.Detail.tobk1.BookingNo
      };
      if (!ENV.fromWeb) {
        $rootScope.sqlLite_update_tobk1_Note(tobk1);
      } else {
        if (dbTms) {
          db_update_tobk1_Note(tobk1);
        }
      }

      $state.go('jobListingConfirm', {
        'BookingNo': $scope.Detail.tobk1.BookingNo,
        'JobNo': $scope.Detail.tobk1.JobNo,
        'Packages': $scope.Detail.tobk1.TotalPcs
      }, {
        reload: true
      });
    };
    $scope.returnList = function() {
      $state.go('jobListingList', {}, {});
    };
    var SMS = function() {
      $scope.PhoneNumber = '0892588865'; //default PhoneNumber
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
app.controller('JoblistingConfirmCtrl', ['ENV', '$scope', '$state', '$stateParams', 'ApiService', '$ionicPopup', '$ionicPlatform', '$cordovaSQLite', '$rootScope',
  function(ENV, $scope, $state, $stateParams, ApiService, $ionicPopup, $ionicPlatform, $cordovaSQLite, $rootScope) {
    $scope.Confirmation = {
      tobk1: {
        BookingNo: $stateParams.BookingNo,
        JobNo: $stateParams.JobNo,
        Packages: $stateParams.Packages
      },
      tobk1s: {}
    };
    $scope.title = 'Job Confirmation : ' + $scope.Confirmation.tobk1.JobNo
    var showConfirmationTobk = function() {
      if (is.not.empty($scope.Confirmation.tobk1.BookingNo)) {
        if (!ENV.fromWeb) {
          $ionicPlatform.ready(function() {
            $cordovaSQLite.execute(db, "SELECT * FROM sqlLite_Tobk1 where BookingNo='" + $scope.Confirmation.tobk1.BookingNo + "'")
              .then(
                function(results) {
                  if (results.rows.length > 0) {
                    $scope.Confirmation.tobk1 = results.rows.item(0);
                    $scope.Confirmation.tobk1.Packages = $scope.Confirmation.tobk1.TotalPcs;
                  }
                },
                function(error) {}
              );
          });
        } else {
          if (dbTms) {
            dbTms.transaction(function(tx) {
              dbSql = "select * from Tobk1_Accept where BookingNo='" + $scope.Confirmation.tobk1.BookingNo + "'";
              tx.executeSql(dbSql, [], function(tx, results) {
                if (results.rows.length > 0) {
                  $scope.Confirmation.tobk1 = results.rows.item(0);
                  $scope.Confirmation.tobk1.Packages = $scope.Confirmation.tobk1.TotalPcs;
                }
              });
            }, dbError);
          }
        }
      }
    };
    showConfirmationTobk();
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
        $scope.signature = 'data:image/png;base64,' + result.data.results;
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
        // update remark
        var strUri = '/api/tms/tobk1/update?BookingNo=' + $stateParams.BookingNo + '&Remark=' + $scope.Confirmation.tobk1.Note;
        ApiService.GetParam(strUri, true).then(function success(result) {});

        var tobk1 = {
          CompletedFlag: 'Y',
          BookingNo: $stateParams.BookingNo
        };
        if (!ENV.fromWeb) {
          $rootScope.sqlLite_update_tobk1_CompletedFlag(tobk1);
        } else {
          db_update_Tobk1_Accept(tobk1);
        }
        uploadPhoto();
        showPopup('Confirm Success', 'calm', function(popup) {
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
      // canvas.height = window.innerHeight / 4 - 50;
      canvas.height = screen.height / 3;
    };
  }
]);
