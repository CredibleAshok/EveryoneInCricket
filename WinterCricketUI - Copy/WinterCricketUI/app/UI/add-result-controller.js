//addResultCtrl
(function () {
    myApp.controller('addResultCtrl', function ($scope, $http, $stateParams, matchSservice) {
        var vm = this;
        vm.matchId = $stateParams.matchId;
        vm.newResult = {};

        vm.saveResult = function () {
            resultSservice.saveNewVenue(vm.newResult).then(function (resp) {
                console.log("new Venue saving passed.");
            }, function () {
                console.log("new Venue saving failed.");
            });
        };

        var getTeamsByMatchId = function () {
            vm.teamlist = [];
            matchSservice.getTeamsByMatchId(vm.matchId).then(function (resp) {
                vm.teamlist.push(resp[0].awayTeamDetails);
                vm.teamlist.push(resp[0].homeTeamDetails);
            });
            //console.log("addResultCtrl controller loaded.");
        };
        getTeamsByMatchId();
    });
})();
