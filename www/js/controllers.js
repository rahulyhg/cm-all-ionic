// angular.module('starter.controllers', ['starter.services', 'checklist-model', 'chart.js', 'ui.calendar', 'ngCordova'])
  angular.module('starter.controllers', ['starter.services', 'checklist-model', 'ui.calendar','ngCordova'])

.controller('LoadingCtrl', function ($scope, $ionicModal, $timeout, $state, $rootScope, MyServices, $ionicHistory) {
  $scope.loadingData = MyServices.getUser();
  if ($scope.loadingData.accessToken) {
    // $state.go('app.profile');
      $state.go('landing');
  } else {
    $state.go('landing');
  }
})

.controller('LandingCtrl', function ($scope, $ionicModal, $timeout, $state, $rootScope, MyServices, $ionicHistory) {
  // $scope.loadingData = MyServices.getUser();
  // if ($scope.loadingData.accessToken) {
  //   $state.go('app.profile');
  // } else {
  //   $state.go('landing');
  // }
})

.controller('appCtrl', function ($scope, $ionicModal, $timeout, MyServices, $state) {
  $scope.profileData = MyServices.getUser();

  // Log out
  $scope.logout = function () {
    $.jStorage.flush();
    $state.go('athlete-login');
  };

  $scope.notificationCount = $.jStorage.get("notificationCount");

})

.controller('AthleteLoginCtrl', function ($scope, $state, $ionicPopup, MyServices, $ionicLoading, $ionicModal, $ionicHistory) {
  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();
  $ionicHistory.removeBackView();
  $ionicModal.fromTemplateUrl('templates/athlete-modal/forgot-password.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function () {
    $scope.modal.show();
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Submit Form
  $scope.submitData = function (formData) {
    $scope.showLoading('Please wait...', 15000);
    MyServices.athletelogin(formData, function (data) {
      if (data.value === true) {
        $scope.formData = {};
        $scope.hideLoading();
        $scope.showLoading('Login Successful!', 2000);
        MyServices.setAthleteUser(data.data);
        $state.go('app.athlete-profile');
      } else {
                    console.log("nai gaya");
        $scope.hideLoading();
        $scope.showLoading(data.error.message, 2000);
      }
    });
  };
})

.controller('AthletePersonalGoalsCtrl', function ($scope, $state, $ionicPopup, MyServices, $ionicLoading, $ionicModal, $ionicHistory) {
  $scope.personalgoals = [];
  $scope.getPersonalGoals = function () {
    $scope.personalgoals = undefined;
    MyServices.getKeyAthleteCompetitions(function (data) {
      if (data.value) {
        $scope.personalgoals = data.data;
      } else {
        $scope.personalgoals = [];
      }
    });
  };
  $scope.getPersonalGoals();
})


.controller('AthleteForgotPasswordCtrl', function ($scope, $ionicModal, $timeout) {

})

.controller('AthleteProfileCtrl', function ($scope, $ionicScrollDelegate, $ionicHistory, $rootScope, MyServices, $ionicLoading) {
  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();
  $ionicHistory.removeBackView();
  $scope.profileData = MyServices.getUser();

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Reload Profile
  $scope.reloadProfile = function () {
    MyServices.getProfile($scope.profileData, function (data) {
      if (data.value === true) {
        MyServices.setAthleteUser(data.data);
        $scope.$broadcast('scroll.refreshComplete');
      } else {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.showLoading('Error Updating Profile!', 1000);
      }
    });
  };
  $scope.reloadProfile();

  var athlete = $scope.profileData._id;
  var i = 0;

  $scope.showAthleteNotification = function (athlete) {
    $scope.totalItems = undefined;
    $scope.athletenotifications = undefined;
    $scope.currentPage = 1;
    MyServices.getAthleteNotification({
      Id: athlete,
      page: $scope.currentPage
    }, ++i, function (response, ini) {
      if (ini == i) {
        if (response.value == true) {
          $scope.isAthlete = true;
          $scope.athletenotifications = response.data.results;;
          $scope.notificationCount = response.data.unreadcount;
          $.jStorage.set("notificationCount", $scope.notificationCount);
          $scope.maxRow = response.data.count;
          $scope.totalItems = response.data.total;

        } else {
          $scope.athletenotifications = [];
        }
      }

    })
  }
  $scope.showAthleteNotification(athlete);

  //Profile Incomplete Check
  $scope.profileIncomplete = function () {
    if (!$scope.profileData.country || !$scope.profileData.mobile || !$scope.profileData.sports || !$scope.profileData.about || !$scope.profileData.events || !$scope.profileData.achievements || !$scope.profileData.previousSeasonReview) {
      return true;
    } else {
      return false;
    }
  };
})

.controller('AthleteEditProfileCtrl', function ($scope, $state, MyServices, $ionicModal, $filter, $ionicLoading, $cordovaCamera, $cordovaFileTransfer) {
  $scope.formData = MyServices.getUser();
  $scope.formData.dob = new Date($scope.formData.dob);
  $scope.dummyPassword = '12345678';

  $scope.maxDate = $filter('date')(new Date(), 'yyyy-MM-dd');

  $scope.gender = ['Male', 'Female'];

  $scope.onlyAplha = /^[a-zA-Z_]+$/;
  $scope.validEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  MyServices.getCountries(function (data) {
    $scope.countries = data;
  });

  //Profile Incomplete Check
  $scope.profileIncomplete = function () {
    if (!$scope.formData.country || !$scope.formData.mobile || !$scope.profileData.sports || !$scope.formData.about || !$scope.formData.events || !$scope.formData.achievements || !$scope.formData.previousSeasonReview) {
      return true;
    } else {
      return false;
    }
  };

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Password Validator
  $scope.passwordData = {};
  $scope.valid1 = false;
  $scope.valid2 = false;
  $scope.passwordValidator = function (password) {
    $scope.passwordInvalid = true;
    if (password && password.length >= 8 && password.length <= 15) {
      $scope.valid1 = true;
    } else {
      $scope.valid1 = false;
    }
    if (/([a-zA-Z])/.test(password) && /([0-9])/.test(password)) {
      $scope.valid2 = true;
    } else {
      $scope.valid2 = false;
    }
    if ($scope.valid1 && $scope.valid2) {
      $scope.passwordInvalid = false;
    } else {
      $scope.passwordInvalid = true;
    }
  };

  //Submit Form
  $scope.submitData = function (formData) {
    $scope.showLoading('Please wait...', 15000);
    MyServices.editProfile(formData, function (data) {
      if (data.value === true) {
        $scope.hideLoading();
        MyServices.setAthleteUser(data.data);
        console.log(data.data);
        $scope.showLoading('Profile Updated!', 2000);
        $state.go('app.athlete-profile');
      } else {
        $scope.hideLoading();
        $scope.showLoading('Please Try Again!', 2000);
      }
    });
  };

  MyServices.getCountries(function (data) {
    $scope.countries = data;
  });


  // Update Password
  $ionicModal.fromTemplateUrl('templates/athlete-modal/password.html', {
    id: 1,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modalPassword = modal;
  });

  $scope.passwordData = {};
  $scope.changePassword = function () {
    $scope.passwordData.accessToken = $scope.formData.accessToken;
    $scope.modalPassword.show();
  };
  $scope.submitPassword = function (formData) {
    $scope.showLoading('Please wait...', 15000);
    MyServices.changePassword(formData, function (data) {
      if (data.value === true) {
        $scope.passwordData = {};
        $scope.hideLoading();
        $scope.showLoading('Password Updated!', 2000);
        $state.go('app.athelte-profile');
        $scope.closeModal();
      } else {
        $scope.hideLoading();
        $scope.showLoading(data.data.message, 2000);
      }
    });
  };

  $scope.closeModal = function () {
    $scope.modalPassword.hide();
  };

  //Password Validator
  $scope.passwordData = {};
  $scope.valid1 = false;
  $scope.valid2 = false;
  $scope.passwordValidator = function (password) {
    $scope.passwordInvalid = true;
    if (password && password.length >= 8 && password.length <= 15) {
      $scope.valid1 = true;
    } else {
      $scope.valid1 = false;
    }
    if (/([a-zA-Z])/.test(password) && /([0-9])/.test(password)) {
      $scope.valid2 = true;
    } else {
      $scope.valid2 = false;
    }
    if ($scope.valid1 && $scope.valid2) {
      $scope.passwordInvalid = false;
    } else {
      $scope.passwordInvalid = true;
    }
  };


  // Upload Profile Pic
  $scope.selectImage = function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    $cordovaCamera.getPicture(options).then(function (imageURI) {
      $scope.profileImage = imageURI;
      $scope.uploadImage($scope.profileImage);
    }, function (err) {
      // error
    });
  };

  //Upload Image
  $scope.uploadImage = function (imageURI) {
    $scope.showLoading('Uploading Image...', 10000);
    $cordovaFileTransfer.upload(adminurl + 'upload', imageURI)
      .then(function (result) {
        // Success!
        result.response = JSON.parse(result.response);
        $scope.formData.profilePic = result.response.data[0];
        $scope.submitData($scope.formData);
      }, function (err) {
        // Error
        $scope.hideLoading();
        $scope.showLoading('Error!', 2000);
      }, function (progress) {
        // constant progress updates
      });
  };
})


.controller('AthleteBlogCtrl', function ($scope, $ionicModal, MyServices, $ionicLoading, $ionicPopup) {
  $scope.currentPage = 1;
  var i = 0;
  $scope.allBlog = [];
  $scope.search = {
    keyword: ""
  };
  $scope.more = {
    Data: true
  };

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //On Change Search Function
  $scope.searchChange = function (keywordChange) {
    if (keywordChange === '') {
      $scope.allBlog = [];
      $scope.showAllBlog(keywordChange);
    } else {
      $scope.showAllBlog(keywordChange);
    }
  };

  //Get All blog
  $scope.showAllBlog = function (keywordChange) {
    if (keywordChange) {
      $scope.currentPage = 1;
      $scope.allBlog = [];
    }
    MyServices.searchBlogForAthlete({
      page: $scope.currentPage,
      keyword: $scope.search.keyword
    }, ++i, function (data, ini) {
      if (ini == i) {
        if (data.value) {
          console.log(data.data.results.reactions);
          _.forEach(data.data.results, function (value) {
            $scope.allBlog.push(value);
          });
          $scope.totalItems = data.data.total;
          if ($scope.totalItems > $scope.allBlog.length) {
            $scope.currentPage++;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            $scope.more.Data = false;
          }
        } else {
          $scope.showLoading('Error Loading Blogs', 2000);
        }
      }
    });
  };

  //Load More
  $scope.loadMore = function () {
    $scope.showAllBlog();
  };
  $scope.toggle = function () {
    $scope.searchBlog = !$scope.searchBlog;
  };
})

.controller('AthleteBlogDetailCtrl', function ($scope, $ionicModal, $ionicLoading, MyServices, $ionicPopup, $stateParams, $filter, $state) {
  $scope.formData = {};
  $scope.blogId = $stateParams.id;

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //get one edit
  if ($stateParams.id) {
    MyServices.getOneBlogForAthlete({
      _id: $stateParams.id
    }, function (response) {
      if (response.data) {
        $scope.formData = response.data;
      } else {
        $scope.formData = {};
      }
    });
  }

  //Reactions
  $scope.athlete = MyServices.getUser();
  $scope.goLike = function (val) {
    if (val) {
      MyServices.reactToBlog({
        type: val,
        _id: $stateParams.id
      }, function (response) {
        if (response.value) {
          $scope.formData = response.data;
        } else {}
      });
    } else {
      MyServices.removeReaction({
        _id: $stateParams.id
      }, function (response) {
        if (response.value) {
          $scope.formData = response.data;
        } else {}
      });
    }
  };

})

.controller('AthleteChatCtrl', function ($scope, $ionicModal, $state) {
  $ionicModal.fromTemplateUrl('templates/coach-modal/athlete-chat.html', {
    id: 1,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modalChat = modal;
  });
  $scope.newChat = function () {
    $scope.modalChat.show();
  };

  $scope.startChat = function () {
    $state.go('app.athlete-chatdetail');
    $scope.modalChat.hide();
  };
})

.controller('AthleteChatDetailCtrl', function ($scope, $ionicScrollDelegate, $timeout) {

  $scope.hideTime = true;

  $scope.timeStamp = function () {
    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
    return d;
  };

  $scope.sendMessage = function () {

    if ($scope.data.message !== '' && $scope.data.message) {
      $scope.messages.push({
        userId: 'me',
        text: $scope.data.message,
        time: $scope.timeStamp()
      });

      delete $scope.data.message;
      $ionicScrollDelegate.scrollBottom(true);
    }

  };

  $scope.chatTap = function (m) {
    m.showTime = true;
    $timeout(function () {
      m.showTime = false;
    }, 4000);
  };
  $scope.openKb = function () {
    cordova.plugins.Keyboard.open();
  };

  $scope.data = {};
  $scope.messages = [{
    userId: 'he',
    text: 'Hi Matt, how did you find the session?',
    time: $scope.timeStamp()
  }, {
    userId: 'me',
    text: 'Good, I managed to hit my target times, legs are feeling quite tired now.',
    time: $scope.timeStamp()
  }, {
    userId: 'he',
    text: 'Good, I suggest you rehab today ready for tomorrow’s session.',
    time: $scope.timeStamp()
  }, {
    userId: 'he',
    text: 'Stretch, foam roll etc, please refer to rehab programme attached with your Training Plan',
    time: $scope.timeStamp()
  }, {
    userId: 'me',
    text: 'Will do, thanks.',
    time: $scope.timeStamp()
  }, {
    userId: 'me',
    text: 'James, a question regarding the session on the 27th November, you have set three sets however still struggling with the legs from last week, shall I drop a set or take the reps slower and get it finished?',
    time: $scope.timeStamp()
  }, {
    userId: 'he',
    text: 'Stick with the two sets, get it done in flats. I will adapt your training plan for you.',
    time: $scope.timeStamp()
  }, {
    userId: 'me',
    text: 'Thanks James',
    time: $scope.timeStamp()
  }, {
    userId: 'me',
    text: 'Session complete, have submitted my times in session feedback',
    time: $scope.timeStamp()
  }];

})

