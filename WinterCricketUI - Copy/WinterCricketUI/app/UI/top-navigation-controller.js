//This controller controls the dynamic display of menu items or top level navegation.
(function () {
    myApp.controller('topNavigationCtrl', function ($scope, routes, $filter, securitySservice, $rootScope) {
        var vm = this;
        vm.routes = routes;
        $rootScope.currentUser = securitySservice.getcurrentUser();
        //vm.currentUser = $rootScope.currentUser;
    })
})();
