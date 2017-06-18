//addMemberCtrl
(function () {
    myApp.controller('addMemberCtrl', function ($scope, $http, $stateParams, venuesSservice) {
        var vm = this;
        vm.teamId = $stateParams.teamId;
        vm.newMember = {};

        //#region inital data
        vm.newMember.name = "Test Player";
        vm.newMember.memberType = { "id": 1, "name": "Player" };
        vm.newMember.playerType = { "id": 1, "name": "Batsman" };
        vm.newMember.isCaptain = true;
        vm.newMember.isWicketKeeper = true;
        vm.newMember.playingHand = true;
        //#endregion inital data

        
        vm.memberType = [{ "id": 1, "name": "Player" }, { "id": 2, "name": "Manager" }, { "id": 3, "name": "Coach" }, { "id": 4, "name": "President" }, { "id": 5, "name": "Umpire" }, { "id": 6, "name": "Scorer" }];
        vm.playerType = [{ "id": 1, "name": "Batsman" }, { "id": 2, "name": "Bowler" }, { "id": 3, "name": "All-rounder" }];
        vm.saveVenue = function () {
            venuesSservice.saveNewVenue(vm.newVenue).then(function (resp) {
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