.controller('AthleteChatGroupCtrl', function ($scope, $ionicScrollDelegate, $timeout) {

  $scope.hideTime = true;

  $scope.timeStamp = function () {
    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
    return d;
  };

  $scope.sendMessage = function () {

    if ($scope.data.message !== '' && $scope.data.message) {
      $scope.messages.push({
        userId: 'me',
        text: $scope.data.message,
        time: $scope.timeStamp()
      });

      delete $scope.data.message;
      $ionicScrollDelegate.scrollBottom(true);
    }

  };

  $scope.chatTap = function (m) {
    m.showTime = true;
    $timeout(function () {
      m.showTime = false;
    }, 4000);
  };
  $scope.openKb = function () {
    cordova.plugins.Keyboard.open();
  };

  $scope.data = {};
  $scope.messages = [{
    userId: 'he',
    name: 'Usain',
    surname: 'Usain',
    text: 'Hello! Welcome to Coach Mentor!',
    time: $scope.timeStamp()
  }];

})

.controller('AthleteAnalyticsCtrl', function ($scope, $ionicModal) {
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
})

.controller('AthleteInjuryCtrl', function ($scope, $ionicModal, MyServices, $ionicLoading, $ionicPopup) {
  $scope.currentPage = 1;
  var i = 0;
  $scope.allInjury = [];
  $scope.search = {
    keyword: ""
  };
  $scope.more = {
    Data: true
  };

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };


  //On Change Search Function
  $scope.searchChange = function (keywordChange) {
    if (keywordChange === '') {
      $scope.allInjury = [];
      $scope.showAllInjury(keywordChange);
    } else {
      $scope.showAllInjury(keywordChange);
    }
  };

  //Get All Competiton
  $scope.showAllInjury = function (keywordChange) {
    if (keywordChange) {
      $scope.currentPage = 1;
      $scope.allInjury = [];
    }
    MyServices.searchInjury({
      page: $scope.currentPage,
      keyword: $scope.search.keyword
    }, ++i, function (data, ini) {
      if (ini == i) {
        if (data.value) {
          _.forEach(data.data.results, function (value) {
            $scope.allInjury.push(value);
          });
          $scope.totalItems = data.data.total;
          if ($scope.totalItems > $scope.allInjury.length) {
            $scope.currentPage++;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            $scope.more.Data = false;
          }
        } else {
          $scope.showLoading('Error Loading Injurys', 2000);
        }
      }
    });
  };

  //Load More
  $scope.loadMore = function () {
    $scope.showAllInjury();
  };

  //Delete Popup
  $scope.deletePop = function (id) {
    $scope.myPopup = $ionicPopup.show({
      template: '<p>Are you sure want to delete the injury?</p>',
      title: 'Confirmation Message',
      scope: $scope,
      buttons: [{
        text: 'No'
      }, {
        text: '<b>Yes</b>',
        type: 'button-positive',
        onTap: function (e) {
          $scope.deleteInjury(id);
        }
      }]
    });
  };
  $scope.deleteInjury = function (id) {
    $scope.showLoading("Loading...", 10000);
    if (id) {
      MyServices.deleteInjury({
        _id: id
      }, function (data) {
        if (data.value) {
          $scope.allInjury = [];
          $scope.showAllInjury();
          $scope.hideLoading();
          $scope.showLoading("Injury Deleted", 2000);
        } else {
          $scope.hideLoading();
          $scope.showLoading("Error Deleting Injury", 2000);
        }
      });
    }
  };
})

.controller('AthleteInjuryCreateCtrl', function ($scope, $ionicModal, $ionicLoading, MyServices, $ionicPopup, $stateParams, $filter, $state) {
  $scope.title = 'Add';
  $scope.selectAthlete = {};
  $scope.formData = {};
  $scope.today = $filter('date')(new Date(), 'yyyy-MM-dd');
  $scope.severity = ['Minor', 'Moderate', 'Severe'];

  //Match start date & end date
  $scope.matchDate = function () {
    $scope.formData.resumeTrainingDate = $scope.formData.injuryDate;
  };

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Submit Form
  $scope.submitData = function (formData) {
    $scope.showLoading('Please wait...', 15000);
    MyServices.saveInjury(formData, function (data) {
      if (data.value === true) {
        $scope.hideLoading();
        $scope.showLoading('Injury Created', 2000);
        $state.go('app.athlete-injuries');
      } else {
        $scope.hideLoading();
        $scope.showLoading(data.data.message, 2000);
      }
    });
  };
})

.controller('AthleteInjuryDetailCtrl', function ($scope, $ionicModal, $ionicLoading, MyServices, $ionicPopup, $stateParams, $filter, $state) {
  $scope.title = 'Edit';
  $scope.formData = {};
  $scope.selectAthlete = {};
  $scope.injuryId = $stateParams.id;
  $scope.today = $filter('date')(new Date(), 'yyyy-MM-dd');
  $scope.severity = ['Minor', 'Moderate', 'Severe'];

  //Match start date & end date
  $scope.matchDate = function () {
    $scope.formData.resumeTrainingDate = $scope.formData.injuryDate;
  };

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Submit Form
  $scope.submitData = function (formData) {
    $scope.showLoading('Please wait...', 15000);
    MyServices.updateInjury(formData, function (data) {
      if (data.value === true) {
        $scope.hideLoading();
        $scope.showLoading('Injury Edited', 2000);
        $state.go('app.athlete-injuries');
      } else {
        $scope.hideLoading();
        $scope.showLoading('Error Editing Injury', 2000);
      }
    });
  };

  //get one edit
  if ($stateParams.id) {
    MyServices.getOneInjury({
      _id: $stateParams.id
    }, function (response) {
      if (response.data) {
        $scope.formData = response.data;
        $scope.selectAthlete.array = $scope.formData.athlete = response.data.athlete;
        if ($scope.formData.resumeTrainingDate) {
          $scope.formData.injuryDate = new Date($scope.formData.injuryDate);
          $scope.formData.resumeTrainingDate = new Date($scope.formData.resumeTrainingDate);
        }
      } else {
        $scope.formData = {};
      }
    });
  }

  //Delete Popup
  $scope.deletePop = function (id) {
    $scope.myPopup = $ionicPopup.show({
      template: '<p>Are you sure want to delete the injury?</p>',
      title: 'Confirmation Message',
      scope: $scope,
      buttons: [{
        text: 'No'
      }, {
        text: '<b>Yes</b>',
        type: 'button-positive',
        onTap: function (e) {
          $scope.deleteInjury(id);
        }
      }]
    });
  };
  $scope.deleteInjury = function (id) {
    $scope.showLoading("Loading...", 10000);
    if (id) {
      MyServices.deleteInjury({
        _id: id
      }, function (data) {
        if (data.value) {
          $scope.hideLoading();
          $scope.showLoading("Injury Deleted", 2000);
          $state.go('app.athlete-injuries');

        } else {
          $scope.hideLoading();
          $scope.showLoading("Error Deleting Injury", 2000);
        }
      });
    }
  };

})

.controller('AthleteSearchCoachesCtrl', function ($scope, $ionicModal, MyServices, $ionicLoading, $ionicPopup) {
  $scope.currentPage = 1;
  $scope.filter = {};
  var i = 0;
  // $scope.allCoaches = [];
  $scope.search = {
    keyword: ""
  };
  $scope.more = {
    Data: true
  };
  $ionicModal.fromTemplateUrl('templates/athlete-modal/coach-filter.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
  $scope.openFilter = function () {
    $scope.modal.show();
  };

  $scope.filterData = [{
    name: 'Age',
    value: ['Less than 20 years', '21 - 25 years', '26 - 30 years', '31 - 35 years', '36 - 40 years', 'More than 40 years']
  }, {
    name: 'Coaching Focus',
    value: ['Sprinting', 'Middle Distance', 'Endurance', 'Throws', 'Jumps', 'Hurdles', 'Hill/Fell Running', 'Cross Country']
  }, {
    name: 'Gender',
    value: ['Male', 'Female']
  }, {
    name: 'Credentials',
    value: ['Level 1', 'Level 2', 'Level 3', 'Level 4']
  }, {
    name: 'Coaching Experience',
    value: ['0 - 5 years', '6 - 10 years', '11 - 15 years', '16 - 20 years', 'More than 20 years']
  }];

  $scope.filterActive = 0;
  $scope.selectedFilters = {};

  $scope.changeFilter = function (data) {
    $scope.filterActive = data;
  };

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };


  //On Change Search Function
  $scope.searchChange = function (keywordChange) {
    if (keywordChange === '') {
      $scope.allCoaches = [];
      $scope.showAllCoaches(keywordChange);
    } else {
      $scope.showAllCoaches(keywordChange);
    }
  };

  //Get All coaches
  $scope.showAllCoaches = function (keywordChange) {
    $scope.allCoaches = [];
    if (keywordChange) {
      $scope.currentPage = 1;
    }
    MyServices.searchAllCoaches({
      page: $scope.currentPage,
      keyword: $scope.search.keyword,
      filter: $scope.filter
    }, ++i, function (data, ini) {
      if (ini == i) {
        if (data.value) {
          _.forEach(data.data.results, function (value) {
            $scope.allCoaches.push(value);
          });
          $scope.totalItems = data.data.total;
          if ($scope.totalItems > $scope.allCoaches.length) {
            $scope.currentPage++;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            $scope.more.Data = false;
          }
        } else {
          $scope.showLoading('Error Loading coaching', 2000);
        }
      }
    });
  };

  //Load More
  $scope.loadMore = function () {
    $scope.showAllCoaches();
  };

  $scope.filter.age = [];
  $scope.filter.coachingFocus = [];
  $scope.filter.gender = [];
  $scope.filter.credentials = [];
  $scope.filter.experience = [];
  $scope.pushSubCategory = function (subcat, catName) {
    var numberPattern = /\d+/g;
    //age
    if (catName == 'Age') {
      // console.log($scope.selectedFilters[subcat]);
      if ($scope.selectedFilters[subcat] == true) {
        var agedata = subcat.match(numberPattern);
        if (agedata.length > 1) {
          var age = agedata[0] + "-" + agedata[1];
        } else {
          age = agedata[0];
        }
        $scope.filter.age.push(age);
      } else {
        var arraydata = $scope.filter.age.indexOf(subcat);
        $scope.filter.age.splice(arraydata, 1);
      }
    }
    //Coaching Focus
    if (catName == 'Coaching Focus') {
      if ($scope.selectedFilters[subcat] == true) {
        $scope.filter.coachingFocus.push(subcat);
      } else {
        var arraydata = $scope.filter.coachingFocus.indexOf(subcat);
        $scope.filter.coachingFocus.splice(arraydata, 1);
      }
    }

    //Gender
    if (catName == 'Gender') {
      if ($scope.selectedFilters[subcat] == true) {
        $scope.filter.gender.push(subcat);
      } else {
        var arraydata = $scope.filter.gender.indexOf(subcat);
        $scope.filter.gender.splice(arraydata, 1);
      }
    }

    //Credentials
    if (catName == 'Credentials') {
      if ($scope.selectedFilters[subcat] == true) {
        $scope.filter.credentials.push(subcat);
      } else {
        var arraydata = $scope.filter.credentials.indexOf(subcat);
        $scope.filter.credentials.splice(arraydata, 1);
      }
    }

    //Coaching Experience
    if (catName == 'Coaching Experience') {
      if ($scope.selectedFilters[subcat] == true) {
        var experiencedata = subcat.match(numberPattern);
        if (experiencedata.length > 1) {
          var experience = experiencedata[0] + "-" + experiencedata[1];
        } else {
          experience = experiencedata[0];
        }
        $scope.filter.experience.push(experience);
      } else {
        var arraydata = $scope.filter.experience.indexOf(subcat);
        $scope.filter.experience.splice(arraydata, 1);
      }
    }
  }

  $scope.filterParameteres = function () {
    $scope.showAllCoaches();
    $scope.closeModal();
  }

})

.controller('AthleteSearchCoachesDetailCtrl', function ($scope, $ionicModal, $ionicLoading, $stateParams, MyServices, $state, $ionicScrollDelegate, $ionicPopup) {
  $scope.coaches = {};
  $scope.athleteData = MyServices.getUser();

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };
  $scope.showLoading('Please wait...', 15000);
  //get one edit
  if ($stateParams.id) {
    MyServices.getOneCoaches({
      _id: $stateParams.id
    }, function (response) {
      if (response.data) {
        $scope.coaches = response.data;
        $scope.hideLoading();
      } else {
        $scope.showLoading('Error Loading Data!', 1000);
        $scope.coaches = {};
      }
    });
  }

  $scope.reqestToCoach = function (data) {
    $scope.showLoading('Please wait...', 15000);
    $scope.reqData = {
      reason: data,
      coach: $stateParams.id,
      athlete: $scope.athleteData._id
    };
    MyServices.sendRequestToCoach($scope.reqData, function (response) {
      if (response.value === true) {
        $scope.hideLoading();
        $scope.showLoading('Request Sent Successfully!', 2000);
        $state.go('app.athlete-search-coaches');
      }
    });
  };

  $ionicModal.fromTemplateUrl('templates/athlete-modal/message-box.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
    $scope.messageInfo = {
      title: 'Request Subscription',
      subTitle: 'Please enter some message!'
    };
  });
  $scope.subscribeNow = function () {
    $scope.modal.show();
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };

  $scope.submitMessage = function (data) {
    $scope.reqestToCoach(data);
  };

})

