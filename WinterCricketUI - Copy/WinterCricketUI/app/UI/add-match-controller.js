//addMatchCtrl
(function () {
    myApp.controller('addMatchCtrl', function ($scope, $http, $stateParams, matchSservice) {
        var vm = this;

        vm.saveMatch = function () {
            matchSservice.saveNewMatch(vm.newMatch).then(function (resp) {
                console.log("new match saving passed.");
            }, function () {
                console.log("new match saving failed.");
            });
        };

        var getProfile = function () {
            console.log("addMatchCtrl controller loaded." );
        };
        getProfile();
    });
})();
