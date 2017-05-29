(function () {
    myApp.controller('matchesByTeamCtrl', function ($timeout, $scope, $http, config, filterFilter, $stateParams, globalVariables, seriesSservice, matchTypeSservice,
        matchSservice) {
        var vm = this;
        vm.matchView = 'List';
        vm.activeIndex = 0;

        vm.upComingExpanded = true;
        vm.completedExpanded = true;

        vm.memberId = $stateParams.memberId;
        vm.teamId = $stateParams.teamId;// this is used only for this controller.

        // get series list from series service
        vm.getSeriesList = function () {
            seriesSservice.getSeriesList().then(function (resp) {
                vm.seriesList = resp;
            });
        }

        vm.getMatchesOnCalender = function (completedMatchesList, upComingMatchesList) {
            $('#calendarCompletedMatches').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                defaultDate: '2017-05-01',
                navLinks: true, // can click day/week names to navigate views
                editable: true,
                eventLimit: true, // allow "more" link when too many events
                events: completedMatchesList
            });

            $('#calendarUpComingMatches').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                defaultDate: '2017-05-01',
                navLinks: true, // can click day/week names to navigate views
                editable: true,
                eventLimit: true, // allow "more" link when too many events
                events: upComingMatchesList
            });
        }

        vm.getMemberMatchesBySeriesId = function (teamId, seriesId) {
            matchSservice.getMemberMatchesBySeriesId(teamId, seriesId).then(function (resp) {
                vm.allMatches = resp;
                vm.upComingmatchesList = filterFilter(vm.allMatches, { matchStateId: 1 }, true); // hardcoded for now.
                vm.completedMatchesList = filterFilter(vm.allMatches, { matchStateId: 2 }, true); // hardcoded for now.
            });
        };

        vm.changeSelectedIndex = function (index, matchType) {
            vm.activeIndex = index;
            vm.matchType = matchType;
        }

        vm.getMatchByType = function (matchTypeId) {
            vm.upComingmatchesList = filterFilter(vm.allMatches, { 'matchStateId': 1, matchTypeDetails: { matchTypeId: parseInt(matchTypeId) } }, true); // hardcoded for now.
            vm.completedMatchesList = filterFilter(vm.allMatches, { 'matchStateId': 2, matchTypeDetails: { matchTypeId: parseInt(matchTypeId) } }, true); // hardcoded for now.
            //var upComingMatchesListForCalender = createMatchListForCalender(vm.upComingmatchesList);
            //var completedMatchesListForCalender = createMatchListForCalender(vm.completedMatchesList);
            //vm.getMatchesOnCalender(completedMatchesListForCalender, upComingMatchesListForCalender);
        }

        $scope.$watch('vm.selectedSeries.seriesId', function (newVal, oldVal) {
            if (newVal == 0) {
                vm.getMemberMatchesBySeriesId(vm.teamId, 0);
            }
        });

        $scope.$watch('vm.activeIndex', function (newVal, oldVal) {
            vm.getMatchByType(vm.matchType);
        });

        $timeout(function () {
            vm.selectedSeries = vm.seriesList[0];
        }, 500);

        vm.expandUpcomingMatches = function () {
            vm.upComingExpanded = !vm.upComingExpanded;
        }

        vm.expandCompletedMatches = function () {
            vm.completedExpanded = !vm.completedExpanded;
        }

        function createMatchListForCalender(sourceData) {
            var targetdata = [];
            angular.forEach(sourceData, function (value, key) {
                var item = {};
                item.title = value.HomeTeamName + ' VS ' + value.AwayTeamName + ' At ' + value.VenueName;
                item.start = value.MatchDate;
                item.end = value.MatchDate;
                targetdata.push(item);
            });
            return targetdata;
        }


        // This should be a part of service
        vm.getMatchTypes = function () {
            matchTypeSservice.getMatchTypeList().then(function (resp) {
                vm.matcheTypesList = resp;
            });
        };
        // flow of onload functions        
        vm.getSeriesList();
        vm.getMatchTypes();

        vm.showAddNewMatch = false;
        vm.addNewMatch = function () {
            vm.showAddNewMatch = true;
        }
    });
})();