.controller('AthleteCoachCtrl', function ($scope, $ionicModal) {
  $scope.coach = [{
    name: 'Matt',
    surname: 'Smith',
    image: 'img/img-placeholder.png',
    acceptedDate: new Date('13 May, 2016'),
    renewalDate: new Date('12 June, 2016'),
    subscriptionType: 'Monthly'
  }, {
    name: 'John',
    surname: 'Damon',
    image: 'img/img-placeholder.png',
    acceptedDate: new Date('17 August, 2016'),
    renewalDate: new Date('16 August, 2017'),
    subscriptionType: 'Annual'
  }];
})

.controller('AthleteCoachDetailCtrl', function ($scope, $ionicModal, $ionicScrollDelegate, MyServices, $ionicPopup) {
  $scope.athleteData = MyServices.getUser();
  var athleteId = $scope.athleteData._id;
  $scope.unsubscribe = {};

  $scope.myCoachProfile = undefined;
  if (athleteId) {
    MyServices.getMyCoach({
      athleteId: athleteId
    }, function (response) {
      if (response.value == true) {
        $scope.myCoachProfile = response.data;
      } else {
        $scope.myCoachProfile = "";
      }
    })
  }

  $scope.Unsubscription = function (athleteCoachId) {
    $scope.unsubscribe._id = athleteCoachId;
    $scope.unsubscribe.athleteID = athleteId;
    $scope.data = {};
    var myPopup = $ionicPopup.show({
      template: '<textarea auto-grow type="password" ng-model="data.reason"><textarea>',
      title: '<h4>Unsubscription!</h4>',
      subTitle: 'Please enter some reason',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
      }, {
        text: '<b>Reject</b>',
        type: 'button-assertive',
        onTap: function (e) {
          $scope.unsubscribeCoach();
        }
      }, ]
    });
  };

  $scope.unsubscribeCoach = function () {
    $scope.unsubscribe.status = "Unsubscribe";
    MyServices.Unsubscribeacoach($scope.unsubscribe, function (response) {
      // if (response.value === true) {
      // } else {
      // }
    })
  }

})

.controller('AthleteNotificationsCtrl', function ($scope, MyServices, $ionicModal, $ionicScrollDelegate, $ionicPopup) {
  $scope.athleteData = MyServices.getUser();
  var i = 0;

  var athlete = $scope.athleteData._id;

  $scope.showAthleteNotification = function (athlete) {
    $scope.totalItems = undefined;
    $scope.athletenotifications = undefined;
    $scope.currentPage = 1;
    MyServices.getAthleteNotification({
      Id: athlete,
      page: $scope.currentPage
    }, ++i, function (response, ini) {
      if (ini == i) {
        if (response.value == true) {
          $scope.isAthlete = true;
          $scope.athletenotifications = response.data.results;;
          $scope.notificationCount = response.data.unreadcount;
          $scope.maxRow = response.data.count;
          $scope.totalItems = response.data.total;

        } else {
          $scope.athletenotifications = [];
        }
      }

    })
  }
  $scope.showAthleteNotification(athlete);

  $scope.readNotification = function () {
    $scope.totalItems = undefined;
    $scope.athletenotifications = undefined;
    $scope.coachnotifications = undefined;
    $scope.currentPage = 1;

    MyServices.readathleteNotification({
      Id: athlete,
      page: $scope.currentPage
    }, ++i, function (response, ini) {
      if (ini == i) {
        if (response.value == true) {
          $scope.isAthlete = true;
          $scope.athletenotifications = response.data.results;
          $scope.maxRow = response.data.options.count;
          $scope.totalItems = response.data.total;
          $scope.showAthleteNotification(athlete);

        } else {
          $scope.athletenotifications = [];
        }
      }
    })
  }

  $scope.reason = function () {
    $scope.data = {};
    var myPopup = $ionicPopup.show({
      template: '<textarea auto-grow type="password" ng-model="data.message"><textarea>',
      title: '<h4>Reject Competition!</h4>',
      subTitle: 'Please enter some reason',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
      }, {
        text: '<b>Reject</b>',
        type: 'button-assertive',
        onTap: function (e) {
          console.log($scope.data.message);
        }
      }, ]
    });
  };

  $scope.readNotification();

  $ionicModal.fromTemplateUrl('templates/athlete-modal/modal-paynow.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.closePayNow = function () {
    $scope.modal.hide();
  };
  $scope.openPayNow = function (coachdata) {
    $scope.formData = {};
    $scope.formData.coachPrice = coachdata.coach.coachAskingPrice;
    $scope.coachAthleyteId = coachdata._id;
    $scope.modal.show();
  };
  $scope.paySubscription = function (subscriptionData) {
    if (subscriptionData.subscriptionType == "Yearly") {
      subscriptionData.coachAskingPrice = subscriptionData.coachPrice * 11;
    }
    subscriptionData._id = $scope.coachAthleyteId;
    subscriptionData.status = "Active";
    MyServices.paySubscription(subscriptionData, function (response) {
      if (response.value == true) {
        $scope.closePayNow();
      } else {
        $scope.closePayNow();
      }
    })
  }
})

.controller('AthleteTrainingDiaryCtrl', function ($scope, $ionicModal, $ionicLoading, uiCalendarConfig, MyServices) {

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };

  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Feedback Modal
  $ionicModal.fromTemplateUrl('templates/athlete-modal/feedback.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function () {
    $scope.modal.show();
  };

  $scope.closeModal = function () {
    $scope.modal.hide();
  };

  $scope.getAthletePlan = function () {
    $scope.athleteData = [];
    MyServices.getAthleteMyPlans({}, function (data) {
      if (_.isArray(data.data)) {
        $scope.athleteData = data.data;
        parsePlanToCalender(data.data);
        $scope.hideLoading();
      } else {
        $scope.athleteData = [];
        $scope.showLoading('Loading...', 10000);
        $scope.hideLoading();
      }

    });
  };
  $scope.showLoading('Loading...', 10000);

  $scope.getAthletePlan();
  $scope.athleteData = [];
  $scope.trainingDiary = [];

  function parsePlanToCalender(Plans) {
    $scope.trainingDiary = [];
    $scope.downloads = Plans;
    _.each(Plans, function (plan) {
      var startDays = 0;
      _.each(plan.trainingForms, function (form) {
        form.trainingPlan = plan._id;
        var obj = {
          color: form.form.colorCode,
          events: [{
            title: "• " + form.form.name + " - " + plan.name,
            start: moment(plan.startDate).add(startDays, "days").toDate(),
            end: moment(plan.startDate).add(startDays, "days").add(form.duration, 'days').toDate(),
            allDay: true,
            planForm: form,
            colorCode: form.form.colorCode
          }],
        };
        startDays += form.duration;
        if (!_.isEmpty(form.comment)) {
          var obj2 = _.cloneDeep(obj);
          obj2.color = "#444";
          obj2.events[0].title = "Comment: " + form.comment;
          $scope.trainingDiary.push(obj2);
        }
        $scope.trainingDiary.push(obj);
      });
    });
    changePendingForm();
  }

  /* alert on eventClick */
  $scope.dairyClick = function (obj) {
    $scope.dayInfo = obj;
    $scope.formInfo = obj.planForm;

    if (obj.planForm.answer && obj.planForm.answer.length > 0) {
      $scope.feedback = obj.planForm.answer;
      $scope.makeDisable = true;
    } else {
      $scope.feedback = obj.planForm.form.formFields;
      $scope.makeDisable = false;
    }

    var m = moment(obj.end._d);
    if (moment().isSameOrAfter(m)) {
      $scope.openModal();
    }
  };

  $scope.dayClick = function (date, jsEvent, view) {
    console.log(date);
  };

  var changePendingForm = function () {
    $scope.pendingForm = [];
    _.each($scope.trainingDiary, function (events) {
      _.each(events.events, function (obj) {
        var m = moment(obj.end);
        if (!(obj.planForm.answer && obj.planForm.answer.length > 0) && moment().isSameOrAfter(m)) {
          $scope.pendingForm.push(obj);
        }
      });
    });
  };

  $scope.submitFeedback = function () {
    var obj = {};
    obj.trainingPlan = $scope.formInfo.trainingPlan;
    obj.trainingForm = $scope.formInfo._id;
    obj.trainingFormStart = "";
    obj.trainingFormEnd = "";
    obj.answer = $scope.formInfo.form.formFields;
    MyServices.saveAnswer(obj, function (data) {
      $scope.showLoading('Feedback Submitted Successfully', 2000);
      $scope.getAthletePlan();
    });
  };

  /* Change View */
  $scope.activeView = 'month';
  $scope.changeView = function (view) {
    uiCalendarConfig.calendars.athleteDiary.fullCalendar('changeView', view);
    $scope.activeView = view;
  };

  //Navigate Buttons
  $scope.navigate = function (val) {
    uiCalendarConfig.calendars.athleteDiary.fullCalendar(val);
  };

  $scope.uiConfig = {
    calendar: {
      firstDay: 1,
      height: 450,
      editable: false,
      eventClick: $scope.dairyClick,
      viewRender: function (view) {
        $scope.viewTitle = view.title;
      }
    }
  };
})
.controller('AthleteRegistrationCtrl', function ($scope, $state, $ionicPopup, MyServices, $ionicLoading, $filter, $ionicModal) {

  $scope.formData = {};

  $scope.gender = ['Male', 'Female'];

  $scope.maxDate = $filter('date')(new Date(), 'yyyy-MM-dd');

  $scope.onlyAplha = /^[a-zA-Z_]+$/;
  $scope.validEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Password Validator
  $scope.valid1 = false;
  $scope.valid2 = false;
  $scope.passwordValidator = function (password) {
    $scope.passwordInvalid = true;
    if (password && password.length >= 8 && password.length <= 15) {
      $scope.valid1 = true;
    } else {
      $scope.valid1 = false;
    }
    if (/([a-zA-Z])/.test(password) && /([0-9])/.test(password)) {
      $scope.valid2 = true;
    } else {
      $scope.valid2 = false;
    }
    if ($scope.valid1 && $scope.valid2) {
      $scope.passwordInvalid = false;
    } else {
      $scope.passwordInvalid = true;
    }
  };

  //Submit Form
  $scope.submitData = function (formData) {
    $scope.showLoading('Please wait...', 15000);
    MyServices.register(formData, function (data) {
      if (data.value === true) {
        $scope.formData = {};
        $scope.hideLoading();
        $scope.showLoading('Registration Successful!', 2000);
        $state.go('athlete-login');
      } else {
        $scope.hideLoading();
        $scope.showLoading('Registration Failed!', 2000);
      }
    });
  };

  //Terms Popup
  $scope.termsID = {
    _id: "580cc6877f2ec11727460f1f"
  };
  $scope.privacyID = {
    _id: "580cc67b7f2ec11727460f1c"
  };
  $scope.termsPopup = function (data) {
    $scope.myPopup = $ionicPopup.show({
      template: '<p>Do you agree to the Coach Mentor <span class="link" ng-click="staticModal(termsID)">Terms of Service</span> and <span class="link" ng-click="staticModal(privacyID)">Privacy Policy</span>?</p>',
      title: 'Terms & Conditions',
      scope: $scope,
      buttons: [{
        text: 'No'
      }, {
        text: '<b>Yes</b>',
        type: 'button-positive',
        onTap: function (e) {
          $scope.submitData(data);
        }
      }]
    });
  };

  //Terms Modal
  $ionicModal.fromTemplateUrl('templates/athlete-modal/static-page.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.staticModal = function (id) {
    $scope.staticData = '';
    $scope.myPopup.close();
    $scope.showLoading('Loading...', 15000);
    MyServices.getStatic(id, function (data) {
      if (data.value === true) {
        $scope.staticData = data.data;
        $scope.hideLoading();
      } else {
        $scope.hideLoading();
        $scope.showLoading('Loading Failed!', 2000);
      }
    });
    $scope.modal.show();
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };

})

