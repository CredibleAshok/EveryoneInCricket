(function () {
    myApp.controller('resultsByTeamCtrl', function ($scope, $http, config, filterFilter, $stateParams, matchSservice, seriesSservice, matchTypeSservice, $timeout) {
        var vm = this;
        vm.matchesByStateId = 1; // because 1 means completed, 2 means upcoming.
        vm.activeIndex = 0;
        vm.allMatchesData = [];
        vm.memberId = $stateParams.memberId;
        vm.teamId = $stateParams.teamId;// this is used only for this controller.
        // get series list from series service
        vm.getSeriesList = function () {
            seriesSservice.getSeriesList().then(function (resp) {
                vm.seriesList = resp;
            });
        }

        $timeout(function () {
            vm.selectedSeries = vm.seriesList[0];
        }, 500);

        $scope.$watch('vm.selectedSeries.seriesId', function (newVal, oldVal) {
            if (newVal == 0) {
                vm.getResultsByMemberBySeriesId(vm.memberId, vm.teamId, newVal, vm.matchesByStateId);
            }
        });

        vm.getResultsByMemberBySeriesId = function (memberId, teamId, seriesId, matchStateId) {
            matchSservice.getResultsByMemberBySeriesId(vm.memberId, vm.teamId, seriesId, vm.matchesByStateId).then(function (resp) {
                vm.completedMatchesList = resp;
                vm.allMatchesData = angular.copy(resp);
            });
        };

        vm.getMatchTypes = function () {
            matchTypeSservice.getMatchTypeList().then(function (resp) {
                vm.matcheTypesList = resp;
            });
        };

        vm.getSeriesList();
        vm.getMatchTypes();

        $scope.$watch('vm.activeIndex', function (newVal, oldVal) {
            vm.getMatchByType(vm.matchType);
        });

        vm.getMatchByType = function (matchTypeId) {
            vm.completedMatchesList = filterFilter(vm.allMatchesData, { matchTypeDetails: { matchTypeId: parseInt(matchTypeId) } }, true); // hardcoded for now.
        }

        vm.changeSelectedIndex = function (index, matchType) {
            vm.activeIndex = index;
            vm.matchType = matchType;
        }
    });
})();
