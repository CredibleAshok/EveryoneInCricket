(function () {
    myApp.controller('venuesCtrl', function ($scope, $http, venuesSservice) {
        var vm = this;
        vm.getVenuesList = function () {
            venuesSservice.getVenuesList().then(function (resp) {
                vm.venuesList = resp;
            });
        };
        vm.getVenuesList();
    });
})();