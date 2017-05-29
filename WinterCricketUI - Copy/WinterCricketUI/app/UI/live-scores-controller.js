(function () {
    myApp.controller('liveScoresCtrl', function ($scope, $http, config, $stateParams, scoreCardSservice, matchStatsSservice) {
        var vm = this;
        vm.homeTeamScoreCard = [];
        vm.awayTeamScoreCard = [];
        vm.homeTeamStats = {};
        vm.awayTeamStats = {};
        vm.matchId = $stateParams.matchId;
        vm.homeTeamId = $stateParams.homeTeamId;
        vm.awayTeamId = $stateParams.awayTeamId;

        vm.getScoreCardByMatchId = function () {
            scoreCardSservice.getScoreCardByMatchId(vm.matchId).then(function (resp) {
                vm.totalMatchData = resp;

                angular.forEach(vm.totalMatchData, function (item, key) {
                    if (item.teamId == vm.homeTeamId) {
                        vm.homeTeamScoreCard.push(item);
                        vm.homeTeamStats = {};
                    } else {
                        vm.awayTeamScoreCard.push(item);
                        vm.awayTeamStats = {};
                    }
                });
            });

            matchStatsSservice.getMatchStatsByMatchId(vm.matchId).then(function (resp) {
                vm.totalMatchStatsData = resp;

                angular.forEach(vm.totalMatchStatsData, function (item, key) {
                    if (item.teamId == vm.homeTeamId) {
                        vm.homeTeamStats = item;
                    } else {
                        vm.awayTeamStats = item;
                    }
                });
            });
        };
        vm.getScoreCardByMatchId();
    });
})();
