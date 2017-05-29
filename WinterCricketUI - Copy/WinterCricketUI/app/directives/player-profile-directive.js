(function () {
    myApp.directive('playerProfileTpl', [playerProfileDirectiveFunction]);
    function playerProfileDirectiveFunction() {
        //Usage:
        //<div player-profile-tpl ></div>
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/directives/templates/player-profile-tpl.html',
            scope: {
                'playersList': '=playersList'
            },
        };
        return directive;
        function link(scope, element, attrs, ctrl) {
            console.log('player profile directive loaded.');
        }

    }
})();

