//addResultCtrl
(function () {
    myApp.controller('addResultCtrl', function ($scope, $http, $stateParams, matchSservice, filterFilter) {
        var vm = this;
        vm.matchId = $stateParams.matchId;
        vm.newResult = {};
        vm.winningModeList = [{ "id": 1, "name": "Wickets" }, { "id": 2, "name": "Runs" }];
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
