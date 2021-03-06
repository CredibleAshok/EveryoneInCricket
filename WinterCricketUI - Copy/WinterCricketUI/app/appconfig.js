(function () {
    'use strict';

    var myApp = angular.module('myApp');
    //#region Routes
    var routes = [{
        name: 'home',
        stateConfig: {
            url: '',
            templateUrl: 'index.html',
            data: {
                title: 'Home',
                topLevelMenu: true,
                hasChild: false
            }
        }
    }, {
        name: 'liveScore',
        stateConfig: {
            url: '/liveScore/matchId:matchId/homeTeamId:homeTeamId/awayTeamId:awayTeamId',
            templateUrl: 'app/UI/live-scores.html',
            data: {
                title: 'Live Score',
                topLevelMenu: true,
                hasChild: false
            }
        }
    }, {
        name: 'matches',
        stateConfig: {
            url: '/matches',
            templateUrl: 'app/UI/matches.html',
            data: {
                title: 'Matches',
                topLevelMenu: true,
                hasChild: false
            }
        }
    }, {
        name: 'teams',
        stateConfig: {
            url: '/teams',
            templateUrl: 'app/UI/teams.html',
            data: {
                title: 'Teams',
                topLevelMenu: true,
                hasChild: true
            }
        }
    }, {
        name: 'matchesByStateId',
        stateConfig: {
            url: '/matches/:matchStateId',
            templateUrl: 'app/UI/matches.html',
            data: {
                title: 'Matches By State'
            }
        }
    }, {
        name: 'matchesByType',
        stateConfig: {
            url: '/matches/:matchTypeId',
            templateUrl: 'app/UI/matches.html',
            data: {
                title: 'Matches By Type'
            }
        }
    }, {
        name: 'playersList',
        stateConfig: {
            url: '/playersList/:teamId',
            templateUrl: 'app/UI/players-list.html',
            data: {
                title: 'Player List'
            }
        }
    }, {
        name: 'results',
        stateConfig: {
            url: '/results',
            templateUrl: 'app/UI/results.html',
            data: {
                title: 'Results',
                topLevelMenu: true,
                hasChild: false
            }
        }
    }, {
        name: 'playerInfo.resultsByTeam',
        stateConfig: {
            url: '/resultsByTeam',
            templateUrl: 'app/UI/results-by-team.html',
            data: {
                title: 'Results By Team'
            }
        }
    }, {
        name: 'playerInfo.matchesByTeam',
        stateConfig: {
            url: '/matchesByTeam',
            templateUrl: 'app/UI/matches-by-Team.html',
            data: {
                title: 'Matches By Team'
            }
        }
    }, {
        name: 'playerInfo.playerProfile',
        stateConfig: {
            url: '/profile',
            templateUrl: 'app/UI/player-profile.html',
            data: {
                title: 'Player Profile'
            }
        }
    }, {
        name: 'playerInfo',
        stateConfig: {
            url: '/playerInfo/:memberId/:teamId',
            templateUrl: 'app/UI/player-info.html',
            data: {
                title: 'Player Info'
            }
        }
    }, {
        name: 'playerSearch',
        stateConfig: {
            url: '/playerSearch',
            templateUrl: 'app/UI/player-search.html',
            data: {
                title: 'Player Search'
            }
        }
    }, {
        name: 'helloWorld',
        stateConfig: {
            url: '/helloWorld',
            templateUrl: 'app/UI/hello-world/hello-world.html',
            data: {
                title: 'Hello World'
            }
        }
    }, {
        name: 'helloWorld.hello',
        stateConfig: {
            url: '/hello',
            templateUrl: 'app/UI/hello-world/hello.html',
            data: {
                title: 'Hello'
            }
        }
    }, {
        name: 'helloWorld.about',
        stateConfig: {
            url: '/about',
            templateUrl: 'app/UI/hello-world/about.html',
            data: {
                title: 'About'
            }
        }
    }, {
        name: 'helloWorld.helloPeople',
        stateConfig: {
            url: '/helloPeople',
            templateUrl: 'app/UI/hello-world/hello-people.html',
            data: {
                title: 'People'
            }
        }
    }, {
        name: 'helloWorld.helloPeople.helloPerson',
        stateConfig: {
            url: '/helloPerson/:id',
            templateUrl: 'app/UI/hello-world/person.html',
            data: {
                title: 'Person'
            }
        }
    }, {
        name: 'league',
        stateConfig: {
            url: '/league',
            templateUrl: 'app/UI/league.html',
            data: {
                title: 'League',
                topLevelMenu: true,
                //#region childRoute venues
                childRoute: [{
                    name: 'venues',
                    stateConfig: {
                        url: '/venues',
                        templateUrl: 'app/UI/venues.html',
                        data: {
                            title: 'Venues',
                            childRoute: [{
                                name: "grandChild",
                                stateConfig: {
                                    url: '',
                                    templateUrl: 'app/UI/grandChild.html',
                                    data: {
                                        title: 'Grand Child'
                                    }
                                },
                            }]
                        }
                    }
                }]
                //#endregion childRoute
            }
        }
    }, {
        name: 'login',
        stateConfig: {
            url: '/login',
            templateUrl: 'app/UI/login.html',
            data: {
                title: 'Login',
                topLevelMenu: true,
                hasChild: false
            }
        }
    },
    //#region post request routes
    {
        name: 'addMatch',
        stateConfig: {
            url: '/add-match',
            templateUrl: 'app/UI/add-match.html',
            data: {
                title: 'New Match',
                topLevelMenu: false,
                hasChild: false
            }
        }
    }, {
        name: 'addVenue',
        stateConfig: {
            url: '/add-venue',
            templateUrl: 'app/UI/add-venue.html',
            data: {
                title: 'New Venue',
                topLevelMenu: false,
                hasChild: false
            }
        }
    }, {
        name: 'addResult',
        stateConfig: {
            url: '/add-result/:matchId',
            templateUrl: 'app/UI/add-result.html',
            data: {
                title: 'New Result',
                topLevelMenu: false,
                hasChild: false
            }
        }
    }, {
        name: 'addScoreCard',
        stateConfig: {
            url: '/add-scoreCard/:matchId',
            templateUrl: 'app/UI/add-score-card.html',
            data: {
                title: 'New Score Card',
                topLevelMenu: false,
                hasChild: false
            }
        }
    }, {
        name: 'addTeam',
        stateConfig: {
            url: '/add-team',
            templateUrl: 'app/UI/add-team.html',
            data: {
                title: 'New Team',
                topLevelMenu: false,
                hasChild: false
            }
        }
    }, {
        name: 'addmember',
        stateConfig: {
            url: '/add-member',
            templateUrl: 'app/UI/add-member.html',
            data: {
                title: 'New Member',
                topLevelMenu: false,
                hasChild: false
            }
        }
    }, {
        name: 'addPlayer',
        stateConfig: {
            url: '/add-player/:teamId',
            templateUrl: 'app/UI/add-member.html',
            data: {
                title: 'New Player',
                topLevelMenu: false,
                hasChild: false
            }
        }
    }, {
        name: 'addMatchStats',
        stateConfig: {
            url: '/add-match-stats/:matchId',
            templateUrl: 'app/UI/add-match-stats.html',
            data: {
                title: 'New Match Stats',
                topLevelMenu: false,
                hasChild: false
            }
        }
    }, {
        name: 'addIndividualScore',
        stateConfig: {
            url: '/add-invididual-scores/:matchId',
            templateUrl: 'app/UI/add-invididual-scores.html',
            data: {
                title: 'Add Invididual Scores',
                topLevelMenu: false,
                hasChild: false
            }
        }
    }
    //#endregion post request routes
    ];

    myApp.constant('routes', routes);

    myApp.config(function ($stateProvider, $urlRouterProvider, routes) {
        routes.forEach(function (r) {
            $stateProvider.state(r.name, r.stateConfig); // register all routes are top level
            if (r.stateConfig.data.childRoute != undefined && r.stateConfig.data.childRoute.length > 0) {
                var child = r.stateConfig.data.childRoute;
                angular.forEach(child, function (c,key) {
                    $stateProvider.state(c.name, c.stateConfig); // register child routes
                    if (c.stateConfig.data.childRoute != undefined && c.stateConfig.data.childRoute.length > 0) {
                        var grandChild = c.stateConfig.data.childRoute;
                        angular.forEach(grandChild, function (gChild) {
                            $stateProvider.state(gChild.name, gChild.stateConfig); // register grand child routes
                        });
                    }
                });
            }
        })
    });

    //#endregion Routes

    myApp.constant('config', {
        apiUrl: 'http://localhost:54650/api/',
        baseUrl: '/',
        enableDebug: true
    });

    var globalVariables = {
        showhideContent: false
    };

    myApp.value('globalVariables', globalVariables);
})();
