var adminurl = "http://coachmentor.wohlig.com/api/";
// var adminurl = "http://192.168.0.101:1337/api/";
// var adminurl = "http://wohlig.io/api/";
var imgurl = adminurl + "upload/";

var imgpath = imgurl + "readFile";
var uploadurl = imgurl;
var user = {};
angular.module('starter.services', [])
  .factory('MyServices', function ($http, $filter) {
    //Start Athlete Service
    var userProfile = $.jStorage.get("userProfile");
    if (!userProfile) {
      userProfile = {};
    } else {
      requestCredentials = {
        accessToken: $.jStorage.get("userProfile").accessToken[0],
      };
    }

    var returnval = {};

    return {
      getCountries: function (callback) {
        $http({
          url: "json/countries.json",
          method: 'GET',
        }).success(callback);
      },

      setAthleteUser: function (data) {
        _.assignIn(userProfile, data);
        $.jStorage.set("userProfile", userProfile);
        requestCredentials = {
          accessToken: $.jStorage.get("userProfile").accessToken[0],
        };
      },

      setAccessType: function (data) {
        $.jStorage.set("accessType", data);
      },

      getAccessType: function () {
        return $.jStorage.get("accessType");
      },

      getUser: function () {
        return userProfile;
      },

      register: function (formData, callback) {
        $http({
          url: adminurl + 'Athlete/registerAthlete',
          method: 'POST',
          data: formData
        }).success(callback);
      },

      getStatic: function (formData, callback) {
        $http({
          url: adminurl + 'ConfigTwo/getOne',
          method: 'POST',
          data: formData
        }).success(callback);
      },

      athletelogin: function (formData, callback) {
        $http({
          url: adminurl + 'Athlete/athleteLogin',
          method: 'POST',
          data: formData
        }).success(callback);
      },

      editProfile: function (formData, callback) {
        $http({
          url: adminurl + 'Athlete/updateAthleteProfile',
          method: 'POST',
          data: formData
        }).success(callback);
      },

      getProfile: function (formData, callback) {
        $http({
          url: adminurl + 'Athlete/getAthleteProfile',
          method: 'POST',
          data: formData
        }).success(callback);
      },

      changePassword: function (formData, callback) {
        $http({
          url: adminurl + 'Athlete/resetPasswordAthlete',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      getAthleteMyPlans: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        console.log(formData);
        $http({
          url: adminurl + 'Athlete/getAthleteMyPlans',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      saveAnswer: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http.post(adminurl + 'trainingPlan/saveAnswer', formData).success(function (data) {
          callback(data);
        });
      },

      saveInjury: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'AthleteInjury/save',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      updateInjury: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'AthleteInjury/updateAthleteInjury',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      deleteInjury: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'AthleteInjury/delete',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      getOneInjury: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'AthleteInjury/findOne',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      searchInjury: function (formData, i, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'AthleteInjury/search',
          method: 'POST',
          data: formData
        }).success(function (data) {
          callback(data, i);
        });
      },

      getOneBlogForAthlete: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Blog/findOneAthleteBlog',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      reactToBlog: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Blog/react',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      removeReaction: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Blog/removeReaction',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      searchBlogForAthlete: function (formData, i, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Blog/searchForAthlete',
          method: 'POST',
          data: formData
        }).success(function (data) {
          callback(data, i);
        });
      },

      getKeyAthleteCompetitions: function (callback) {
        var formData = {};
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Competition/getKeyAthleteCompetitions',
          method: 'POST',
          data: formData
        }).success(callback);
      },

      searchAllCoaches: function (formData, i, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'coach/search',
          method: 'POST',
          data: formData
        }).success(function (data) {
          callback(data, i);
        });
      },
      getOneCoaches: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'coach/getOne',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      sendRequestToCoach: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'athletecoaching/save',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      getAthleteNotification: function (formData, i, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'notificationathlete/getAthleteNotification',
          method: 'POST',
          data: formData
        }).success(function (data) {
          callback(data, i);
        });
      },
      readathleteNotification: function (formData, i, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'notificationathlete/readathleteNotification',
          method: 'POST',
          data: formData
        }).success(function (data) {
          callback(data, i);
        });
      },
      getMyCoach: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'athleteCoaching/getMyCoach',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      Unsubscribeacoach: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'athletecoaching/updateAthleteCoaching',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      paySubscription: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'athletecoaching/updateAthleteCoaching',
          method: 'POST',
          data: formData
        }).success(callback);
      },


      // Start Coach Myservices


      getCountries: function (callback) {
        $http({
          url: "json/countries.json",
          method: 'GET',
        }).success(callback);
      },

      setUser: function (data) {
        _.assignIn(userProfile, data);
        $.jStorage.set("userProfile", userProfile);
        requestCredentials = {
          accessToken: $.jStorage.get("userProfile").accessToken[0],
        };
      },

      getUser: function () {
        return userProfile;
      },

      getStatic: function (formData, callback) {
        $http({
          url: adminurl + 'ConfigTwo/getOne',
          method: 'POST',
          data: formData
        }).success(callback);
      },

      registerCoach: function (formData, callback) {
        $http({
          url: adminurl + 'Coach/registerCoach',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      login: function (formData, callback) {
        $http({
          url: adminurl + 'Coach/coachLogin',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      editProfile: function (formData, callback) {
        $http({
          url: adminurl + 'Coach/updateCoachProfile',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      getProfile: function (formData, callback) {
        $http({
          url: adminurl + 'Coach/getCoachProfile',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      changePassword: function (formData, callback) {
        $http({
          url: adminurl + 'Coach/resetPasswordCoach',
          method: 'POST',
          data: formData
        }).success(callback);
      },

      searchAthlete: function (formData, i, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'athletecoaching/searchAthleteByCoach',
          method: 'POST',
          data: formData
        }).success(function (data) {
          callback(data, i);
        });
      },

      getAthletePlans: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http.post(adminurl + 'athlete/getAthletePlans', formData).success(function (data) {
          callback(data);
        });
      },

      saveComment: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http.post(adminurl + 'trainingPlan/saveComment', formData).success(function (data) {
          callback(data);
        });
      },

      saveCompetition: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Competition/save',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      updateCompetition: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Competition/updateCompetition',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      deleteCompetition: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Competition/delete',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      getOneCompetition: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Competition/findOne',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      searchCompetition: function (formData, i, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Competition/search',
          method: 'POST',
          data: formData
        }).success(function (data) {
          callback(data, i);
        });
      },

      saveTest: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Test/save',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      updateTest: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Test/updateTest',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      deleteTest: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Test/delete',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      getOneTest: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Test/findOne',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      searchTest: function (formData, i, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Test/search',
          method: 'POST',
          data: formData
        }).success(function (data) {
          callback(data, i);
        });
      },

      saveBlog: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Blog/save',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      updateBlog: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Blog/updateBlog',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      deleteBlog: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Blog/delete',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      getOneBlog: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Blog/findOne',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      searchBlog: function (formData, i, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'Blog/search',
          method: 'POST',
          data: formData
        }).success(function (data) {
          callback(data, i);
        });
      },
      getCoachNotification: function (formData, i, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'notificationcoach/getCoachNotification',
          method: 'POST',
          data: formData
        }).success(function (data) {
          callback(data, i);
        });
      },
      readcoachNotification: function (formData, i, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'notificationcoach/readcoachNotification',
          method: 'POST',
          data: formData
        }).success(function (data) {
          callback(data, i);
        });
      },
      getAllRequest: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'athletecoaching/getRequest',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      getOneAthleteProfile: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'athlete/getOne',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      updateAthleteCoaching: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'athletecoaching/updateAthleteCoaching',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      getMyAthletes: function (formData, i, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'athletecoaching/getMyAthletes',
          method: 'POST',
          data: formData
        }).success(function (data) {
          callback(data, i);
        });
      },
      getOneAthleteCoached: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'athletecoaching/getOneAthleteCoached',
          method: 'POST',
          data: formData
        }).success(callback);
      },
      Unsubscribeathlete: function (formData, callback) {
        formData = _.merge(formData, requestCredentials);
        $http({
          url: adminurl + 'athletecoaching/updateAthleteCoaching',
          method: 'POST',
          data: formData
        }).success(callback);
      },
    };
  });
