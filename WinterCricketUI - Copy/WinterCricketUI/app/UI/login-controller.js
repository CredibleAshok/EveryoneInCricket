(function () {
    myApp.controller('loginCtrl', function ($scope, $http, config, $stateParams, securitySservice, $rootScope, $state) {
        var vm = this;
        vm.userName = "ashok";
        vm.password = "ashok";
        console.log("login controller loaded.");
        vm.getUserDetails = function (userName, password) {
            securitySservice.getloggedInUser(userName, password).then(function (resp) {
                $rootScope.currentUser = securitySservice.getcurrentUser();
                //console.log("securitySservice.currentUser:- " + $rootScope.currentUser.Name);
                $state.go($rootScope.previousState);
            });
        };
    });
})();
