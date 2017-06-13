//addMatchStatsCtrl
(function () {
    myApp.controller('addMatchStatsCtrl', function ($scope, $http, $stateParams, matchSservice) {
        var vm = this;
        vm.addMatchStats = {};
        vm.addMatchStats.matchId = $stateParams.matchId;
        vm.newResult = {};

        var getTeamsByMatchId = function () {
            vm.teamlist = [];
            matchSservice.getTeamsByMatchId(vm.matchId).then(function (resp) {
                vm.teamlist.push(resp[0].awayTeamDetails);
                vm.teamlist.push(resp[0].homeTeamDetails);
            });
            console.log("addResultCtrl controller loaded.");
        };
        getTeamsByMatchId();
    });
})();
