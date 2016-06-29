'use strict';
var app = angular.module('TMS', [
  'ionic',
  'ionic-datepicker',
  'jett.ionic.filter.bar',
  'ionic.ion.headerShrink',
  'ionMdInput',
  'ngMessages',
  'ngCordova',
  'ngCordova.plugins.sms',
  'ngCordova.plugins.toast',
  'ngCordova.plugins.dialogs',
  'ngCordova.plugins.appVersion',
  'ngCordova.plugins.keyboard',
  'ngCordova.plugins.file',
  'ngCordova.plugins.fileTransfer',
  'ngCordova.plugins.fileOpener2',
  'ngCordova.plugins.actionSheet',
  'ngCordova.plugins.inAppBrowser',
  'ngCordova.plugins.datePicker',
  'ngCordova.plugins.barcodeScanner',
  'ngCordova.plugins.actionSheet',
  'TMS.config',
  'TMS.services',
  'TMS.factories'
]);
app.run(['ENV', '$ionicPlatform', '$rootScope', '$state', '$location', '$timeout', '$ionicHistory', '$ionicLoading', '$cordovaToast', '$cordovaKeyboard', '$cordovaFile', '$cordovaSQLite',
  function(ENV, $ionicPlatform, $rootScope, $state, $location, $timeout, $ionicHistory, $ionicLoading, $cordovaToast, $cordovaKeyboard, $cordovaFile, $cordovaSQLite) {
    $ionicPlatform.ready(function() {
      if (window.cordova) {
        ENV.fromWeb = false;
        $cordovaKeyboard.hideAccessoryBar(true);
        $cordovaKeyboard.disableScroll(true);
        //sqlLite
        //
        if (!ENV.fromWeb) {
          $cordovaKeyboard.hideAccessoryBar(true);
          $cordovaKeyboard.disableScroll(true);
          try {
            db = $cordovaSQLite.openDB({
              name: 'AppTms.db',
              location: 'default'
            });
          } catch (error) {}
          $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT)');
          $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS sqlLite_Tobk1(BookingNo TEXT,JobNo TEXT,JobType TEXT,CustomerCode TEXT,CustomerName TEXT,CustomerRefNo TEXT,CompletedFlag TEXT,DeliveryEndDateTime TEXT,EstimateDeliveryDateTime TEXT,FromPostalCode TEXT,FromName TEXT,FromAddress1 TEXT,FromAddress2 TEXT,FromAddress3 TEXT,FromAddress4  TEXT,TotalPcs INTEGER,ToPostalCode TEXT,ToName TEXT,ToAddress1 TEXT,ToAddress2 TEXT,ToAddress3 TEXT,ToAddress4 TEXT,UomCode TEXT,TotalGrossWeight INTEGER,NoOfPallet INTEGER,TotalVolume INTEGER,DescriptionOfGoods1 TEXT,Description TEXT,Note TEXT)');

          $rootScope.sqlLite_add_Tobk1 = function(Tobk1) {
            if (db) {
              var sql = 'INSERT INTO sqlLite_Tobk1(BookingNo,JobNo,JobType,CustomerCode,CustomerName,CustomerRefNo,CompletedFlag,DeliveryEndDateTime,TotalPcs,ToAddress1,ToAddress2,ToAddress3,ToAddress4,UomCode,TotalGrossWeight,NoOfPallet,TotalVolume,DescriptionOfGoods1,Description,Note,EstimateDeliveryDateTime,FromPostalCode,FromName,FromAddress1,FromAddress2,FromAddress3,FromAddress4,ToPostalCode,ToName) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
              $cordovaSQLite.execute(db, sql, [Tobk1.BookingNo, Tobk1.JobNo, Tobk1.JobType, Tobk1.CustomerCode, Tobk1.CustomerName, Tobk1.CustomerRefNo, Tobk1.CompletedFlag, Tobk1.DeliveryEndDateTime, Tobk1.TotalPcs, Tobk1.ToAddress1, Tobk1.ToAddress2, Tobk1.ToAddress3, Tobk1.ToAddress4, Tobk1.UomCode, Tobk1.TotalGrossWeight, Tobk1.NoOfPallet, Tobk1.TotalVolume, Tobk1.DescriptionOfGoods1, Tobk1.Description, Tobk1.Note, Tobk1.EstimateDeliveryDateTime, Tobk1.FromPostalCode, Tobk1.FromName, Tobk1.FromAddress1, Tobk1.FromAddress2, Tobk1.FromAddress3, Tobk1.FromAddress4, Tobk1.ToPostalCode, Tobk1.ToName])
                .then(function(result) {}, function(error) {});
            }
          };

          $rootScope.sqlLite_add_Users = function(Todr1) {
            if (db) {
              var sql = 'INSERT INTO Users(uid) values(?)';
              $cordovaSQLite.execute(db, sql, [Todr1.uid])
                .then(function(result) {}, function(error) {});
            }
          };

          $rootScope.sqlLite_update_tobk1_Note = function(Tobk1) {
            if (db) {
              var sql = 'Update sqlLite_Tobk1 set Note=? where BookingNo=?';
              $cordovaSQLite.execute(db, sql, [Tobk1.Note, Tobk1.BookingNo])
                .then(function(result) {}, function(error) {});
            }
          };

          $rootScope.sqlLite_update_tobk1_CompletedFlag = function(Tobk1) {
            if (db) {
              var sql = 'Update sqlLite_Tobk1 set CompletedFlag=? where BookingNo=?';
              $cordovaSQLite.execute(db, sql, [Tobk1.CompletedFlag, Tobk1.BookingNo])
                .then(function(result) {}, function(error) {});
            }
          };
        }

        //sqlLite
        var data = 'website=' + ENV.website + '##api=' + ENV.api + '##ssl=' + ENV.ssl;
        var path = cordova.file.externalRootDirectory;
        var directory = ENV.rootPath;
        var file = directory + '/' + ENV.configFile;
        $cordovaFile.createDir(path, directory, false)
          .then(function(success) {
            $cordovaFile.writeFile(path, file, data, true)
              .then(function(success) {
                var blnSSL = ENV.ssl === 0 ? false : true;
                ENV.website = appendProtocol(ENV.website, blnSSL, ENV.port);
                ENV.api = appendProtocol(ENV.api, blnSSL, ENV.port);
              }, function(error) {
                $cordovaToast.showShortBottom(error);
              });
          }, function(error) { // If an existing directory exists
            $cordovaFile.checkFile(path, file)
              .then(function(success) {
                $cordovaFile.readAsText(path, file)
                  .then(function(success) {
                    var arConf = success.split('##');
                    if (is.not.empty(arConf[0])) {
                      var arWebServiceURL = arConf[0].split('=');
                      if (is.not.empty(arWebServiceURL[1])) {
                        ENV.website = arWebServiceURL[1];
                      }
                    }
                    if (is.not.empty(arConf[1])) {
                      var arWebSiteURL = arConf[1].split('=');
                      if (is.not.empty(arWebSiteURL[1])) {
                        ENV.api = arWebSiteURL[1];
                      }
                    }
                    if (is.not.empty(arConf[2])) {
                      var arSSL = arConf[2].split('=');
                      if (is.not.empty(arSSL[1])) {
                        ENV.ssl = arSSL[1];
                      }
                    }
                    var blnSSL = ENV.ssl === 0 ? false : true;
                    ENV.website = appendProtocol(ENV.website, blnSSL, ENV.port);
                    ENV.api = appendProtocol(ENV.api, blnSSL, ENV.port);
                    //
                  }, function(error) {
                    $cordovaToast.showShortBottom(error);
                  });
              }, function(error) {
                // If file not exists
                $cordovaFile.writeFile(path, file, data, true)
                  .then(function(success) {
                    var blnSSL = ENV.ssl === 0 ? false : true;
                    ENV.website = appendProtocol(ENV.website, blnSSL, ENV.port);
                    ENV.api = appendProtocol(ENV.api, blnSSL, ENV.port);
                  }, function(error) {
                    $cordovaToast.showShortBottom(error);
                  });
              });
          });
      } else {
        var blnSSL = 'https:' === document.location.protocol ? true : false;
        ENV.ssl = blnSSL ? '1' : '0';
        ENV.website = appendProtocol(ENV.website, blnSSL, ENV.port);
        ENV.api = appendProtocol(ENV.api, blnSSL, ENV.port);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
    $ionicPlatform.registerBackButtonAction(function(e) {
      e.preventDefault();
      // Is there a page to go back to?  $state.include ??
      if ($state.includes('index.main') || $state.includes('index.login') || $state.includes('splash')) {
        if ($rootScope.backButtonPressedOnceToExit) {
          ionic.Platform.exitApp();
        } else {
          $rootScope.backButtonPressedOnceToExit = true;
          $cordovaToast.showShortBottom('Press again to exit.');
          setTimeout(function() {
            $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
        }
      } else if (
        $state.includes('acceptJob') ||
        $state.includes('jobListingList')
      ) {
        $state.go('index.main', {}, {
          reload: true
        });
      } else if (
        $state.includes('jobListingDetail')
      ) {
        $state.go('jobListingList', {}, {});
      } else if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        // This is the last page: Show confirmation popup
        $rootScope.backButtonPressedOnceToExit = true;
        $cordovaToast.showShortBottom('Press again to exit.');
        setTimeout(function() {
          $rootScope.backButtonPressedOnceToExit = false;
        }, 2000);
      }
      return false;
    }, 101);
  }
]);
app.config(['ENV', '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$ionicFilterBarConfigProvider',
  function(ENV, $stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicFilterBarConfigProvider) {
    $ionicConfigProvider.backButton.previousTitleText(false);
    $stateProvider
      .state('index', {
        url: '',
        abstract: true,
        templateUrl: 'view//menu/menu.html',
        controller: 'IndexCtrl'
      })
      .state('splash', {
        url: '/splash',
        cache: 'false',
        templateUrl: 'view/splash/splash.html',
        controller: 'SplashCtrl'
      })
      .state('index.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'view/login/login.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('index.main', {
        url: '/main',
        views: {
          'menuContent': {
            templateUrl: "view/main/main.html",
            controller: 'MainCtrl'
          }
        }
      })
      .state('acceptJob', {
        url: '/acceptjob/search',
        cache: 'false',
        templateUrl: 'view/acceptjob/search.html',
        controller: 'AcceptJobCtrl'
      })
      .state('jobListing', {
        url: '/joblisting/search',
        cache: 'false',
        templateUrl: 'view/joblisting/search.html',
        controller: 'JoblistingCtrl'
      })
      .state('jobListingList', {
        url: '/joblisting/list',
        cache: 'false',
        templateUrl: 'view/joblisting/list.html',
        controller: 'JoblistingListCtrl'
      })
      .state('jobListingDetail', {
        url: '/joblisting/detail/:BookingNo/:JobNo',
        cache: 'false',
        templateUrl: 'view/joblisting/detail.html',
        controller: 'JoblistingDetailCtrl'
      })
      .state('index.setting', {
        url: '/setting/setting',
        views: {
          'menuContent': {
            templateUrl: 'view/setting/setting.html',
            controller: 'SettingCtrl'
          }
        }
      })
      .state('goDriverCodeCtrl', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'view/login/login.html',
            controller: 'goDriverCodeCtrl'
          }
        }
      })
      .state('driverCodeCtrl', {
        url: '/driverCode/driverCode',
        cache: 'false',
        templateUrl: 'view/driverCode/driverCode.html',
        controller: 'driverCodeCtrl'
      })
      .state('jobListingConfirm', {
        url: '/joblisting/confirm/:BookingNo/:JobNo/:Packages',
        cache: 'false',
        templateUrl: 'view/joblisting/confirm.html',
        controller: 'JoblistingConfirmCtrl'
      });
    $urlRouterProvider.otherwise('/splash');
    /*
    $ionicFilterBarConfigProvider.theme('calm');
    $ionicFilterBarConfigProvider.clear('ion-close');
    $ionicFilterBarConfigProvider.search('ion-search');
    $ionicFilterBarConfigProvider.backdrop(false);
    $ionicFilterBarConfigProvider.transition('vertical');
    $ionicFilterBarConfigProvider.placeholder('Filter');
    */
  }
]);
app.constant('$ionicLoadingConfig', {
  template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
});