//end of Athlete controller
//Start of Marketplace controller
.controller('MarketplaceServiceCtrl', function ($scope, $ionicModal, $timeout,$ionicPopup) {
  // $scope.template = TemplateService.changecontent("marketplace/service-provider-list");
  //     TemplateService.title = "Service Providers";
  //     $scope.navigation = NavigationService.getNavMarketplace();
  //     $scope.template.header = ' views/header-web.html';
  //     $scope.activeTab = 1;
  //     $scope.toggleTab = function(val) {
  //         $scope.activeTab = val;
  //     };
  $scope.categories = ['Sports therapist', 'Physiotherapist', 'Nutritionist', 'Personal Trainers', 'Specialist Doctors', 'Other'];

      $scope.searchpop = function () {
       $scope.searchopen = $ionicPopup.show({
         templateUrl: 'templates/athlete-modal/search.html',
         scope: $scope,
         cssClass:'searchpop'
       });
      }
      $scope.searchPopup = function () {
         $scope.searchopen.close();
       }
  $scope.searchshow = false;
    $scope.search = function() {
        $scope.searchshow =  ! $scope.searchshow;
    };
      $scope.categories = ['Sports therapist', 'Physiotherapist', 'Nutritionist', 'Personal Trainers', 'Specialist Doctors', 'Other'];

      $scope.serviceListBanner = {
          bannerImg: ' img/marketplace/service-list.png',
      };
      $scope.serviceList = function() {
          modal = $uibModal.open({
              animation: true,
              templateUrl: " views/modal/service-popup.html",
              windowClass: "modal-service",
              scope: $scope
          });
      };
      $scope.servicePopup = {
          "image": " img/marketplace/pic2.png",
          "name": "alexi",
          "surname": "gambetta",
          "type": 'orthopedic doctor',
          "country": 'London',
          "website": 'www.coachmentor.com',
          "city": 'big ben city',
          "mailId": 'alexigambetta@gmail.com',
          "description": "<p>When dressing for the cold, it is important to dress in layers and to remember that you will still feel cold when you first go outside. Once you start running, your body will perceive the outdoor temperature at about 20 degrees warmer than it actually is! This means that if you are warm when you first go outside you are likely overdressed and could end up overheating.</p><p>When it comes to layering clothes, keep in mind that your first layer should always be a wicking layer. This fabric will help to keep sweat off your body, while maintaining your core temperature without overheating. On top of this layer you can wear another top, as well as a windbreaker to give you extra protection against the harsh winter winds.</p>"

      };
      $scope.eventsGalleryDetaiLlist = [{
          "img": " img/marketplace/event2.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": " img/marketplace/play.png"
      }, {
          "img": " img/marketplace/event6.png",
          "url": " img/marketplace/event6.png",
          "classCircle": "dis-non",
          "urlPlay": ""
      }, {
          "img": " img/marketplace/event4.png",
          "url": " img/marketplace/event4.png",
          "classCircle": "dis-non",
          "urlPlay": ""
      }, {
          "img": " img/marketplace/event12.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": " img/marketplace/play.png"
      }, {
          "img": " img/marketplace/event11.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": " img/marketplace/play.png"
      }, {
          "img": " img/marketplace/event5.png",
          "url": " img/marketplace/event5.png",
          "classCircle": "dis-non",
          "urlPlay": ""
      }, {
          "img": " img/marketplace/event4.png",
          "url": " img/marketplace/event4.png",
          "classCircle": "dis-non",
          "urlPlay": ""
      }, {
          "img": " img/marketplace/event10.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": " img/marketplace/play.png"
      }, {
          "img": " img/marketplace/event7.png",
          "url": " img/marketplace/event7.png",
          "classCircle": "dis-non",
          "urlPlay": ""
      }];
      $scope.servicelist = [{
          "image": "img/marketplace/pic1.png",
          "name": "Alexi",
          "surname": "Gambetta",
          "type": 'Orthopedic Doctor',
          "country": 'London',
          "city": 'big ben city',
          "mailId": 'johnkenly@gmail.com',
          "description": "Proin theul tempus placerat magna, non maximus ame dolor feugiat non."

      }, {
          "image": "img/marketplace/pic2.png",
          "name": "John",
          "surname": "Gambetta",
          "type": 'Orthopedic Doctor',
          "country": 'London',
          "city": 'big ben city',
          "mailId": 'johnkenly@gmail.com',
          "description": " Proin theul tempus placerat magna, non maximus ame dolor feugiat non."

      }, {
          "image": "img/marketplace/pic3.png",
          "name": "Carter",
          "surname": "Gambetta",
          "type": 'Orthopedic Doctor',
          "country": 'London',
          "city": 'big ben city',
          "mailId": 'johnkenly@gmail.com',
          "description": "Proin theul tempus placerat magna, non maximus ame dolor feugiat non."

      }, {
          "image": "img/marketplace/pic4.png",
          "name": "Liya",
          "surname": "Gambetta",
          "type": 'Orthopedic Doctor',
          "country": 'London',
          "city": 'big ben city',
          "mailId": 'johnkenly@gmail.com',
          "description": "Proin theul tempus placerat magna, non maximus ame dolor feugiat non."
      }, {
          "image": "img/marketplace/pic5.png",
          "name": "Roji",
          "surname": "Gambetta",
          "type": 'Orthopedic Doctor',
          "country": 'London',
          "city": 'big ben city',
          "mailId": 'johnkenly@gmail.com',
          "description": "Proin theul tempus placerat magna, non maximus ame dolor feugiat non."
      }, ];
})
.controller('MarketplaceEventsCtrl', function ($scope, $ionicModal, $timeout,$ionicPopup) {

      $scope.searchpop = function () {
       $scope.searchopen = $ionicPopup.show({
         templateUrl: 'templates/athlete-modal/search.html',
         scope: $scope,
         cssClass:'searchpop'
       });
      }
      $scope.searchPopup = function () {
         $scope.searchopen.close();
       }
  $scope.categories = ['Track and Field', 'Park Runs', 'Fun Runs', 'Road Runs', 'Triathlons and Duathlons', 'Extreme and Ultra', 'Trail Racing', 'Other'];
  $scope.searchshow = false;
    $scope.search = function() {
        $scope.searchshow =  ! $scope.searchshow;
    };
      $scope.eventListBanner = {
          img: ' img/marketplace/event-landing.png',
      };
      $scope.eventList = function() {
          modal = $uibModal.open({
              animation: true,
              templateUrl: " views/modal/event-popup.html",
              windowClass: "modal-event",
              scope: $scope
          });
      };
      $scope.categories = ['Track and Field', 'Park Runs', 'Fun Runs', 'Road Runs', 'Triathlons and Duathlons', 'Extreme and Ultra', 'Trail Racing', 'Other'];
      $scope.Eventlist = [{
          "img": " img/marketplace/event12.png",
          "title": "winter running events.",
          "place": "London",
          "date": "jan 22-25"

      }, {
          "img": " img/marketplace/event11.png",
          "title": " swimming compititions",
          "place": "London",
          "date": "jan 22-25"
      }, {
          "img": " img/marketplace/event9.png",
          "title": "winter running events",
          "place": "London",
          "date": "jan 22-25"
      }, {
          "img": " img/marketplace/event10.png",
          "title": " swimming compititions",
          "place": "London",
          "date": "jan 22-25"
      }, {
          "img": " img/marketplace/event6.png",
          "title": "winter running events",
          "place": "London",
          "date": "jan 22-25"
      }, {
          "img": " img/marketplace/event3.png",
          "title": "swimming compititions",
          "place": "London",
          "date": "jan 22-25"
      }];

      $scope.data = {
          "image": ' img/marketplace/event2-banner.png',
          "title": 'Winter running events',
          "date": 'jan 22-25 2017',
          "place": 'London',

      };

      $scope.eventsGalleryDetaiLlist = [{
          "img": " img/marketplace/event2.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": " img/marketplace/play.png"
      }, {
          "img": " img/marketplace/event6.png",
          "url": "",
          "classCircle": "dis-non",
          "urlPlay": ""
      }, {
          "img": " img/marketplace/event12.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": " img/marketplace/play.png"
      }, {
          "img": " img/marketplace/event10.png",
          "url": "",
          "classCircle": "dis-non",
          "urlPlay": ""
      }, {
          "img": " img/marketplace/event9.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": " img/marketplace/play.png"
      }, {
          "img": " img/marketplace/event7.png",
          "url": "",
          "classCircle": "dis-non",
          "urlPlay": ""
      }, {
          "img": " img/marketplace/event5.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": "f img/marketplace/play.png"
      }, {
          "img": " img/marketplace/event8.png",
          "url": "",
          "classCircle": "dis-non",
          "urlPlay": ""
      }, {
          "img": " img/marketplace/event11.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": " img/marketplace/play.png"
      }, {
          "img": " img/marketplace/event4.png",
          "url": "",
          "classCircle": "dis-non",
          "urlPlay": ""
      }, {
          "img": " img/marketplace/event10.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": " img/marketplace/play.png"
      }, {
          "img": " img/marketplace/event12.png",
          "url": "",
          "classCircle": "dis-non",
          "urlPlay": ""
      }];
})
.controller('MarketplaceArticlesCtrl', function ($scope, $ionicModal, $timeout ,$ionicPopup) {
  $scope.searchshow = false;
    $scope.search = function() {
        $scope.searchshow =  ! $scope.searchshow;
    };
    $scope.articleListBanner = {
        img: ' img/marketplace/article-list-landing.png',
    };
    $scope.view = function() {
        modal = $uibModal.open({
            animation: true,
            templateUrl: " views/modal/article-list-view.html",
            windowClass: "modal-article-view",
            scope: $scope
        });
    };
    $scope.categories = ['Training and performance', ' Nutrition', ' Coaching', '   Parents and Guardians', 'News', 'Tips and Techniques'];
    $scope.marketlist = [{
        "profile": "img/marketplace/pic1.png",
        "name": "vern",
        "surname": "gambetta",
        "date": "december 1, 2016 ",
        "rate": "£ 22",
        "likes": "210 ",
        "dislikes": "0",
        "img": "img/marketplace/event2.png",
        "title": "some thoughts, reflections & advice on coaching."
    }, {
        "profile": "img/marketplace/pic4.png",
        "name": "kristin",
        "surname": "dryden",
        "date": "december 2, 2016 ",
        "rate": "£ 25",
        "likes": "210 ",
        "dislikes": "0",
        "img": "img/marketplace/event3.png",
        "title": " biased training"
    }, {
        "profile": "img/marketplace/pic3.png",
        "name": "john",
        "surname": "grace",
        "date": "january 21, 2016 ",
        "rate": "free",
        "likes": "210 ",
        "dislikes": "0",
        "img": "img/marketplace/event4.png",
        "title": "is max strength as important as we think?"
    }, {
        "profile": "img/marketplace/pic2.png",
        "name": "john",
        "surname": "grace",
        "date": "january 21, 2016 ",
        "rate": "free",
        "likes": "210 ",
        "dislikes": "0",
        "img": "img/marketplace/event5.png",
        "title": "is max strength as important as we think?"
    }];
    $scope.articleDetail = {
        image: ' img/marketplace/artical-popup.png',
        title: 'some thoughts,reflections & advice on coaching.',
        price: '£ 25',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fringilla, libero eu tempus tempr lectus nunc lacinia ex, vestibulum sollicitudin arcu ante in est. Nulla mollis neque nec imperd pellentesque. Ut efficitur tempor leo non vestibulum. Aliquam ultricies commodo risus, vitaery interdum orci dictum vel. Donec feugiat urna turpis. Aenean vitae eleifend lorem, condimentn lobortis nibh. Proin et venenatis ipsum, eget pulvinar ligula.'

    };
    $scope.article = function () {

     $scope.articleopen = $ionicPopup.show({
       templateUrl: 'templates/athlete-modal/article-modal.html',
       scope: $scope,
       cssClass:'articlepop'
     });
    }

    $scope.closePopup = function () {
       $scope.articleopen.close();
     };

    $scope.searchpop = function () {
     $scope.searchopen = $ionicPopup.show({
       templateUrl: 'templates/athlete-modal/search.html',
       scope: $scope,
       cssClass:'searchpop'
     });
    }
    $scope.searchPopup = function () {
       $scope.searchopen.close();
     }
    $scope.categories = ['Training and performance', ' Nutrition', ' Coaching', '   Parents and Guardians', 'News', 'Tips and Techniques'];

})
.controller('MarketplaceServiceDetailCtrl', function ($scope, $state, $ionicPopup, MyServices, $ionicLoading, $filter, $ionicModal) {
  $scope.servicePopup = {
      "image": "img/marketplace/pic2.png",
      "name": "alexi",
      "surname": "gambetta",
      "type": 'orthopedic doctor',
      "country": 'London',
      "website": 'www.coachmentor.com',
      "city": 'big ben city',
      "mailId": 'alexigambetta@gmail.com',
      "description": "<p>When dressing for the cold, it is important to dress in layers and to remember that you will still feel cold when you first go outside. Once you start running, your body will perceive the outdoor temperature at about 20 degrees warmer than it actually is! This means that if you are warm when you first go outside you are likely overdressed and could end up overheating.</p><p>When it comes to layering clothes, keep in mind that your first layer should always be a wicking layer. This fabric will help to keep sweat off your body, while maintaining your core temperature without overheating. On top of this layer you can wear another top, as well as a windbreaker to give you extra protection against the harsh winter winds.</p>"

  };

    $scope.eventsGalleryDetaiLlist = [{
        "img": "  img/marketplace/event2.png",
        "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
        "classCircle": "play-circle",
        "urlPlay": "  img/marketplace/play.png"
    }, {
        "img": "  img/marketplace/event6.png",
        "url": "  img/marketplace/event6.png",
        "classCircle": "dis-non",
        "urlPlay": ""
    }, {
        "img": "  img/marketplace/event4.png",
        "url": "  img/marketplace/event4.png",
        "classCircle": "dis-non",
        "urlPlay": ""
    }, {
        "img": "  img/marketplace/event12.png",
        "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
        "classCircle": "play-circle",
        "urlPlay": "  img/marketplace/play.png"
    }, {
        "img": "  img/marketplace/event11.png",
        "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
        "classCircle": "play-circle",
        "urlPlay": "  img/marketplace/play.png"
    }, {
        "img": "  img/marketplace/event5.png",
        "url": "  img/marketplace/event5.png",
        "classCircle": "dis-non",
        "urlPlay": ""
    }, {
        "img": "  img/marketplace/event4.png",
        "url": "  img/marketplace/event4.png",
        "classCircle": "dis-non",
        "urlPlay": ""
    }, {
        "img": "  img/marketplace/event10.png",
        "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
        "classCircle": "play-circle",
        "urlPlay": "  img/marketplace/play.png"
    }, {
        "img": "  img/marketplace/event7.png",
        "url": "  img/marketplace/event7.png",
        "classCircle": "dis-non",
        "urlPlay": ""
    }];
        $scope.eventsGalleryDetaiLlist=_.chunk($scope.eventsGalleryDetaiLlist,2);
  })
