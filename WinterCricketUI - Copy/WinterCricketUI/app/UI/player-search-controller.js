(function () {
    myApp.controller('playerSearchCtrl', function ($scope, $http, playersSservice,
        matchSservice, filterFilter) {
        var vm = this;
        vm.playerId = 1;
        vm.lastName = "tewatia";
        vm.firstName = "ashok";
        vm.activeItem = 'Fixtures'

        vm.filterObject = { "firstName": vm.firstName, "lastName": vm.lastName, "playerId": vm.playerId };
        vm.getPlayerByMemberId = function () {
            playersSservice.getPlayers(vm.filterObject).then(function (resp) {
                vm.playersList = resp;
            });
        };
        /* code for matches and results. */
        vm.getMatchesBySeriesId = function (seriesId) {
            matchSservice.getMatchesBySeriesId(seriesId).then(function (resp) {
                vm.allMatches = resp;
                vm.upComingmatchesList = filterFilter(vm.allMatches, { matchStateId: 1 }, true); // hardcoded for now.
            });
        };

        vm.getMatchByType = function (matchTypeId) {
            vm.upComingmatchesList = filterFilter(vm.allMatches, { 'matchStateId': 1, matchTypeDetails: { matchTypeId: parseInt(matchTypeId) } }, true); // hardcoded for now.
        }

        vm.getResultsBySeriesId = function (seriesId, matchStateId) {
            matchSservice.getCompletedMatchesBySeriesId(seriesId, matchStateId).then(function (resp) {
                vm.completedMatchesList = resp;
            });
        };
        vm.getMatchesBySeriesId(0); // all series
        vm.getMatchByType(1); // t20
        vm.getResultsBySeriesId(0, 2);
    });
})();
