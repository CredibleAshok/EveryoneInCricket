(function () {
    myApp.controller('playersListCtrl', function ($scope, $http, config, filterFilter, $stateParams, playersSservice, $state) {
        var vm = this;
        vm.teamId = $stateParams.teamId;

        vm.getPlayersByTeamList = function () {
            playersSservice.getplayersByTeamId(vm.teamId).then(function (resp) {
                vm.playersList = resp;
            });
        };

        vm.getPlayersByTeamList();
    });
})();
