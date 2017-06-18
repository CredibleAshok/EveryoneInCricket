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
                //individualScore.ballFaced = null;
                //individualScore.runsScored = null;
                //individualScore.six = null;
                //individualScore.fours = null;
                //individualScore.howOut = null;
                //individualScore.oversBowled = null;
                //individualScore.bowlingType = null;
                //individualScore.wicketTaken = null;
                //individualScore.runsGiven = null;
                //individualScore.bowledBy = null;
                //test data
                individualScore.ballFaced = team + "-" + key + "-" + 1;
                individualScore.runsScored = team + "-" + key + "-" +  2;
                individualScore.six = team + "-" + key + "-" +  3;
                individualScore.fours = team + "-" + key + "-" +  4;
                individualScore.howOut = team + "-" + key + "-" +  5;
                individualScore.oversBowled = team + "-" + key + "-" +  6;
                individualScore.bowlingType = team + "-" + key + "-" +  7;
                individualScore.wicketTaken = team + "-" + key + "-" +  8;
                individualScore.runsGiven = team + "-" + key + "-" +  9;
                individualScore.bowledBy = team + "-" + key + "-" +  10;
                val.individualScore = individualScore;
                //vm.individualScores.push(individualScore);
            });
        }
        var getTeamsByMatchId = function () {
            matchSservice.getTeamsByMatchId(vm.addIndividualScores.matchId).then(function (resp) {
                vm.homeTeam = resp[0].homeTeamDetails;
                vm.awayTeam = resp[0].awayTeamDetails;
                playersSservice.getPlayersListByMatchId(vm.homeTeam.teamId, vm.awayTeam.teamId).then(function (resp) {
                    vm.homeTeam.teamList = resp[0]; // hometeam
                    vm.awayTeam.teamList = resp[1]; // awayTeam
                    populateIndividualScores(vm.homeTeam.teamList, "home");
                    populateIndividualScores(vm.awayTeam.teamList, "away");
                });
            });
        };
        vm.setValueFun = function (data, keepGoing, propertyName, memberId, value) {
            //var keepGoing = keepGoing;
            angular.forEach(data, function (val, key) {
                if (keepGoing) {
                    if (val.individualScore.memberId == memberId) {
                        if (propertyName == "ballFaced") {
                            val.individualScore.ballFaced = value;
                            keepGoing = false;
                        } else if (propertyName == "runsScored") {
                            val.individualScore.runsScored = value;
                            keepGoing = false;
                        } else if (propertyName == "six") {
                            val.individualScore.six = value;
                            keepGoing = false;
                        } else if (propertyName == "fours") {
                            val.individualScore.fours = value;
                            keepGoing = false;
                        } else if (propertyName == "howOut") {
                            val.individualScore.howOut = value;
                            keepGoing = false;
                        } else if (propertyName == "oversBowled") {
                            val.individualScore.oversBowled = value;
                            keepGoing = false;
                        } else if (propertyName == "bowlingType") {
                            val.individualScore.bowlingType = value;
                            keepGoing = false;
                        } else if (propertyName == "wicketTaken") {
                            val.individualScore.wicketTaken = value;
                            keepGoing = false;
                        } else if (propertyName == "runsGiven") {
                            val.individualScore.runsGiven = value;
                            keepGoing = false;
                        } else if (propertyName == "bowledBy") {
                            val.individualScore.bowledBy = value;
                            keepGoing = false;
                        }
                    }
                }
            });
        }
        vm.setValue = function (index, propertyName, memberId, value, team) {
            if (team == "home") {
                vm.setValueFun(vm.homeTeam.teamList, true, propertyName, memberId, value);
            } else {
                vm.setValueFun(vm.awayTeam.teamList, true, propertyName, memberId, value);
            }
        };
        
        vm.saveHomeTeamIndividualScores = function () {
            individualScoreService.saveScore(vm.homeTeam.teamList).then(function () {
                vm.homeScoreSavedMsg = "Home Team's Score Saved Successfully !";
            });
        }

        //vm.saveAwayTeamIndividualScores = function () {
        //    vm.homeTeamIndividualScores.teamId = vm.teamList[1].teamId;
        //    individualScoreService.saveScore(vm.awayTeamIndividualScores).then(function () {
        //        vm.awayScoreSavedMsg = "Away Team's Score Saved Successfully !";
        //    });
        //}

        getTeamsByMatchId();
    });
})();
