//addResultCtrl
(function () {
    myApp.controller('addIndividualScoresCtrl', function ($scope, $http, $stateParams, matchSservice, playersSservice) {
        var vm = this;
        vm.newResult = {};
        vm.addIndividualScores = {};
        vm.addIndividualScores.matchId = $stateParams.matchId;
        
        vm.individualScores = [];
        vm.saveResult = function () {
            resultSservice.saveNewVenue(vm.newResult).then(function (resp) {
                console.log("new Venue saving passed.");
            }, function () {
                console.log("new Venue saving failed.");
            });
        };
        var populateIndividualScores = function (data, team) {
            angular.forEach(data, function (val, key) {
                // create and empty array of all home Team players
                var individualScore = {};
                individualScore.matchId = vm.addIndividualScores.matchId;
                if (team == "home") {
                    individualScore.teamId = vm.homeTeam.teamId;
                } else {
                    individualScore.teamId = vm.awayTeam.teamId;
                }
                individualScore.memberId = val.memberId;
                individualScore.ballFaced = null;
                individualScore.runsScored = null;
                individualScore.six = null;
                individualScore.fours = null;
                individualScore.howOut = null;
                individualScore.oversBowled = null;
                individualScore.bowlingType = null;
                individualScore.wicketTaken = null;
                individualScore.runsGiven = null;
                individualScore.bowledBy = null;
                vm.individualScores.push(individualScore);
            });
        }
        var getTeamsByMatchId = function () {
            vm.teamList = [];
            matchSservice.getTeamsByMatchId(vm.addIndividualScores.matchId).then(function (resp) {
                vm.homeTeam = resp[0].homeTeamDetails;
                vm.awayTeam = resp[0].awayTeamDetails;
                playersSservice.getPlayersListByMatchId(vm.homeTeam.teamId, vm.awayTeam.teamId).then(function (resp) {
                    vm.homeTeam.teamList = resp[0]; // hometeam
                    vm.awayTeam.teamList = resp[1]; // awayTeam
                    populateIndividualScores(vm.homeTeam.teamList, "home");
                    populateIndividualScores(vm.awayTeam.teamList, "away");
                    //angular.forEach(vm.awayTeam.teamList, function (val, key) {
                    //    // create and empty array of all away Team players
                    //    var individualScore = {};
                    //    individualScore.matchId = vm.addIndividualScores.matchId;
                    //    individualScore.teamId = vm.awayTeam.teamId;
                    //    individualScore.memberId = val.memberId;
                    //    individualScore. = null;
                    //    individualScore. = null;
                    //    individualScore. = null;
                    //    individualScore. = null;
                    //    individualScore. = null;
                    //    individualScore. = null;
                    //    individualScore. = null;
                    //    individualScore. = null;
                    //    individualScore. = null;
                    //    individualScore. = null;
                    //    vm.individualScores.push(individualScore);
                    //});
                });
            });
        };

        vm.setValue = function (index, propertyName, memberId, value) {
            angular.forEach(vm.individualScores, function (val,key) {
                if (val.memberId == memberId) {
                    if (propertyName == "ballFaced") {
                        val.ballFaced = value;
                    } else if (propertyName == "runsScored") {
                        val.runsScored = value;
                    } else if (propertyName == "six") {
                        val.six = value;
                    } else if (propertyName == "fours") {
                        val.fours = value;
                    } else if (propertyName == "howOut") {
                        val.howOut = value;
                    } else if (propertyName == "oversBowled") {
                        val.oversBowled = value;
                    } else if (propertyName == "bowlingType") {
                        val.bowlingType = value;
                    } else if (propertyName == "wicketTaken") {
                        val.wicketTaken = value;
                    } else if (propertyName == "runsGiven") {
                        val.runsGiven = value;
                    } else if (propertyName == "bowledBy") {
                        val.bowledBy = value;
                    }
                }
            });
        };
        //vm.homeTeamIndividualScores
        //vm.saveHomeTeamIndividualScores = function () {
        //    vm.homeTeamIndividualScores.teamId = vm.teamList[0].teamId;
        //    individualScoreService.saveScore(vm.homeTeamIndividualScores).then(function () {
        //        vm.homeScoreSavedMsg = "Home Team's Score Saved Successfully !";
        //    });
        //}

        //vm.saveAwayTeamIndividualScores = function () {
        //    vm.homeTeamIndividualScores.teamId = vm.teamList[1].teamId;
        //    individualScoreService.saveScore(vm.awayTeamIndividualScores).then(function () {
        //        vm.awayScoreSavedMsg = "Away Team's Score Saved Successfully !";
        //    });
        //}

        getTeamsByMatchId();
    });
})();
