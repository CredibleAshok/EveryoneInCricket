(function () {
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
            $rootScope.currentState = to;
            $rootScope.previousState = from;
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
                vm.finalBreadCrumbObjectArray.push({ "name": value, "crumbName": crumbRouteName[0].data.title });
            });
        });
    })


})();
