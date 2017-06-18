//addMatchStatsCtrl
(function () {
    myApp.controller('addMatchStatsCtrl', function ($scope, $http, $stateParams, matchSservice) {
        var vm = this;
        vm.newMatchStats = {};
        vm.newMatchStats.matchId = $stateParams.matchId;
        vm.newResult = {};
        vm.plc = "My Search...";

        //#region initial data
        vm.newMatchStats.matchId = 1;
        vm.newMatchStats.homeTeam = {
            "teamId": 1,
            "name": "Bayswater",
            "validFrom": "10-Jan-2010",
            "validTo": "10-Jan-2020",
            "teamFlagId": 1,
            "captain": "Captain 1"
        };
        vm.newMatchStats.homeTeam.runsScored = {"name": 1};
        vm.newMatchStats.homeTeam.extraGiven = { "name": 2 };
        vm.newMatchStats.homeTeam.oversReceived = { "name": 3 };
        vm.newMatchStats.homeTeam.wicketsLost = { "name": 4 };
        vm.newMatchStats.awayTeam = {
            "teamId": 2,
            "name": "Bentley",
            "validFrom": "10-Jan-2010",
            "validTo": "10-March-2020",
            "teamFlagId": 2,
            "captain": "Captain 2"
        };
        vm.newMatchStats.awayTeam.runsScored = { "name": 5 };
        vm.newMatchStats.awayTeam.extraGiven = { "name": 6 };
        vm.newMatchStats.awayTeam.oversReceived = { "name": 7 };
        vm.newMatchStats.awayTeam.wicketsLost = { "name": 8 };
        //#endregion initial data
        
        var getTeamsByMatchId = function () {
            vm.teamlist = [];
            matchSservice.getTeamsByMatchId(vm.newMatchStats.matchId).then(function (resp) {
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
