//addMatchCtrl
(function () {
    myApp.controller('addMatchCtrl', function ($scope, $http, $stateParams, matchSservice, teamsSservice) {
        var vm = this;
        vm.newMatch = {};
        //#region initial data
        vm.newMatch.series = {
            "seriesId": 1,
            "seriesName": "Series 1",
            "year": "2016",
            "seriesValidFrom": "1 March 2016",
            "seriesValidTo": "17 March 2016"
        };

        vm.newMatch.homeTeam = {
            "teamId": 1,
            "name": "Bayswater",
            "validFrom": "10-Jan-2010",
            "validTo": "10-Jan-2020",
            "teamFlagId": 1,
            "captain": "Captain 1"
        };

        vm.newMatch.awayTeam = {
            "teamId": 2,
            "name": "Bentley",
            "validFrom": "10-Jan-2010",
            "validTo": "10-March-2020",
            "teamFlagId": 2,
            "captain": "Captain 2"
        };
        vm.newMatch.matchDate = new Date();
        vm.newMatch.matchType = {
            "matchTypeId": 1,
            "name": "T-20"
        };
        vm.newMatch.venue = {
            "venueId": 1,
            "name": "Venue 1",
            "countryId": 1,
            "stateId": 1,
            "suburb": 2,
            "postCode": 6001
        }
        //#endregion initial data

        //#region datepicker settings
        vm.format = 'dd/MMMM/yyyy';
        vm.popup1 = {
            opened: false
        };

        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        vm.open1 = function () {
            vm.popup1.opened = true;
        };

        vm.dateOptions = {
            //dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };
        //#endregion datepicker settings

        vm.saveMatch = function () {
            matchSservice.saveNewMatch(vm.newMatch).then(function (resp) {
                console.log("new match saving passed.");
            }, function () {
                console.log("new match saving failed.");
            });
        };

        var getTeamList = function () {
            teamsSservice.getTeamsList().then(function (resp) {
                vm.teamlist = resp;
            });
        };
        getTeamList();
    });
})();
