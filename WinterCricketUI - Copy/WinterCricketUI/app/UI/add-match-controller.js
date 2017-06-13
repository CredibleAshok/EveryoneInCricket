//addMatchCtrl
(function () {
    myApp.controller('addMatchCtrl', function ($scope, $http, $stateParams, matchSservice, teamsSservice) {
        var vm = this;
        vm.newMatch = {};
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