.controller('MarketplaceEventDetailCtrl', function ($scope, $state, $ionicPopup, MyServices, $ionicLoading, $filter, $ionicModal) {

      $scope.data = {
          "image": 'frontend/img/marketplace/event2-banner.png',
          "title": 'Winter running events',
          "date": 'jan 22-25 2017',
          "place": 'London',

      };
      $scope.eventsGalleryDetaiLlist = [{
          "img": "  img/marketplace/event2.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": "  img/marketplace/play.png"
      }, {
          "img": "  img/marketplace/event6.png",
          "url": "  img/marketplace/event6.png",
          "classCircle": "dis-non",
          "urlPlay": ""
      }, {
          "img": "  img/marketplace/event4.png",
          "url": "  img/marketplace/event4.png",
          "classCircle": "dis-non",
          "urlPlay": ""
      }, {
          "img": "  img/marketplace/event12.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": "  img/marketplace/play.png"
      }, {
          "img": "  img/marketplace/event11.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": "  img/marketplace/play.png"
      }, {
          "img": "  img/marketplace/event5.png",
          "url": "  img/marketplace/event5.png",
          "classCircle": "dis-non",
          "urlPlay": ""
      }, {
          "img": "  img/marketplace/event4.png",
          "url": "  img/marketplace/event4.png",
          "classCircle": "dis-non",
          "urlPlay": ""
      }, {
          "img": "  img/marketplace/event10.png",
          "url": "https://www.youtube.com/embed/VQ-6nYDqAZc?autoplay=1",
          "classCircle": "play-circle",
          "urlPlay": "  img/marketplace/play.png"
      }, {
          "img": "  img/marketplace/event7.png",
          "url": "  img/marketplace/event7.png",
          "classCircle": "dis-non",
          "urlPlay": ""
      }];
      $scope.viewTab = 1;
          $scope.eventsGalleryDetaiLlist=_.chunk($scope.eventsGalleryDetaiLlist,2);
          $scope.getTab = function(val) {
            if(val==1){
              console.log('first');
              $scope.viewTab ==1;
            }else if (val == 2) {
              console.log('second');
              $scope.viewTab == 2;
            }else if (val == 3) {
              console.log('thirs');
              $scope.viewTab == 3;
            }else {
              $scope.viewTab == 1;
            }
          }
  })


.controller('MarketplaceArticleDetailCtrl', function ($scope, $ionicModal, $timeout) {

    $scope.articleDetail = {
        image: ' img/marketplace/artical-popup.png',
        title: 'some thoughts,reflections & advice on coaching.',
        price: '£ 25',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fringilla, libero eu tempus tempr lectus nunc lacinia ex, vestibulum sollicitudin arcu ante in est. Nulla mollis neque nec imperd pellentesque. Ut efficitur tempor leo non vestibulum. Aliquam ultricies commodo risus, vitaery interdum orci dictum vel. Donec feugiat urna turpis. Aenean vitae eleifend lorem, condimentn lobortis nibh. Proin et venenatis ipsum, eget pulvinar ligula.'

    };
    $scope.articleBanner = {
        bannerImg: ' img/marketplace/article-detail.png',
        profile: ' img/marketplace/profile2.png',
        title: 'maintaining your winter running routine',
        name: 'kristin',
        surname: 'dryden',
        date: ' December 21, 2016',
        category: ' Nutrition',
        likes: '25',
        dislikes: '3',
        content: '<p>Although running outside in the winter can be intimidating due to conditions like ice, snow and cold, you can keep your running mileage up if you have the right gear and follow some practical cold-weather safety tips. Read below for guidance on how to stay warm when battling some of the year’s coldest temperatures.</p><strong>Wear Layers</strong><p>When dressing for the cold, it is important to dress in layers and to remember that you will still feel cold when you first go outside. Once you start running, your body will perceive the outdoor temperature at about 20 degrees warmer than it actually is! This means that if you are warm when you first go outside you are likely overdressed and could end up overheating.</p><p>When it comes to layering clothes, keep in mind that your first layer should always be a wicking layer. This fabric will help to keep sweat off your body, while maintaining your core temperature without overheating. On top of this layer you can wear another top, as well as a windbreaker to give you extra protection against the harsh winter winds.</p><strong>Cover Your Head, Hands and Feet</strong><p>In addition to wearing layers on your body, it is important to wear the appropriate attire on your head, hands and feet.</p><p>For starters, keep your head warm with a good running hat that is form fitting and keeps your ears protected. It is also a good idea to have running-specific gloves. This type of glove has a wicking fabric on the inside to prevent excessive sweat from accumulating on the hands, which may lead to frostbite.</p>'

    };
    $scope.articleDetaiLlist = [{
        "profile": " img/marketplace/pic1.png",
        "name": "vern",
        "surname": "gambetta",
        "date": "december 1, 2016 ",
        "rate": "free",
        "img": " img/marketplace/event8.png",
        "title": "some thoughts, reflections & advice on coaching."
    }, {
        "profile": " img/marketplace/pic2.png",
        "name": "kristin",
        "surname": "dryden",
        "date": "december 2, 2016 ",
        "rate": "£ 22",
        "img": " img/marketplace/event12.png",
        "title": " biased training"
    }, {
        "profile": " img/marketplace/pic3.png",
        "name": "john",
        "surname": "grace",
        "date": "january 21, 2016 ",
        "rate": "free",
        "img": " img/marketplace/event9.png",
        "title": "is max strength as important as we think?"
    }];
    $scope.articleDetail = {
    image: 'frontend/img/marketplace/artical-popup.png',
    title: 'some thoughts,reflections & advice on coaching.',
    price: '£ 25',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fringilla, libero eu tempus tempr lectus nunc lacinia ex, vestibulum sollicitudin arcu ante in est. Nulla mollis neque nec imperd pellentesque. Ut efficitur tempor leo non vestibulum. Aliquam ultricies commodo risus, vitaery interdum orci dictum vel. Donec feugiat urna turpis. Aenean vitae eleifend lorem, condimentn lobortis nibh. Proin et venenatis ipsum, eget pulvinar ligula.'

};})
//End of Marketplace controller


// Start Coach controller
.controller('appCtrl', function ($scope, $ionicModal, $timeout, $state, $rootScope, MyServices) {
  $scope.profileData = MyServices.getUser();

  // Log out
  $scope.logout = function () {
    $.jStorage.flush();
    $state.go('coach-login');
  };

})

.controller('CoachRegistrationCtrl', function ($scope, $state, $ionicPopup, MyServices, $filter, $ionicLoading, $ionicModal) {

  $scope.formData = {};

  $scope.toggleOthers = function () {
    if ($scope.formData.specialisations.otherVal === true) {
      $scope.formData.specialisationOther = 'Others';
    } else {
      $scope.formData.specialisationOther = '';
    }
  };

  $scope.coachingFocus = [
    'Sprinting', 'Middle Distance', 'Endurance', 'Throws', 'Jumps', 'Hurdles', 'Race Walking', 'Hill/Fell Running', 'Cross Country', 'Triathlon'
  ];

  $scope.specialisations = [
    'Coaching athletes with a disability', 'Coaching female athletes', 'Eating disorders', 'First aid', 'Long-term athlete development', 'Mentored practice', 'Strength and conditioning', 'Fitness in Running and Walking', 'Children in Athletics'
  ];

  $scope.maxDate = $filter('date')(new Date(), 'yyyy-MM-dd');

  $scope.gender = ['Male', 'Female'];

  $scope.credentials = ['Level 1', 'Level 2', 'Level 3', 'Level 4'];

  $scope.onlyAplha = /^[a-zA-Z_]+$/;
  $scope.validTel = /^[+0-9]{10,15}$/;
  $scope.validNum = /^[0-9]+$/;
  $scope.validEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  MyServices.getCountries(function (data) {
    $scope.countries = data;
  });

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Password Validator
  $scope.valid1 = false;
  $scope.valid2 = false;
  $scope.passwordValidator = function (password) {
    $scope.passwordInvalid = true;
    if (password && password.length >= 8 && password.length <= 15) {
      $scope.valid1 = true;
    } else {
      $scope.valid1 = false;
    }
    if (/([a-zA-Z])/.test(password) && /([0-9])/.test(password)) {
      $scope.valid2 = true;
    } else {
      $scope.valid2 = false;
    }
    if ($scope.valid1 && $scope.valid2) {
      $scope.passwordInvalid = false;
    } else {
      $scope.passwordInvalid = true;
    }
  };

  //Submit Form
  $scope.submitData = function (formData) {
    $scope.showLoading('Please wait...', 15000);
    MyServices.registerCoach(formData, function (data) {
      if (data.value === true) {
        $scope.formData = {};
        $scope.hideLoading();
        $scope.showLoading('Registration Successful', 2000);
        $state.go('coach-login');
      } else {
        $scope.hideLoading();
        $scope.showLoading('Registration Failed', 2000);
      }
    });
  };

  //Terms Popup
  $scope.termsID = {
    _id: "580cc6877f2ec11727460f1f"
  };
  $scope.privacyID = {
    _id: "580cc67b7f2ec11727460f1c"
  };
  $scope.termsPopup = function (data) {
    $scope.myPopup = $ionicPopup.show({
      template: '<p>Do you agree to the Coach Mentor <span class="link" ng-click="staticModal(termsID)">Terms of Service</span> and <span class="link" ng-click="staticModal(privacyID)">Privacy Policy</span>?</p>',
      title: 'Terms & Conditions',
      scope: $scope,
      buttons: [{
        text: 'No'
      }, {
        text: '<b>Yes</b>',
        type: 'button-positive',
        onTap: function (e) {
          $scope.submitData(data);
        }
      }]
    });
  };


  //Terms Modal
  $ionicModal.fromTemplateUrl('templates/coach-modal/static-page.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.staticModal = function (id) {
    $scope.staticData = '';
    $scope.myPopup.close();
    $scope.showLoading('Loading...', 15000);
    MyServices.getStatic(id, function (data) {
      if (data.value === true) {
        $scope.staticData = data.data;
        $scope.hideLoading();
      } else {
        $scope.hideLoading();
        $scope.showLoading('Loading Failed', 2000);
      }
    });
    $scope.modal.show();
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
})

.controller('CoachLoginCtrl', function ($scope, $ionicModal, $timeout, $ionicHistory, $ionicLoading, MyServices, $state) {
  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();
  $ionicHistory.removeBackView();
  $ionicModal.fromTemplateUrl('templates/coach-modal/forgot-password.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function () {
    $scope.modal.show();
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
  $scope.validEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Submit Form
  $scope.submitData = function (formData) {
    $scope.showLoading('Please wait...', 15000);
    MyServices.login(formData, function (data) {
      if (data.value === true) {
        $scope.formData = {};
        $scope.hideLoading();
        $scope.showLoading('Login Successful', 2000);
        MyServices.setUser(data.data);
        $state.go('app.coach-profile');
      } else {
        $scope.hideLoading();
        $scope.showLoading(data.data.message, 2000);
      }
    });
  };
})

.controller('CoachProfileCtrl', function ($scope, $ionicScrollDelegate, $ionicHistory, $rootScope, MyServices, $ionicLoading) {
  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();
  $ionicHistory.removeBackView();
  $scope.profileData = MyServices.getUser();

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Reload Profile
  $scope.reloadProfile = function () {
    MyServices.getProfile($scope.profileData, function (data) {
      if (data.value === true) {
        MyServices.setUser(data.data);
        $scope.$broadcast('scroll.refreshComplete');
      } else {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.showLoading('Error Updating Profile', 1000);
      }
    });
  };
  $scope.reloadProfile();

  //Profile Incomplete Check
  $scope.profileIncomplete = function () {
    if (!$scope.profileData.experience || !$scope.profileData.expertise || !$scope.profileData.achievements) {
      return true;
    } else {
      return false;
    }
  };
  // console.log($scope.profileData);
  var i = 0;
  var coach = $scope.profileData._id;
  $scope.showCoachNotification = function (coach) {
    $scope.totalItems = undefined;
    $scope.coachnotifications = undefined;
    $scope.currentPage = 1;
    MyServices.getCoachNotification({
      Id: coach,
      page: $scope.currentPage
    }, ++i, function (response, ini) {
      if (ini == i) {
        if (response.value == true) {
          $scope.isAthlete = false;
          $scope.coachnotifications = response.data.results;
          $scope.notificationCount = response.data.unreadcount;
          $scope.maxRow = response.data.count;
          $scope.totalItems = response.data.total;

        } else {
          $scope.coachnotifications = [];
        }
      }

    })
  };

  $scope.showCoachNotification(coach);



})


.controller('CoachEditProfileCtrl', function ($scope, $state, MyServices, $ionicModal, $filter, $ionicLoading, $cordovaFileTransfer, $cordovaCamera) {
  $scope.formData = MyServices.getUser();
  $scope.formData.dob = new Date($scope.formData.dob);
  $scope.dummyPassword = '12345678';

  if ($scope.formData.specialisationOther) {
    $scope.formData.specialisations.otherVal = true;
  }
  //Toggle Other Specialisations
  $scope.toggleOthers = function () {
    if ($scope.formData.specialisations.otherVal === true) {
      $scope.formData.specialisationOther = 'Others';
    } else {
      $scope.formData.specialisationOther = '';
    }
  };

  $scope.coachingFocus = [
    'Sprinting', 'Middle Distance', 'Endurance', 'Throws', 'Jumps', 'Hurdles', 'Race Walking', 'Hill/Fell Running', 'Cross Country', 'Triathlon'
  ];

  $scope.specialisations = [
    'Coaching athletes with a disability', 'Coaching female athletes', 'Eating disorders', 'First aid', 'Long-term athlete development', 'Mentored practice', 'Strength and conditioning', 'Fitness in Running and Walking', 'Children in Athletics'
  ];

  $scope.maxDate = $filter('date')(new Date(), 'yyyy-MM-dd');

  $scope.gender = ['Male', 'Female'];

  $scope.credentials = ['Level 1', 'Level 2', 'Level 3', 'Level 4'];

  $scope.onlyAplha = /^[a-zA-Z_]+$/;
  $scope.validTel = /^[+0-9]{10,15}$/;
  $scope.validNum = /^[0-9]+$/;

  MyServices.getCountries(function (data) {
    $scope.countries = data;
  });

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };


  //Profile Incomplete Check
  $scope.profileIncomplete = function () {
    if (!$scope.formData.experience || !$scope.formData.expertise || !$scope.formData.achievements) {
      return true;
    } else {
      return false;
    }
  };

  //Password Validator
  $scope.passwordData = {};
  $scope.valid1 = false;
  $scope.valid2 = false;
  $scope.passwordValidator = function (password) {
    $scope.passwordInvalid = true;
    if (password && password.length >= 8 && password.length <= 15) {
      $scope.valid1 = true;
    } else {
      $scope.valid1 = false;
    }
    if (/([a-zA-Z])/.test(password) && /([0-9])/.test(password)) {
      $scope.valid2 = true;
    } else {
      $scope.valid2 = false;
    }
    if ($scope.valid1 && $scope.valid2) {
      $scope.passwordInvalid = false;
    } else {
      $scope.passwordInvalid = true;
    }
  };

  //Submit Form
  $scope.submitData = function (formData) {
    $scope.showLoading('Please wait...', 15000);
    MyServices.editProfile(formData, function (data) {
      if (data.value === true) {
        $scope.hideLoading();
        MyServices.setUser(data.data);
        $scope.showLoading('Profile Updated', 2000);
        $state.go('app.coach-profile');
      } else {
        $scope.hideLoading();
        $scope.showLoading('Please Try Again', 2000);
      }
    });
  };

  MyServices.getCountries(function (data) {
    $scope.countries = data;
  });

  $ionicModal.fromTemplateUrl('templates/coach-modal/password.html', {
    id: 1,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modalPassword = modal;
  });

  $ionicModal.fromTemplateUrl('templates/coach-modal/price.html', {
    id: 2,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modalPrice = modal;
  });

  $ionicModal.fromTemplateUrl('templates/coach-modal/coaching-limit.html', {
    id: 3,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modalLimit = modal;
  });

  // Update Password
  $scope.passwordData = {};
  $scope.changePassword = function () {
    $scope.passwordData.accessToken = $scope.formData.accessToken;
    $scope.modalPassword.show();
  };
  $scope.submitPassword = function (formData) {
    $scope.showLoading('Please wait...', 15000);
    MyServices.changePassword(formData, function (data) {
      if (data.value === true) {
        $scope.passwordData = {};
        $scope.hideLoading();
        $scope.showLoading('Password Updated', 2000);
        $state.go('app.coach-profile');
        $scope.closeModal();
      } else {
        $scope.hideLoading();
        $scope.showLoading('Please Try Again', 2000);
      }
    });
  };

  $scope.closeModal = function () {
    $scope.modalPassword.hide();
    $scope.modalPrice.hide();
    $scope.modalLimit.hide();
  };

  //Update Price
  $scope.priceData = {};
  $scope.changePrice = function () {
    $scope.priceData.coachAskingPrice = $scope.formData.coachAskingPrice;
    $scope.modalPrice.show();
  };
  $scope.rangePrice = function (val) {
    var intVal = parseInt(val);
    if (intVal >= 1 && intVal <= 500) {
      $scope.priceData.coachAskingPrice = intVal;
    }
  };
  $scope.submitPrice = function (data) {
    $scope.formData.coachAskingPrice = data.coachAskingPrice;
    $scope.submitData($scope.formData);
  };

  //Update Coaching Limit
  $scope.limitData = {};
  $scope.changeLimit = function () {
    $scope.limitData.coachingLimit = $scope.formData.coachingLimit;
    $scope.modalLimit.show();
  };
  $scope.rangeLimit = function (val) {
    var intVal = parseInt(val);
    if (intVal >= 1 && intVal <= 200) {
      $scope.limitData.coachingLimit = intVal;
    }
  };
  $scope.submitLimit = function (data) {
    $scope.formData.coachingLimit = data.coachingLimit;
    console.log($scope.formData);
    $scope.submitData($scope.formData);
  };

  // Upload Profile Pic
  $scope.selectImage = function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    $cordovaCamera.getPicture(options).then(function (imageURI) {
      $scope.profileImage = imageURI;
      $scope.uploadImage($scope.profileImage);
    }, function (err) {
      // error
    });
  };

  //Upload Image
  $scope.uploadImage = function (imageURI) {
    $scope.showLoading('Uploading Image...', 10000);
    $cordovaFileTransfer.upload(adminurl + 'upload', imageURI)
      .then(function (result) {
        // Success!
        console.log(result.response);
        result.response = JSON.parse(result.response);
        $scope.formData.profilePic = result.response.data[0];
        $scope.submitData($scope.formData);
      }, function (err) {
        // Error
        $scope.hideLoading();
        $scope.showLoading('Error', 2000);
      }, function (progress) {
        // constant progress updates
      });
  };

})

