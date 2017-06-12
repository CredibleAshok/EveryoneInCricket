//addTeamCtrl
(function () {
    myApp.controller('addTeamCtrl', function ($scope, $http, $stateParams, playersSservice) {
        var vm = this;
        vm.newVenue = {};
        //#region datepicker settings valid To
        vm.validTo = {
            opened: false
        };
        vm.openValidTo = function () {
            vm.validTo.opened = true;
        };
        //#region datepicker settings valid To

        //#region datepicker settings valid From
        vm.format = 'dd/MMMM/yyyy';
        vm.validFrom = {
            opened: false
        };

        function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        vm.openValidFrom = function () {
            vm.validFrom.opened = true;
        };

        vm.dateOptions = {
            //dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };
        //#endregion datepicker settings  valid From
        vm.saveTeam = function () {
            playersSservice.saveNewTeam(vm.newTeam).then(function (resp) {
                console.log("new Venue saving passed.");
            }, function () {
                console.log("new Venue saving failed.");
            });
        };

        var getProfile = function () {
            console.log("addVenuCtrl controller loaded.");
        };
        getProfile();
    });
})();
