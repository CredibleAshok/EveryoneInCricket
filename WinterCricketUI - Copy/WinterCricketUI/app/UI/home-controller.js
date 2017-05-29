(function () {
    myApp.config(function ($stateProvider, $urlRouterProvider) {

        var routes = [{
            name: 'home',
            stateConfig: {
                url: '',
                templateUrl: 'index.html',
                data: {
                    breadCrumbDisplay: 'Home'
                }
            }
        }, {
            name: 'liveScore',
            stateConfig: {
                url: '/liveScore/matchId:matchId/homeTeamId:homeTeamId/awayTeamId:awayTeamId',
                templateUrl: 'app/UI/live-scores.html',
                data: {
                    breadCrumbDisplay: 'Live Score'
                }
            }
        }, {
            name: 'matches',
            stateConfig: {
                url: '/matches',
                templateUrl: 'app/UI/matches.html',
                data: {
                    breadCrumbDisplay: 'Matches'
                }
            }
        }, {
            name: 'teams',
            stateConfig: {
                url: '/teams',
                templateUrl: 'app/UI/teams.html',
                data: {
                    breadCrumbDisplay: 'Teams'
                }
            }
        }, {
            name: 'venues',
            stateConfig: {
                url: '/venues',
                templateUrl: 'app/UI/venues.html',
                data: {
                    breadCrumbDisplay: 'Venues'
                }
            }
        }, {
            name: 'matchesByStateId',
            stateConfig: {
                url: '/matches/:matchStateId',
                templateUrl: 'app/UI/matches.html',
                data: {
                    breadCrumbDisplay: 'Matches By State'
                }
            }
        }, {
            name: 'matchesByType',
            stateConfig: {
                url: '/matches/:matchTypeId',
                templateUrl: 'app/UI/matches.html',
                data: {
                    breadCrumbDisplay: 'Matches By Type'
                }
            }
        }, {
            name: 'playersList',
            stateConfig: {
                url: '/playersList/:teamId',
                templateUrl: 'app/UI/players-list.html',
                data: {
                    breadCrumbDisplay: 'Player List'
                }
            }
        }, {
            name: 'results',
            stateConfig: {
                url: '/results',
                templateUrl: 'app/UI/results.html',
                data: {
                    breadCrumbDisplay: 'Results'
                }
            }
        }, {
            name: 'playerInfo.resultsByTeam',
            stateConfig: {
                url: '/resultsByTeam',
                templateUrl: 'app/UI/results-by-team.html',
                data: {
                    breadCrumbDisplay: 'Results By Team'
                }
            }
        }, {
            name: 'playerInfo.matchesByTeam',
            stateConfig: {
                url: '/matchesByTeam',
                templateUrl: 'app/UI/matches-by-Team.html',
                data: {
                    breadCrumbDisplay: 'Matches By Team'
                }
            }
        }, {
            name: 'playerInfo.playerProfile',
            stateConfig: {
                url: '/profile',
                templateUrl: 'app/UI/player-profile.html',
                data: {
                    breadCrumbDisplay: 'Player Profile'
                }
            }
        }, {
            name: 'playerInfo',
            stateConfig: {
                url: '/playerInfo/:memberId/:teamId',
                templateUrl: 'app/UI/player-info.html',
                data: {
                    breadCrumbDisplay: 'Player Info'
                }
            }
        }, {
            name: 'playerSearch',
            stateConfig: {
                url: '/playerSearch',
                templateUrl: 'app/UI/player-search.html',
                data: {
                    breadCrumbDisplay: 'Player Search'
                }
            }
        }, {
            name: 'helloWorld',
            stateConfig: {
                url: '/helloWorld',
                templateUrl: 'app/UI/hello-world/hello-world.html',
                data: {
                    breadCrumbDisplay: 'Hello World'
                }
            }
        }, {
            name: 'helloWorld.hello',
            stateConfig: {
                url: '/hello',
                templateUrl: 'app/UI/hello-world/hello.html',
                data: {
                    breadCrumbDisplay: 'Hello'
                }
            }
        }, {
            name: 'helloWorld.about',
            stateConfig: {
                url: '/about',
                templateUrl: 'app/UI/hello-world/about.html',
                data: {
                    breadCrumbDisplay: 'About'
                }
            }
        }, {
            name: 'helloWorld.helloPeople',
            stateConfig: {
                url: '/helloPeople',
                templateUrl: 'app/UI/hello-world/hello-people.html',
                data: {
                    breadCrumbDisplay: 'People'
                }
            }
        }, {
            name: 'helloWorld.helloPeople.helloPerson',
            stateConfig: {
                url: '/helloPerson/:id',
                templateUrl: 'app/UI/hello-world/person.html',
                data: {
                    breadCrumbDisplay: 'Person'
                }
            }
        }];

        routes.forEach(function (r) {
            $stateProvider.state(r.name, r.stateConfig);
        })
    });

    myApp.controller('homeCtrl', function ($rootScope, $scope, $interval, $filter, globalVariables, $state, filterFilter) {
        var vm = this;
        $rootScope.statesArray = [];
        console.log(globalVariables.showhideContent);
        //todo - first, check if this config is loaded without problems then, check the same for appKeys.somevariable, if this works without problem, then we can straight away use this variblae
        // in our html page.
        vm.img1 = "/app/content/images/flags/Brazil1.png";
        vm.img2 = "/app/content/images/flags/France1.png";
        vm.img3 = "/app/content/images/flags/China1.png";
        vm.timer = null;
        vm.startTimer = function () {
            vm.message = "Timer started";
            vm.timer = $interval(function () {
                vm.timeClick = $filter('date')(new Date(), 'ss');
                vm.message = "Timer Ticked. " + vm.timeClick;
                if (vm.timeClick > 100) {
                    $interval.cancel(vm.timer);
                }
            }, 1000);
        };
        $('.carousel').carousel({
            interval: 2000
        })

        $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
            //console.log("state change." + to.name);
            var paths = to.name.split('.');
            vm.breadcrumbs = [];
            vm.finalBreadCrumbObjectArray = [];
            var newitem = "";
            for (var i = 0; i < paths.length; i++) {
                newitem = newitem + '.' + paths[i];
                vm.breadcrumbs.push(newitem.substring(1));
            }

            vm.allStates = $state.get();

            angular.forEach(vm.breadcrumbs, function (value, key) {
                var crumbRouteName = filterFilter(vm.allStates, { name: value }, true);
                vm.finalBreadCrumbObjectArray.push({ "name": value, "crumbName": crumbRouteName[0].data.breadCrumbDisplay });
            });
        });
    })


})();
