//addMemberCtrl
(function () {
    myApp.controller('addMemberCtrl', function ($scope, $http, $stateParams, venuesSservice) {
        var vm = this;
        vm.teamId = $stateParams.teamId;
        vm.newVenue = {};

        vm.saveVenue = function () {
            venuesSservice.saveNewVenue(vm.newVenue).then(function (resp) {
                console.log("new Venue saving passed.");
            }, function () {
                console.log("new Venue saving failed.");
            });
        };

        var getProfile = function () {
            console.log("addVenuCtrl controller loaded.");
        };
        getProfile();
    });
})();
