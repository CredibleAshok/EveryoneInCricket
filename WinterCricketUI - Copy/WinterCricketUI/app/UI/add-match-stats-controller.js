//addMatchStatsCtrl
(function () {
    myApp.controller('addMatchStatsCtrl', function ($scope, $http, $stateParams, matchSservice) {
        var vm = this;
        vm.addMatchStats = {};
        vm.addMatchStats.matchId = $stateParams.matchId;
        vm.newResult = {};
        vm.plc = "My Search...";
        var getTeamsByMatchId = function () {
            vm.teamlist = [];
            matchSservice.getTeamsByMatchId(vm.addMatchStats.matchId).then(function (resp) {
                vm.teamlist.push(resp[0].awayTeamDetails);
                vm.teamlist.push(resp[0].homeTeamDetails);
            });
            console.log("addResultCtrl controller loaded.");
        };

        $scope.$watch('vm.newMatchStats.homeTeam', function (newVal, oldVal) {
            if (newVal != undefined) {
                angular.forEach(vm.teamlist, function (val, key) {
                    if (val.teamId != newVal.teamId) {
                        vm.newMatchStats.awayTeam = val;
                    }
                });
            }
        });
        getTeamsByMatchId();
    });
})();
