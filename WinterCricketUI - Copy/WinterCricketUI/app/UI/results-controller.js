(function () {
    myApp.controller('resultsCtrl', function ($scope, $http, config, filterFilter, $state, $stateParams, matchSservice, seriesSservice, matchTypeSservice, $timeout) {
        var vm = this;
        vm.matchesByStateId = 2; // because 1 means upcoming, 2 means completed.
        vm.activeIndex = 0;
        vm.allMatchesData = [];
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
                vm.getMatchesBySeriesId(newVal, vm.matchesByStateId);
                //vm.getCompletedMatchesBySeriesId(newVal, vm.matchesByStateId); // newVal passed as seriesId
            }
        });

        vm.getMatchesBySeriesId = function (seriesId, matchStateId) {
            matchSservice.getCompletedMatchesBySeriesId(seriesId, matchStateId).then(function (resp) {
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
