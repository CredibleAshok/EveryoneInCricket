(function () {
    myApp.controller('teamsCtrl', function ($scope, $http, teamsSservice) {
        var vm = this;
        vm.getTeamsList = function () {
            teamsSservice.getTeamsList().then(function (resp) {
                vm.teamList = resp;
            });
        };
        vm.getTeamsList();
    });
})();