.controller('CoachBlogCtrl', function ($scope, $ionicModal, MyServices, $ionicLoading, $ionicPopup) {
  $scope.currentPage = 1;
  var i = 0;
  $scope.allBlog = [];
  $scope.search = {
    keyword: ""
  };
  $scope.more = {
    Data: true
  };

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };


  //On Change Search Function
  $scope.searchChange = function (keywordChange) {
    if (keywordChange === '') {
      $scope.allBlog = [];
      $scope.showAllBlog(keywordChange);
    } else {
      $scope.showAllBlog(keywordChange);
    }
  };

  //Get All blog
  $scope.showAllBlog = function (keywordChange) {
    if (keywordChange) {
      $scope.currentPage = 1;
      $scope.allBlog = [];
    }
    MyServices.searchBlog({
      page: $scope.currentPage,
      keyword: $scope.search.keyword
    }, ++i, function (data, ini) {
      if (ini == i) {
        if (data.value) {
          _.forEach(data.data.results, function (value) {
            $scope.allBlog.push(value);
          });
          $scope.totalItems = data.data.total;
          if ($scope.totalItems > $scope.allBlog.length) {
            $scope.currentPage++;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            $scope.more.Data = false;
          }
        } else {
          $scope.showLoading('Error Loading Blogs', 2000);
        }
      }
    });
  };

  //Load More
  $scope.loadMore = function () {
    // $scope.more.Data = false;
    console.log('Load More');
    $scope.showAllBlog();
  };
})

.controller('CoachBlogDetailCtrl', function ($scope, $ionicModal, $ionicLoading, MyServices, $ionicPopup, $stateParams, $filter, $state) {
  $scope.formData = {};
  $scope.selectAthlete = {};
  $scope.blogId = $stateParams.id;

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  $scope.showLoading('Please wait...', 15000);

  //Select Athletes
  $ionicModal.fromTemplateUrl('templates/coach-modal/add-athlete.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
  $scope.addAthlete = function () {
    $scope.modal.show();
    $scope.getAthlete('');
  };
  //Search Athlete API
  var j = 0;
  $scope.getAthlete = function (search) {
    $scope.athletes = [];
    MyServices.searchAthlete({
      keyword: search
    }, ++j, function (data, ci) {
      if (ci == j) {
        _.each(data.data.results, function (key) {
            $scope.athletes.push(key.athlete);
          })
          // $scope.athletes = data.data.results;
      }
    });
  };
  //Remove Selected Athlete
  $scope.removeAthlete = function (pos) {
    $scope.formData.athlete.splice(pos, 1);
  };
  //Match Selected
  $scope.matchAthlete = function () {
    $scope.formData.newathlete = $scope.selectAthlete.array;
  };

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Submit Form
  $scope.submitData = function (formData) {
    if (formData.newathlete) {
      formData.athlete = _.map($scope.formData.newathlete, function (key) {
        return key._id;
      });
    }
    $scope.showLoading('Please wait...', 15000);
    MyServices.updateBlog(formData, function (data) {
      if (data.value === true) {
        $scope.hideLoading();
        $scope.showLoading('Blog Edited', 2000);
        $state.go('app.coach-blog');
      } else {
        $scope.hideLoading();
        $scope.showLoading('Error Editing Blog', 2000);
      }
    });
  };

  //get one edit
  if ($stateParams.id) {
    MyServices.getOneBlog({
      _id: $stateParams.id
    }, function (response) {
      if (response.data) {
        $scope.hideLoading();
        $scope.formData = response.data;
        $scope.selectAthlete.array = $scope.formData.newathlete = response.data.athlete;
      } else {
        $scope.formData = {};
      }
    });
  }

  //Delete Popup
  $scope.deletePop = function (id) {
    $scope.myPopup = $ionicPopup.show({
      template: '<p>Are you sure want to delete the blog?</p>',
      title: 'Confirmation Message',
      scope: $scope,
      buttons: [{
        text: 'No'
      }, {
        text: '<b>Yes</b>',
        type: 'button-positive',
        onTap: function (e) {
          $scope.deleteBlog(id);
        }
      }]
    });
  };
  $scope.deleteBlog = function (id) {
    $scope.showLoading("Loading...", 10000);
    if (id) {
      MyServices.deleteBlog({
        _id: id
      }, function (data) {
        if (data.value) {
          $scope.hideLoading();
          $scope.showLoading("Blog Deleted", 2000);
          $state.go('app.coach-blog');

        } else {
          $scope.hideLoading();
          $scope.showLoading("Error Deleting Blog", 2000);
        }
      });
    }
  };

})

.controller('CoachCompetitionCtrl', function ($scope, $ionicModal, MyServices, $ionicLoading, $ionicPopup) {
  $scope.currentPage = 1;
  var i = 0;
  $scope.allCompetition = [];
  $scope.search = {
    keyword: ""
  };
  $scope.more = {
    Data: true
  };

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };


  //On Change Search Function
  $scope.searchChange = function (keywordChange) {
    if (keywordChange === '') {
      $scope.allCompetition = [];
      $scope.showAllCompetition(keywordChange);
    } else {
      $scope.showAllCompetition(keywordChange);
    }
  };

  //Get All Competiton
  $scope.showAllCompetition = function (keywordChange) {
    if (keywordChange) {
      $scope.currentPage = 1;
      $scope.allCompetition = [];
    }
    MyServices.searchCompetition({
      page: $scope.currentPage,
      keyword: $scope.search.keyword
    }, ++i, function (data, ini) {
      if (ini == i) {
        if (data.value) {
          _.forEach(data.data.results, function (value) {
            $scope.allCompetition.push(value);
          });
          $scope.totalItems = data.data.total;
          if ($scope.totalItems > $scope.allCompetition.length) {
            $scope.currentPage++;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            $scope.more.Data = false;
          }
        } else {
          $scope.showLoading('Error Loading Competitions', 2000);
        }
      }
    });
  };

  //Load More
  $scope.loadMore = function () {
    // $scope.more.Data = false;
    console.log('Load More');
    $scope.showAllCompetition();
  };

  //Delete Popup
  $scope.deletePop = function (id) {
    $scope.myPopup = $ionicPopup.show({
      template: '<p>Are you sure want to delete the competition?</p>',
      title: 'Confirmation Message',
      scope: $scope,
      buttons: [{
        text: 'No'
      }, {
        text: '<b>Yes</b>',
        type: 'button-positive',
        onTap: function (e) {
          $scope.deleteCompetition(id);
        }
      }]
    });
  };
  $scope.deleteCompetition = function (id) {
    $scope.showLoading("Loading...", 10000);
    if (id) {
      MyServices.deleteCompetition({
        _id: id
      }, function (data) {
        if (data.value) {
          $scope.allCompetition = [];
          $scope.showAllCompetition();
          $scope.hideLoading();
          $scope.showLoading("Competition Deleted", 2000);
        } else {
          $scope.hideLoading();
          $scope.showLoading("Error Deleting Competition", 2000);
        }
      });
    }
  };
})

