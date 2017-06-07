(function () {
    myApp.controller('matchesCtrl', function ($timeout, $scope, $http, config, filterFilter, $stateParams, globalVariables, seriesSservice, matchTypeSservice,
        matchSservice,$rootScope) {
        var vm = this;
        vm.matchView = 'List';
        vm.activeIndex = 0;

        vm.upComingExpanded = true;
        vm.completedExpanded = true;
        
        // get series list from series service
        vm.getSeriesList = function () {
            seriesSservice.getSeriesList().then(function (resp) {
                vm.seriesList = resp;
            });
        }

        vm.getButtonVisiblity = function () {
            vm.addMatches = false;
            if ($rootScope.currentUser != undefined) {
                angular.forEach($rootScope.currentUser.Roles, function (val) {
                    angular.forEach(val.Features, function (valFeature) {
                        if (valFeature.Name == "Add Match") {
                            vm.addMatches = true;
                        }
                    });
                });
            }
        };
        vm.getMatchesOnCalender = function (completedMatchesList,upComingMatchesList) {
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

        vm.getMatchesBySeriesId = function (seriesId) {
            matchSservice.getMatchesBySeriesId(seriesId).then(function (resp) {
                vm.allMatches = resp;
                vm.upComingmatchesList = filterFilter(vm.allMatches, { matchStateId: 1 }, true); // hardcoded for now.
                vm.completedMatchesList = filterFilter(vm.allMatches, { matchStateId: 2 }, true); // hardcoded for now.
            });
        };

        vm.changeSelectedIndex = function(index , matchType){
            vm.activeIndex = index;
            vm.matchType = matchType;
        }

        vm.getMatchByType = function (matchTypeId) {
            vm.upComingmatchesList = filterFilter(vm.allMatches, { 'matchStateId': 1, matchTypeDetails:{matchTypeId : parseInt(matchTypeId)}}, true); // hardcoded for now.
            vm.completedMatchesList = filterFilter(vm.allMatches, { 'matchStateId': 2, matchTypeDetails: { matchTypeId: parseInt(matchTypeId) } }, true); // hardcoded for now.
            //var upComingMatchesListForCalender = createMatchListForCalender(vm.upComingmatchesList);
            //var completedMatchesListForCalender = createMatchListForCalender(vm.completedMatchesList);
            //vm.getMatchesOnCalender(completedMatchesListForCalender, upComingMatchesListForCalender);
        }

        $scope.$watch('vm.selectedSeries.seriesId', function (newVal, oldVal) {
            if (newVal == 0) {
                vm.getMatchesBySeriesId(0);
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

        vm.saveMatch = function () {
            vm.match = {};
            vm.match.VenueId = vm.venueId;
            vm.match.MatchDate = new Date();
            vm.match.HomeTeam = 2;
            vm.match.AwayTeam = 1;
            vm.match.WonBy = null;
            vm.match.TossWonBy = null;
            vm.match.DecidedToBat = null;
            vm.match.WinningModeId = null;
            vm.match.MatchTypeId = 3;
            vm.match.MatchTime = "4:30 PM";
            vm.match.SeriesId = 1;
            vm.match.MatchStateId = 2;
            $http.post(config.apiUrl + 'SaveMatch/', vm.match).then(function (resp) {
                vm.matchesList = resp.data;
                console.log('Matches  loaded.');
            }, function (err) {
                console.log('Countries  failed.');
            });
        }
        vm.getButtonVisiblity();
    });
})();
