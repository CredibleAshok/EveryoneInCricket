(function() {
    myApp.controller('playerProfileCtrl', function ($scope, $http, $stateParams, playerSservice) {
        var vm = this;
        vm.memberId = $stateParams.memberId;
        var getProfile = function () {
            playerSservice.getplayerByMemberId(vm.memberId).then(function (resp) {
                vm.playersList = resp;
            });
        };
        getProfile();
    });
}) ();