.controller('CoachCompetitionCreateCtrl', function ($scope, $ionicModal, $ionicLoading, MyServices, $ionicPopup, $stateParams, $filter, $state) {
  $scope.title = 'Create';
  $scope.selectAthlete = {};
  $scope.formData = {
    iskey: false
  };
  $scope.today = $filter('date')(new Date(), 'yyyy-MM-dd');

  //Match start date & end date
  $scope.matchDate = function () {
    $scope.formData.endDate = $scope.formData.startDate;
  };

  //Select Athletes Modal
  $ionicModal.fromTemplateUrl('templates/coach-modal/add-athlete.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
  $scope.addAthlete = function () {
    $scope.modal.show();
    $scope.getAthlete('');
  };
  //Search Athlete API
  var j = 0;
  $scope.getAthlete = function (search) {
    MyServices.searchAthlete({
      keyword: search
    }, ++j, function (data, ci) {
      if (ci == j) {
        $scope.athletes = data.data.results;
      }
    });
  };
  //Remove Selected Athlete
  $scope.removeAthlete = function (pos) {
    $scope.formData.athlete.splice(pos, 1);
  };
  //Match Selected
  $scope.matchAthlete = function () {
    $scope.formData.athlete = $scope.selectAthlete.array;
  };


  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Submit Form
  $scope.submitData = function (formData) {
    $scope.showLoading('Please wait...', 15000);
    MyServices.saveCompetition(formData, function (data) {
      if (data.value === true) {
        $scope.hideLoading();
        $scope.showLoading('Competition Created', 2000);
        $state.go('app.coach-competition');
      } else {
        $scope.hideLoading();
        $scope.showLoading(data.data.message, 2000);
      }
    });
  };
})

.controller('CoachCompetitionDetailCtrl', function ($scope, $ionicModal, $ionicLoading, MyServices, $ionicPopup, $stateParams, $filter, $state) {
  $scope.title = 'Edit';
  $scope.formData = {};
  $scope.selectAthlete = {};
  $scope.competitionId = $stateParams.id;
  $scope.today = $filter('date')(new Date(), 'yyyy-MM-dd');

  //Match start date & end date
  $scope.matchDate = function () {
    $scope.formData.endDate = $scope.formData.startDate;
  };

  //Select Athletes
  $ionicModal.fromTemplateUrl('templates/coach-modal/add-athlete.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
  $scope.addAthlete = function () {
    $scope.modal.show();
    $scope.getAthlete('');
  };
  //Search Athlete API
  var j = 0;
  $scope.getAthlete = function (search) {
    MyServices.searchAthlete({
      keyword: search
    }, ++j, function (data, ci) {
      if (ci == j) {
        $scope.athletes = data.data.results;
      }
    });
  };
  //Remove Selected Athlete
  $scope.removeAthlete = function (pos) {
    $scope.formData.athlete.splice(pos, 1);
  };
  //Match Selected
  $scope.matchAthlete = function () {
    $scope.formData.athlete = $scope.selectAthlete.array;
  };

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Submit Form
  $scope.submitData = function (formData) {
    $scope.showLoading('Please wait...', 15000);
    MyServices.updateCompetition(formData, function (data) {
      if (data.value === true) {
        $scope.hideLoading();
        $scope.showLoading('Competition Edited', 2000);
        $state.go('app.coach-competition');
      } else {
        $scope.hideLoading();
        $scope.showLoading('Error Editing Competition', 2000);
      }
    });
  };

  //get one edit
  if ($stateParams.id) {
    MyServices.getOneCompetition({
      _id: $stateParams.id
    }, function (response) {
      if (response.data) {
        $scope.formData = response.data;
        $scope.selectAthlete.array = $scope.formData.athlete = response.data.athlete;
        if ($scope.formData.startDate) {
          $scope.formData.startDate = new Date($scope.formData.startDate);
          $scope.formData.endDate = new Date($scope.formData.endDate);
        }
      } else {
        $scope.formData = {};
      }
    });
  }

  //Delete Popup
  $scope.deletePop = function (id) {
    $scope.myPopup = $ionicPopup.show({
      template: '<p>Are you sure want to delete the competition?</p>',
      title: 'Confirmation Message',
      scope: $scope,
      buttons: [{
        text: 'No'
      }, {
        text: '<b>Yes</b>',
        type: 'button-positive',
        onTap: function (e) {
          $scope.deleteCompetition(id);
        }
      }]
    });
  };
  $scope.deleteCompetition = function (id) {
    $scope.showLoading("Loading...", 10000);
    if (id) {
      MyServices.deleteCompetition({
        _id: id
      }, function (data) {
        if (data.value) {
          $scope.hideLoading();
          $scope.showLoading("Competition Deleted", 2000);
          $state.go('app.coach-competition');

        } else {
          $scope.hideLoading();
          $scope.showLoading("Error Deleting Competition", 2000);
        }
      });
    }
  };

})

.controller('CoachTestingCtrl', function ($scope, $ionicModal, MyServices, $ionicLoading, $ionicPopup) {
  $scope.currentPage = 1;
  var i = 0;
  $scope.allTest = [];
  $scope.search = {
    keyword: ""
  };
  $scope.more = {
    Data: true
  };

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //On Change Search Function
  $scope.searchChange = function (keywordChange) {
    if (keywordChange === '') {
      $scope.allTest = [];
      $scope.showAllTest(keywordChange);
    } else {
      $scope.showAllTest(keywordChange);
    }
  };

  $scope.showAllTest = function (keywordChange) {
    if (keywordChange) {
      $scope.currentPage = 1;
      $scope.allTest = [];
    }
    MyServices.searchTest({
      page: $scope.currentPage,
      keyword: $scope.search.keyword
    }, ++i, function (data, ini) {
      if (ini == i) {
        if (data.value) {
          _.forEach(data.data.results, function (value) {
            $scope.allTest.push(value);
          });
          $scope.totalItems = data.data.total;
          if ($scope.totalItems > $scope.allTest.length) {
            $scope.currentPage++;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            $scope.more.Data = false;
          }
        } else {
          $scope.showLoading('Error Loading Test', 2000);
        }
      }
    });
  };

  //Load More
  $scope.loadMore = function () {
    // $scope.more.Data = false;
    console.log('Load More');
    $scope.showAllTest();
  };

  //Delete Popup
  $scope.deletePop = function (id) {
    $scope.myPopup = $ionicPopup.show({
      template: '<p>Are you sure want to delete the test?</p>',
      title: 'Confirmation Message',
      scope: $scope,
      buttons: [{
        text: 'No'
      }, {
        text: '<b>Yes</b>',
        type: 'button-positive',
        onTap: function (e) {
          $scope.deleteTest(id);
        }
      }]
    });
  };
  $scope.deleteTest = function (id) {
    $scope.showLoading("Loading...", 10000);
    if (id) {
      MyServices.deleteTest({
        _id: id
      }, function (data) {
        if (data.value) {
          $scope.allTest = [];
          $scope.showAllTest();
          $scope.hideLoading();
          $scope.showLoading("Test Deleted", 2000);
        } else {
          $scope.hideLoading();
          $scope.showLoading("Error Deleting Test", 2000);
        }
      });
    }
  };
})

.controller('CoachTestingCreateCtrl', function ($scope, $ionicModal, $ionicLoading, MyServices, $ionicPopup, $stateParams, $filter, $state) {
  $scope.title = 'Create';
  $scope.selectAthlete = {};
  $scope.formData = {
    iskey: false
  };
  $scope.today = $filter('date')(new Date(), 'yyyy-MM-dd');

  //Match start date & end date
  $scope.matchDate = function () {
    $scope.formData.endDate = $scope.formData.startDate;
  };

  //Select Athletes Modal
  $ionicModal.fromTemplateUrl('templates/coach-modal/add-athlete.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
  $scope.addAthlete = function () {
    $scope.modal.show();
    $scope.getAthlete('');
  };
  //Search Athlete API
  var j = 0;
  $scope.getAthlete = function (search) {
    $scope.athletes = [];
    MyServices.searchAthlete({
      keyword: search
    }, ++j, function (data, ci) {
      if (ci == j) {
        _.each(data.data.results, function (key) {
            $scope.athletes.push(key.athlete);
          })
          // $scope.athletes = data.data.results;
      }
    });
  };
  //Remove Selected Athlete
  $scope.removeAthlete = function (pos) {
    $scope.formData.newathlete.splice(pos, 1);
  };
  //Match Selected
  $scope.matchAthlete = function () {
    $scope.formData.newathlete = $scope.selectAthlete.array;
  };


  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Submit Form
  $scope.submitData = function (formData) {
    if (formData.newathlete) {
      formData.athlete = _.map($scope.formData.newathlete, function (key) {
        return key._id;
      });
    }
    $scope.showLoading('Please wait...', 15000);
    MyServices.saveTest(formData, function (data) {
      if (data.value === true) {
        $scope.hideLoading();
        $scope.showLoading('Test Created', 2000);
        $state.go('app.coach-testing');
      } else {
        $scope.hideLoading();
        $scope.showLoading(data.data.message, 2000);
      }
    });
  };
})

.controller('CoachTestingDetailCtrl', function ($scope, $ionicModal, $ionicLoading, MyServices, $ionicPopup, $stateParams, $filter, $state) {
  $scope.title = 'Edit';
  $scope.formData = {};
  $scope.selectAthlete = {};
  $scope.testId = $stateParams.id;
  $scope.today = $filter('date')(new Date(), 'yyyy-MM-dd');

  //Match start date & end date
  $scope.matchDate = function () {
    $scope.formData.endDate = $scope.formData.startDate;
  };

  //Select Athletes
  $ionicModal.fromTemplateUrl('templates/coach-modal/add-athlete.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
  $scope.addAthlete = function () {
    $scope.modal.show();
    $scope.getAthlete('');
  };
  //Search Athlete API
  var j = 0;
  $scope.getAthlete = function (search) {
    $scope.athletes = [];
    MyServices.searchAthlete({
      keyword: search
    }, ++j, function (data, ci) {
      if (ci == j) {
        _.each(data.data.results, function (key) {
            $scope.athletes.push(key.athlete);
          })
          // $scope.athletes = data.data.results;
      }
    });
  };
  //Remove Selected Athlete
  $scope.removeAthlete = function (pos) {
    $scope.formData.newathlete.splice(pos, 1);
  };
  //Match Selected
  $scope.matchAthlete = function () {
    $scope.formData.newathlete = $scope.selectAthlete.array;
  };

  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Submit Form
  $scope.submitData = function (formData) {
    if (formData.newathlete) {
      formData.athlete = _.map($scope.formData.newathlete, function (key) {
        return key._id;
      });
    }
    $scope.showLoading('Please wait...', 15000);
    MyServices.updateTest(formData, function (data) {
      if (data.value === true) {
        $scope.hideLoading();
        $scope.showLoading('Test Edited', 2000);
        $state.go('app.coach-testing');
      } else {
        $scope.hideLoading();
        $scope.showLoading('Error Editing Test', 2000);
      }
    });
  };

  //get one edit
  if ($stateParams.id) {
    MyServices.getOneTest({
      _id: $stateParams.id
    }, function (response) {
      if (response.data) {
        $scope.formData = response.data;
        $scope.selectAthlete.array = $scope.formData.newathlete = response.data.athlete;
        if ($scope.formData.startDate) {
          $scope.formData.startDate = new Date($scope.formData.startDate);
          $scope.formData.endDate = new Date($scope.formData.endDate);
        }
      } else {
        $scope.formData = {};
      }
    });
  }

  //Delete Popup
  $scope.deletePop = function (id) {
    $scope.myPopup = $ionicPopup.show({
      template: '<p>Are you sure want to delete the test?</p>',
      title: 'Confirmation Message',
      scope: $scope,
      buttons: [{
        text: 'No'
      }, {
        text: '<b>Yes</b>',
        type: 'button-positive',
        onTap: function (e) {
          $scope.deleteTest(id);
        }
      }]
    });
  };
  $scope.deleteTest = function (id) {
    $scope.showLoading("Loading...", 10000);
    if (id) {
      MyServices.deleteTest({
        _id: id
      }, function (data) {
        if (data.value) {
          $scope.hideLoading();
          $scope.showLoading("Test Deleted", 2000);
          $state.go('app.coach-testing');

        } else {
          $scope.hideLoading();
          $scope.showLoading("Error Test Test", 2000);
        }
      });
    }
  };
})

.controller('CoachAnalyticsCtrl', function ($scope, $ionicModal) {
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
})




.controller('CoachTrainingDiaryCtrl', function ($scope, $ionicModal, $ionicLoading, uiCalendarConfig, MyServices) {
  //Loading
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  //Select Athlete
  $ionicModal.fromTemplateUrl('templates/coach-modal/select-athlete.html', {
    id: 1,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal1 = modal;
  });
  $scope.openSelect = function () {
    $scope.modal1.show();
    $scope.getAthlete('');
  };

  //Feedback Modal
  $ionicModal.fromTemplateUrl('templates/coach-modal/feedback.html', {
    id: 2,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal2 = modal;
  });
  $scope.openModal = function () {
    $scope.modal2.show();
  };

  $scope.closeModal = function () {
    $scope.modal1.hide();
    $scope.modal2.hide();
  };

  //Selector data
  $scope.formData = {};
  $scope.matchName = function (data) {
    $scope.formData.athlete = data;
  };
  $scope.athleteData = [];

  $scope.commentData = {};
  var j = 0;
  $scope.getAthlete = function (search) {
    MyServices.searchAthlete({
      keyword: search
    }, ++j, function (data, ci) {
      if (ci == j) {
        $scope.athletes = data.data.results;
      }
    });
  };
  $scope.changeAthlete = function () {
    $scope.athleteData = [];
    MyServices.getAthletePlans({
      _id: $scope.formData.athlete._id
    }, function (data) {
      if (_.isArray(data.data)) {
        $scope.athleteData = data.data;
        parsePlanToCalender(data.data);
      } else {
        $scope.athleteData = [];
      }
    });
  };

  $scope.athletes = [];

  function parsePlanToCalender(Plans) {
    $scope.trainingDiary = [];
    _.each(Plans, function (plan) {
      var startDays = 0;
      _.each(plan.trainingForms, function (form) {
        form.trainingPlan = plan._id;
        var obj = {
          color: form.form.colorCode,
          events: [{
            title: "• " + form.form.name + " - " + plan.name,
            start: moment(plan.startDate).add(startDays, "days").toDate(),
            end: moment(plan.startDate).add(startDays, "days").add(form.duration, 'days').toDate(),
            allDay: true,
            planForm: form,
            colorCode: form.form.colorCode
          }],
        };
        startDays += form.duration;
        if (!_.isEmpty(form.comment)) {
          var obj2 = _.cloneDeep(obj);
          obj2.color = "#444";
          obj2.events[0].title = "Comment: " + form.comment;
          $scope.trainingDiary.push(obj2);
        }
        $scope.trainingDiary.push(obj);
      });
    });
    changePendingForm();
  }

  /* Change View */
  $scope.renderCalendar = function (calendar) {
    $timeout(function () {
      if (uiCalendarConfig.calendars[calendar]) {
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    });
  };

  var m;
  /* alert on eventClick */
  $scope.diaryClick = function (obj) {
    $scope.dayInfo = obj;
    console.log(obj);
    $scope.formInfo = obj.planForm;
    m = moment(obj.end);
    if (obj.planForm.answer && obj.planForm.answer.length > 0) {
      $scope.feedback = obj.planForm.answer;
      $scope.showComment = false;
      $scope.makeDisable = true;
      if (moment().isSameOrAfter(m)) {
        $scope.openModal();
        console.log('Feedback');
      }
    } else {
      $scope.feedback = obj.planForm.answer;
      $scope.showComment = true;
      $scope.commentData.comment = obj.planForm.comment;
      if (moment().isBefore(m)) {
        $scope.openModal();
        console.log('Comment');
      }
    }
    if (obj.planForm.answer.length === 0) {
      if (moment().isSameOrAfter(m)) {
        $scope.showLoading('No Feedback Recived', 2000);
      }
    }
  };

  $scope.dayClick = function (date, jsEvent, view) {
    $scope.clickedDay = date;
  };

  /* Change View */
  $scope.activeView = 'month';
  $scope.changeView = function (view) {
    uiCalendarConfig.calendars.coachDiary.fullCalendar('changeView', view);
    $scope.activeView = view;
  };

  //Navigate Buttons
  $scope.navigate = function (val) {
    uiCalendarConfig.calendars.coachDiary.fullCalendar(val);
  };

  $scope.uiConfig = {
    calendar: {
      firstDay: 1,
      height: 450,
      editable: false,
      eventClick: $scope.diaryClick,
      viewRender: function (view) {
        $scope.viewTitle = view.title;
      }
    }
  };

  /* event sources array*/
  $scope.trainingDiary = [];
  var changePendingForm = function () {
    console.log($scope.trainingDiary);
    $scope.pendingForm = [];
    _.each($scope.trainingDiary, function (events) {
      _.each(events.events, function (obj) {
        if (obj.planForm.answer && obj.planForm.answer.length > 0) {
          $scope.pendingForm.push(obj);
        }
      });

    });
    console.log($scope.pendingForm);
  };

  $scope.submitComment = function () {
    var obj = {};
    obj.trainingPlan = $scope.formInfo.trainingPlan;
    obj.trainingForm = $scope.formInfo._id;
    obj.trainingFormStart = "";
    obj.trainingFormEnd = "";
    obj.comment = $scope.commentData.comment;
    console.log(obj);
    MyServices.saveComment(obj, function (data) {
      $scope.showLoading('Comment Submitted', 2000);
      $scope.changeAthlete();
    });
  };


})

.controller('CoachAthletesCoachingCtrl', function ($scope, $ionicModal, MyServices, $stateParams) {
  $scope.profileData = MyServices.getUser();
  var coachId = $scope.profileData._id;
  var i = 0;
  $scope.search = {
    keyword: ""
  };
  if ($stateParams.keyword) {
    $scope.search.keyword = $stateParams.keyword;
  }
  $scope.changePage = function (page) {
    var goTo = "app.coach-athletes-coaching";
    if ($scope.search.keyword) {
      goTo = "app.coach-athletes-coaching";
    }
    $state.go(goTo, {
      page: page,
      keyword: $scope.search.keyword
    });
  };

  $scope.showAllNotification = function (coachId) {
    MyServices.getAllRequest({
      Id: coachId
    }, function (response) {
      if (response.value == true) {
        $scope.athletes = response.data;
        $scope.requestCount = $scope.athletes.length;
      }
    })
  }
  $scope.showAllNotification(coachId);

  $scope.getMyAthletes = function (keywordChange) {
    $scope.totalItems = undefined;
    $scope.athletecoaching = undefined;
    if (keywordChange) {
      $scope.currentPage = 1;
    }
    MyServices.getMyAthletes({
      page: $scope.currentPage,
      keyword: $scope.search.keyword
    }, ++i, function (response, ini) {
      if (ini == i) {
        if (response.value) {
          $scope.athletecoaching = response.data.results;
          $scope.totalItems = response.data.total;
          $scope.maxRow = response.data.options.count;
        } else {
          $scope.athletecoaching = [];
        }
      }
    });
  };
  $scope.getMyAthletes();
})

.controller('CoachAthletesRequestCtrl', function ($scope, $ionicModal, MyServices, $ionicPopup) {
  $scope.profileData = MyServices.getUser();

  $scope.reason = function (notificationId) {
    $scope.Id = notificationId;
    $scope.data = {};
    var myPopup = $ionicPopup.show({
      template: '<textarea auto-grow type="password" ng-model="data.reasonForRejection"><textarea>',
      title: '<h4>Reject Unsubscription!</h4>',
      subTitle: 'Please enter some reason',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
      }, {
        text: '<b>Reject</b>',
        type: 'button-assertive',
        onTap: function (e) {
          $scope.rejectRequest($scope.data.message);
        }
      }, ]
    });
  };

  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };
  var coachId = $scope.profileData._id;
  $scope.showAllNotification = function (coachId) {
    MyServices.getAllRequest({
      Id: coachId
    }, function (response) {
      if (response.value == true) {
        $scope.athletes = response.data;
        $scope.requestCount = $scope.athletes.length;
      }
    })
  }
  $scope.showAllNotification(coachId);

  $scope.rejectRequest = function (requestRejectData) {
    var athleteCoaching = {};
    athleteCoaching._id = $scope.Id;
    athleteCoaching.status = "Rejected";
    athleteCoaching.readRequestStatus = true;
    athleteCoaching.reason = requestRejectData
    $scope.acceptRejectRequest(athleteCoaching, 'reject');
  }

  $scope.acceptRequest = function (Id) {
    var athleteCoaching = {};
    athleteCoaching._id = Id;
    athleteCoaching.status = "Payment Pending";
    athleteCoaching.readRequestStatus = true;
    // athleteCoaching.acceptedDate = moment().format();
    $scope.acceptRejectRequest(athleteCoaching, 'accept');
  }

  $scope.acceptRejectRequest = function (athleteCoaching, data) {
    MyServices.updateAthleteCoaching(athleteCoaching, function (response) {
      if (response.value == true) {
        if (data == 'accept') {
          // toastr.success('Request accepted', 'Thank you');
        } else {
          // $scope.modalInstance.close();
          // toastr.success('Request Rejected', 'Thank you');
        }
        $scope.showAllNotification(coachId);
      }
    })
  }


})

.controller('CoachAthletesCoachingDetailCtrl', function ($scope, $ionicModal, $stateParams, MyServices, $ionicPopup) {
  $scope.unsubscribe = {};
  if ($stateParams.athleteId) {
    $scope.athleteCoaching = undefined;
    MyServices.getOneAthleteCoached({
      athleteId: $stateParams.athleteId
    }, function (response) {
      if (response.value) {
        $scope.athleteCoaching = response.data;
      } else {
        $scope.athleteCoaching = [];
      }
    })
  }
  $scope.reason = function (athleteCoachId, coachID) {
    $scope.unsubscribe._id = athleteCoachId;
    $scope.unsubscribe.coachID = coachID;
    $scope.data = {};
    var myPopup = $ionicPopup.show({
      template: '<textarea auto-grow type="password" ng-model="data.reasonForRejection"><textarea>',
      title: '<h4>Unsubscription!</h4>',
      subTitle: 'Please enter some reason',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
      }, {
        text: '<b>Reject</b>',
        type: 'button-assertive',
        onTap: function (e) {
          $scope.unsubscribe.reason = $scope.data.reasonForRejection;
          $scope.rejectRequest();
        }
      }, ]
    });
  };

  $scope.rejectRequest = function () {
    $scope.unsubscribe.status = "Unsubscribe";
    MyServices.Unsubscribeathlete($scope.unsubscribe, function (response) {
      // if (response.value === true) {
      // } else {
      // }
    })
  }

})

