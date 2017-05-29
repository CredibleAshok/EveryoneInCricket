(function () {
    myApp.controller('playerInfoCtrl', function ($scope, $http, $stateParams, $state) {
        var vm = this;
        vm.memberId = $stateParams.memberId;
        vm.teamId = $stateParams.teamId;
        vm.activeLink = 'Profile';
        $state.go('playerInfo.playerProfile'); // wants to open this link by default.
        //playerInfo / 1 / profile / 1
    });
})();
