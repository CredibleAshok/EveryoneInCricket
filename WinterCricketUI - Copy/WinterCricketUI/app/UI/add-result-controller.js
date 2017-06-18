//addResultCtrl
(function () {
    myApp.controller('addResultCtrl', function ($scope, $http, $stateParams, matchSservice, filterFilter, resultSservice) {
        var vm = this;
        vm.matchId = $stateParams.matchId;
        vm.newResult = {};

        //#region initial data
        vm.matchId = 1;
        vm.newResult.wonBy = {
            "teamId": 1,
            "name": "Bayswater",
            "validFrom": "10-Jan-2010",
            "validTo": "10-Jan-2020",
            "teamFlagId": 1,
            "captain": "Captain 1"
        };
        vm.newResult.lostBy = {
            "teamId": 2,
            "name": "Bentley",
            "validFrom": "10-Jan-2010",
            "validTo": "10-March-2020",
            "teamFlagId": 2,
            "captain": "Captain 2"
        };
        vm.newResult.decidedToBat = {
            "teamId": 2,
            "name": "Bentley",
            "validFrom": "10-Jan-2010",
            "validTo": "10-March-2020",
            "teamFlagId": 2,
            "captain": "Captain 2"
        };
        vm.newResult.winningMode = {
            "winningModeId": 1,
            "name": "Runs",
        };
        vm.newResult.byRuns = 12;
        vm.newResult.byWickets = 2;

        //#endregion initial data

        vm.winningModeList = [{ "id": 1, "name": "Wickets" }, { "id": 2, "name": "Runs" }];
        vm.saveResult = function () {
            resultSservice.saveResult(vm.newResult).then(function (resp) {
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
        };

        $scope.$watch('vm.newResult.wonBy', function (newVal, oldVal) {
            if (newVal != undefined) {
                angular.forEach(vm.teamlist, function (val, key) {
                    if (val.teamId != newVal.teamId) {
                        vm.newResult.lostBy = val;
                    }
                });
            }
        });

        getTeamsByMatchId();
    });
})();
