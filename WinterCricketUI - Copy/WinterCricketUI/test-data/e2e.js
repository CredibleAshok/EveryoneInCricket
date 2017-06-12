var myAppTest = angular.module('myAppTest', ['myApp', 'ngMockE2E']);

myAppTest.run(['$httpBackend', 'filterFilter', function ($httpBackend, filterFilter) {

    // Allow all requests for javascript and html to pass through.
    $httpBackend.whenGET(new RegExp('app\/.*')).passThrough();

    //api/People
    $httpBackend.whenGET(new RegExp('api\/People')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/profileListCtrl.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        return [200, data, {}];
    });

    //api/getcountries
    $httpBackend.whenGET(new RegExp('api\/Countries')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/countries.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        return [200, data, {}];
    });

    $httpBackend.whenGET(new RegExp('api\/PersonId')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/profileListCtrl.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        var filteredData = filterFilter(data, { PersonId: 1 }, true);
        return [200, filteredData, {}];
    });

    // get user.
    $httpBackend.whenGET(new RegExp('api\/getLoggedInUser')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/userData.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        return [200, data, {}];
    });

    //http://localhost:65481/api/Clubs
    $httpBackend.whenGET(new RegExp('api\/Clubs')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/clubs.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        return [200, data, {}];
    });

    //http://localhost:65481/api/countries
    $httpBackend.whenGET(new RegExp('api\/countries')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/countries.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        return [200, data, {}];
    });

    //http://localhost:65481/api/MatchesByState
    $httpBackend.whenGET(new RegExp('api\/matchesByStateId')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/matches.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        return [200, data, {}];
    });

    //http://localhost:65481/api/playersListByTeam
    $httpBackend.whenGET(new RegExp('api\/playersListByTeam')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/players.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        var paramTeamId = /api\/?.*?(?:\/?teamId=(.*))/.exec(url)[1];
        var filteredData = filterFilter(data, { teamId: parseInt(paramTeamId) }, true);
        return [200, filteredData, {}];
    });

    //http://localhost:65481/api/playerByMemberId
    $httpBackend.whenGET(new RegExp('api\/playerByMemberId')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/players.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        var paramMemberId = /api\/?.*?(?:\/?memberId=(.*))/.exec(url)[1];
        var filteredData = filterFilter(data, { memberId: parseInt(paramMemberId) }, true);
        return [200, filteredData, {}];
    });

    //http://localhost:65481/api/searchPlayersList
    $httpBackend.whenGET(new RegExp('api\/searchPlayersList')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/players.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        if (url.indexOf("?") > -1) {
            var firstName = url.split('?')[1].split('searchObj=')[1].split('firstName%22:%22')[1].split('%22')[0];
            var lastName = url.split('?')[1].split('searchObj=')[1].split('firstName%22:%22')[1].split('lastName%22:%22')[1].split('%22')[0];
            var playerId = url.split('?')[1].split('searchObj=')[1].split('firstName%22:%22')[1].split('playerId%22:')[1].split('%7D')[0];
            var filteredData = filterFilter(data, { memberId: parseInt(playerId) }, true);
            return [200, filteredData, {}];
        }else {
            return [200, data, {}];
        }
        
    });

    //$http.get(config.apiUrl + 'MatcheTypes/').then(function (resp) {
    $httpBackend.whenGET(new RegExp('api\/matchTypes')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/matchTypes.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        return [200, data, {}];
    });

    //http://localhost:65481/api/MatchesByTypeId
    $httpBackend.whenGET(new RegExp('api\/MatchesByTypeId')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/matches.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        return [200, data, {}];
    });

    //http://localhost:65481/api/getMatches
    $httpBackend.whenGET(new RegExp('api\/getMatches')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/matchList.js', false);
        request.send(null);
        var paramSeriesId = /api\/?.*?(?:\/?seriesId=(.*))/.exec(url)[1];
        var data = JSON.parse(request.response);
        if (paramSeriesId != "0") {
            var filteredData = filterFilter(data, { seriesId: parseInt(paramSeriesId) }, true);
            return [200, filteredData, {}];
        }
        return [200, data, {}];
    });

    //http://localhost:65481/api/getMatches
    $httpBackend.whenGET(new RegExp('api\/getResults')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/matchList.js', false);
        request.send(null);
        var paramMatchStateId = url.split('?')[1].split('&')[0].split('matchStateId=')[1];
        var paramSeriesId = url.split('?')[1].split('&')[1].split('seriesId=')[1]
        var data = JSON.parse(request.response);
        if (paramSeriesId != '0') {
            var filteredData = filterFilter(data, { matchStateId: parseInt(paramMatchStateId), seriesId: parseInt(paramSeriesId) }, true);
        } else {
            var filteredData = filterFilter(data, { matchStateId: parseInt(paramMatchStateId) }, true);
        }
        return [200, filteredData, {}];
    });

    //http://localhost:1984/#!/playerInfo/1/resultsByTeam
    $httpBackend.whenGET(new RegExp('api\/getResultByTeam\/')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/matchList.js', false);
        request.send(null);
        var paramMatchStateId = url.split('?')[1].split('&')[0].split('matchStateId=')[1];
        var paramMemberId = url.split('?')[1].split('&')[1].split('memberId=')[1];
        var paramSeriesId = url.split('?')[1].split('&')[2].split('seriesId=')[1];
        var paramTeamId = url.split('?')[1].split('&')[3].split('teamId=')[1];
        var data = JSON.parse(request.response); // todo: my filter is working as a and filter till now, need to look any way by which i can search in or values.
        if (paramSeriesId != '0') {
            var filteredData = filterFilter(data, { homeTeamId: parseInt(paramMemberId), seriesId: parseInt(paramSeriesId) }, true);
        } else {
            var filteredData = filterFilter(data, {homeTeamId: parseInt(paramMemberId)}, true);
        }
        return [200, filteredData, {}];
    });
    
    //http://localhost:1984/#!/playerInfo/1/getMemberMatches
    $httpBackend.whenGET(new RegExp('api\/getMemberMatches')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/matchList.js', false);
        request.send(null);
        var paramSeriesId = url.split('?')[1].split('&')[0].split('seriesId=')[1];
        var paramTeamId = url.split('?')[1].split('&')[1].split('teamId=')[1];
        
        var data = JSON.parse(request.response); // todo: my filter is working as a and filter till now, need to look any way by which i can search in or values.
        if (paramSeriesId != '0') {
            var filteredData = filterFilter(data, { homeTeamId: parseInt(paramTeamId), seriesId: parseInt(paramSeriesId) }, true);
        } else {
            var filteredData = filterFilter(data, { homeTeamId: parseInt(paramTeamId) }, true);
        }
        return [200, filteredData, {}];
    });

    //http://localhost:1984/#!/playerInfo/1/teamsList
    $httpBackend.whenGET(new RegExp('api\/teamsList')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/teamList.js', false); //todo: change filename to teamList to teamsList.
        request.send(null);
        var data = JSON.parse(request.response);
        return [200, data, {}];
    });
    
    //http://localhost:65481/api/getAllSeriesList
    $httpBackend.whenGET(new RegExp('api\/getAllSeriesList')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/seriesList.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        return [200, data, {}];
    });
    
    //http://localhost:65481/api/scoreCardByMatchId
    $httpBackend.whenGET(new RegExp('api\/scoreCardByMatchId')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/individualScores.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        var paramMatchId = /api\/?.*?(?:\/?matchId=(.*))/.exec(url)[1];
        var data = JSON.parse(request.response);
        if (paramMatchId != "0") {
            var filteredData = filterFilter(data, { matchId: parseInt(paramMatchId) }, true);
            return [200, filteredData, {}];
        }
        return [200, data, {}];
    });
    //
    //http://localhost:65481/api/getResultInfo
    $httpBackend.whenGET(new RegExp('api\/getResultInfo')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/resultsList.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        var paramMatchId = /api\/?.*?(?:\/?matchId=(.*))/.exec(url)[1];
        var data = JSON.parse(request.response);
        if (paramMatchId != "0") {
            var filteredData = filterFilter(data, { matchId: parseInt(paramMatchId) }, true);
            return [200, filteredData, {}];
        }
        return [200, data, {}];
    });

    //http://localhost:65481/api/scoreCardByMatchId
    $httpBackend.whenGET(new RegExp('api\/getMatchStatsByMatchId')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/matchStatsList.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        var paramMatchId = /api\/?.*?(?:\/?matchId=(.*))/.exec(url)[1];
        var data = JSON.parse(request.response);
        if (paramMatchId != "0") {
            var filteredData = filterFilter(data, { matchId: parseInt(paramMatchId) }, true);
            return [200, filteredData, {}];
        }
        return [200, data, {}];
    });

    //http://localhost:65481/api/getVenuesList
    $httpBackend.whenGET(new RegExp('api\/getVenuesList')).respond(function (method, url) {
        var request = new XMLHttpRequest();
        request.open('GET', 'test-data/venueList.js', false);
        request.send(null);
        var data = JSON.parse(request.response);
        return [200, data, {}];
    });
}]);
