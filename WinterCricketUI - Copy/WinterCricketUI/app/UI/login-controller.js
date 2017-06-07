(function () {
    myApp.controller('loginCtrl', function ($scope, $http, config, $stateParams, securitySservice) {
        var vm = this;
        console.log("login controller loaded.");
        vm.getUserDetails = function (userName, password) {
            securitySservice.getloggedInUser(userName, password).then(function (resp) {
                var currentUser1 = securitySservice.getcurrentUser();
                console.log("securitySservice.currentUser:- " + securitySservice.getcurrentUser().Name);
            });
        };
    });
})();