.controller('CoachAthleteDetailCtrl', function ($scope, $ionicModal, $stateParams, MyServices) {
  if ($stateParams.athleteId) {
    $scope.athleteProfile = undefined;
    MyServices.getOneAthleteProfile({
      _id: $stateParams.athleteId
    }, function (response) {
      if (response.value) {
        $scope.athleteProfile = response.data;
      } else {
        $scope.athleteProfile = [];
      }
    })
  };
})

.controller('CoachNotificationsCtrl', function ($scope, $ionicModal, MyServices, $ionicScrollDelegate, $ionicPopup) {
  $scope.profileData = MyServices.getUser();
  // $scope.notifications = [{
  //   name: 'Matt',
  //   surname: 'Chant',
  //   type: 'athleteUnsubscribe'
  // }, {
  //   name: 'Matt',
  //   surname: 'Chant',
  //   type: 'competition'
  // }];



  // console.log($scope.profileData);
  var i = 0;
  var coach = $scope.profileData._id;

  $scope.showCoachNotification = function (coach) {
    $scope.totalItems = undefined;
    $scope.coachnotifications = undefined;
    $scope.currentPage = 1;
    MyServices.getCoachNotification({
      Id: coach,
      page: $scope.currentPage
    }, ++i, function (response, ini) {
      if (ini == i) {
        if (response.value == true) {
          $scope.isAthlete = false;
          $scope.coachnotifications = response.data.results;
          $scope.notificationCount = response.data.unreadcount;
          $scope.maxRow = response.data.count;
          $scope.totalItems = response.data.total;

        } else {
          $scope.coachnotifications = [];
        }
      }

    })
  };

  // $scope.showCoachNotification(coach);

  $scope.readNotification = function () {
    $scope.totalItems = undefined;
    $scope.athletenotifications = undefined;
    $scope.coachnotifications = undefined;
    $scope.currentPage = 1;
    MyServices.readcoachNotification({
      Id: coach,
      page: $scope.currentPage
    }, ++i, function (response, ini) {
      if (ini == i) {
        if (response.value == true) {
          $scope.isAthlete = false;
          $scope.coachnotifications = response.data.results;
          $scope.notificationCount = response.data.unreadcount;
          $scope.maxRow = response.data.options.count;
          $scope.totalItems = response.data.total;
          $scope.showCoachNotification(coach);
        } else {
          $scope.coachnotifications = [];
        }
      }

    })
  }

  $scope.readNotification();

})


.controller('CoachChatCtrl', function ($scope, $ionicModal, $state) {
  $ionicModal.fromTemplateUrl('templates/coach-modal/chat.html', {
    id: 1,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modalChat = modal;
  });
  $scope.newChat = function () {
    $scope.modalChat.show();
  };

  $ionicModal.fromTemplateUrl('templates/coach-modal/group-chat.html', {
    id: 2,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modalGroup = modal;
  });
  $scope.newGroupChat = function () {
    $scope.modalGroup.show();
  };

  $scope.closeModal = function () {
    $scope.modalGroup.hide();
    $scope.modalChat.hide();
  };

  $scope.startChat = function () {
    $state.go('app.coach-chatdetail');
    $scope.modalChat.hide();
  };
})

.controller('CoachChatDetailCtrl', function ($scope, $ionicScrollDelegate, $timeout) {

  $ionicScrollDelegate.scrollBottom(true);
  $scope.hideTime = true;

  $scope.timeStamp = function () {
    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
    return d;
  };

  $scope.sendMessage = function () {

    if ($scope.data.message !== '' && $scope.data.message) {
      $scope.messages.push({
        userId: 'me',
        text: $scope.data.message,
        time: $scope.timeStamp()
      });

      delete $scope.data.message;
      $ionicScrollDelegate.scrollBottom(true);
    }

  };

  $scope.chatTap = function (m) {
    m.showTime = true;
    $timeout(function () {
      m.showTime = false;
    }, 4000);
  };
  $scope.openKb = function () {
    cordova.plugins.Keyboard.open();
  };

  $scope.data = {};
  $scope.messages = [{
    userId: 'me',
    text: 'Hi Matt, how did you find the session?',
    time: $scope.timeStamp()
  }, {
    userId: 'he',
    text: 'Good, I managed to hit my target times, legs are feeling quite tired now.',
    time: $scope.timeStamp()
  }, {
    userId: 'me',
    text: 'Good, I suggest you rehab today ready for tomorrow’s session.',
    time: $scope.timeStamp()
  }, {
    userId: 'me',
    text: 'Stretch, foam roll etc, please refer to rehab programme attached with your Training Plan',
    time: $scope.timeStamp()
  }, {
    userId: 'he',
    text: 'Will do, thanks.',
    time: $scope.timeStamp()
  }, {
    userId: 'he',
    text: 'James, a question regarding the session on the 27th November, you have set three sets however still struggling with the legs from last week, shall I drop a set or take the reps slower and get it finished?',
    time: $scope.timeStamp()
  }, {
    userId: 'me',
    text: 'Stick with the two sets, get it done in flats. I will adapt your training plan for you.',
    time: $scope.timeStamp()
  }, {
    userId: 'he',
    text: 'Thanks James',
    time: $scope.timeStamp()
  }, {
    userId: 'he',
    text: 'Session complete, have submitted my times in session feedback  ',
    time: $scope.timeStamp()
  }];
})

.controller('CoachChatGroupCtrl', function ($scope, $ionicScrollDelegate, $timeout) {

  $scope.hideTime = true;

  $scope.timeStamp = function () {
    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
    return d;
  };

  $scope.sendMessage = function () {

    if ($scope.data.message !== '' && $scope.data.message) {
      console.log($scope.data.message);
      $scope.messages.push({
        userId: 'me',
        text: $scope.data.message,
        time: $scope.timeStamp()
      });

      delete $scope.data.message;
      $ionicScrollDelegate.scrollBottom(true);
    }

  };

  $scope.chatTap = function (m) {
    m.showTime = true;
    $timeout(function () {
      m.showTime = false;
    }, 4000);
  };
  $scope.openKb = function () {
    cordova.plugins.Keyboard.open();
  };

  $scope.data = {};
  $scope.messages = [{
    userId: 'he',
    name: 'Sachin',
    surname: 'Sachin',
    text: 'Hello! Welcome to Coach Mentor',
    time: $scope.timeStamp()
  }];

})

//End of Coach controller

;
