// REDI Software - Includes Customisations to support stSearch on Select Input fields.
// - Added stPersist
// - Added stTableFilteredList which allows the full filtered list to be made available to the UI (ignores paging).
// - Added stGlobalSearch on the table.  This allows searching across all columns (useful for quick find).
// - Modified stSearch to specify controller instead of require stTable.  Fixes issues in modal popups.
// - Added stGroup to supported grouping rows

/*  Description         : Added blank option in filter dropdown.
************************************************************************************************
    Author Name         : Ashok Tewatia
    Modified Date       : Sept 29, 2016
***********************************************************************************************/

(function (ng, undefined) {
    'use strict';

    ng.module('smart-table', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/smart-table/pagination.html',
            '<div class="pagination" ng-if="pages.length >= 2"><ul class="pagination">' +
            '<li ng-repeat="page in pages" ng-class="{active: page==currentPage}"><a ng-click="selectPage(page)">{{page}}</a></li>' +
            '</ul></div>');
    }]);

    ng.module('smart-table')
        .controller('stTableController', ['$scope', '$parse', '$filter', '$attrs', '$anchorScroll', '$location', function StTableController($scope, $parse, $filter, $attrs, $anchorScroll, $location) {
            var propertyName = $attrs.stTable;
            var fullListPropertyName = $attrs.stTableFilteredList;
            var displayGetter = $parse(propertyName);
            var displayFilteredList = $parse(fullListPropertyName);
            var displayFilteredSetter = displayFilteredList.assign;
            var displaySetter = displayGetter.assign;
            var safeGetter;
            var orderBy = $filter('orderBy');
            var filter = $filter('filter');
            var customFilterName = "";
            var safeCopy = copyRefs(displayGetter($scope));
            var tableState = {
                sort: {},
                search: {},
                colFilter: [],
                pagination: {
                    start: 0,
                    totalItemCount: 0
                },
                group: {

                }
            };
            var filtered;
            var pipeAfterSafeCopy = true;
            var ctrl = this;
            var lastSelected;

            function copyRefs(src) {
                return src ? [].concat(src) : [];
            }

            function updateSafeCopy() {
                safeCopy = copyRefs(safeGetter($scope));
                if (pipeAfterSafeCopy === true) {
                    ctrl.pipe();
                }
            }

            function deepDelete(object, path) {
                if (path.indexOf('.') != -1) {
                    var partials = path.split('.');
                    var key = partials.pop();
                    var parentPath = partials.join('.');
                    var parentObject = $parse(parentPath)(object)
                    delete parentObject[key];
                    if (Object.keys(parentObject).length == 0) {
                        deepDelete(object, parentPath);
                    }
                } else {
                    delete object[path];
                }
            }

            if ($attrs.stSafeSrc) {
                safeGetter = $parse($attrs.stSafeSrc);
                $scope.$watch(function () {
                    var safeSrc = safeGetter($scope);
                    return safeSrc ? safeSrc.length : 0;

                }, function (newValue, oldValue) {
                    if (newValue !== safeCopy.length) {
                        updateSafeCopy();
                    }
                });
                $scope.$watch(function () {
                    return safeGetter($scope);
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        updateSafeCopy();
                    }
                });
            }

            function groupByProperty(collection, property) {
                var output = [];
                var groupReference = {};

                for (var i = 0; i < collection.length; i++) {
                    var item = collection[i];
                    var keyValue = item[property];

                    var group = groupReference[keyValue];

                    if (group === undefined) {
                        group = {
                            key: keyValue,
                            items: []
                        };

                        groupReference[keyValue] = group;
                        output.push(group);
                    }

                    group.items.push(item);
                }

                return output;
            }


            /**
             * sort the rows
             * @param {Function | String} predicate - function or string which will be used as predicate for the sorting
             * @param [reverse] - if you want to reverse the order
             */
            this.sortBy = function sortBy(predicate, reverse) {
                tableState.sort.predicate = predicate;
                tableState.sort.reverse = reverse === true;
                tableState.pagination.start = 0;
                return this.pipe();
            };

            /**
             * search matching rows
             * @param {String} input - the input string
             * @param {String} [predicate] - the property name against you want to check the match, otherwise it will search on all properties
             */
            this.search = function search(input, predicate) {
                var predicateObject = tableState.search.predicateObject || {};
                var prop = predicate ? predicate : '$';

                input = ng.isString(input) ? input.trim() : input;
                /*
                    input is string for dropdown styled filters and object for checkbox styled.
                */
                if (ng.isString(input)) {
                    if (input == "Blank") {
                        $parse(prop).assign(predicateObject, "");
                    } else if (input == "Null") {
                        $parse(prop).assign(predicateObject, null);
                    } else if (input == "0") {
                        $parse(prop).assign(predicateObject, 0);
                    } else {
                        $parse(prop).assign(predicateObject, input);
                    }
                } else {
                    if (input.matchAny != undefined && input.matchAny.items[0] == "Blank") {
                        $parse(prop).assign(predicateObject, "");
                    } else if (input.matchAny != undefined && input.matchAny.items[0] == "Null") {
                        $parse(prop).assign(predicateObject, null);
                    } else if (input.matchAny != undefined && input.matchAny.items[0] == "0") {
                        $parse(prop).assign(predicateObject, 0);
                    } else {
                        $parse(prop).assign(predicateObject, input);
                    }
                }

                //boolean datatype support
                if ($.type(input) != "boolean") {
                    // to avoid to filter out null value
                    if (!input) {
                        deepDelete(predicateObject, prop);
                    }
                }
                tableState.search.predicateObject = predicateObject;
                tableState.pagination.start = 0;
                return this.pipe();
            };

            this.groupBy = function groupBy(predicate) {
                tableState.group.predicate = predicate ? predicate : undefined;
                return this.pipe();
            };

            /**
             * this will chain the operations of sorting and filtering based on the current table state (sort options, filtering, ect)
             */
            this.pipe = function pipe() {
                var alreadyFiltered = false;
                var pagination = tableState.pagination;
                var group = tableState.group;
                var output;
                var tempGlobal = null;
                if (tableState.search.predicateObject != null && tableState.search.predicateObject.$ != null) {
                    // Remove the global search filter so we can do exact match on the list first. - REDI 17Sep15
                    var tempGlobal = tableState.search.predicateObject.$;
                    delete tableState.search.predicateObject['$'];
                }

                if (customFilterName != "") {
                    if (tempGlobal != null) {
                        filter = $filter('filter');
                        filtered = filter(safeCopy, tempGlobal);
                        filter = $filter(customFilterName);
                        filtered = tableState.search.predicateObject ? filter(filtered, tableState.search.predicateObject, true) : filtered;
                        tableState.search.predicateObject.$ = tempGlobal;
                        alreadyFiltered = true;
                    }
                }

                if (!alreadyFiltered) {
                    filtered = tableState.search.predicateObject ? filter(safeCopy, tableState.search.predicateObject, true) : safeCopy;
                }

                if (customFilterName == "" && tempGlobal != null) {
                    // Now do the global filtering - REDI 17Sep15
                    filtered = filter(filtered, tempGlobal);
                    tableState.search.predicateObject.$ = tempGlobal;
                }

                if (tableState.sort.predicate) {
                    //filtered = orderBy(filtered, tableState.sort.predicate, tableState.sort.reverse);
                    //Modified By Ashok Tewatia for sorting                    
                    filtered.sort(function (obj, other) {
                        if (!isNotDefinedAndNotNull(obj[tableState.sort.predicate])) {
                            return 1;
                        } else if (!isNotDefinedAndNotNull(other[tableState.sort.predicate])) {
                            return -1;
                        } else if (!isNaN(obj[tableState.sort.predicate])) {
                            return obj[tableState.sort.predicate] - other[tableState.sort.predicate];
                        }
                        else {
                            if (obj[tableState.sort.predicate] > other[tableState.sort.predicate]) {
                                return 1;
                            } else if (obj[tableState.sort.predicate] < other[tableState.sort.predicate]) {
                                return -1;
                            }
                            return 0;
                        }
                    });
                    if (tableState.sort.reverse) {
                        filtered = filtered.reverse();
                    }
                }

                var fullFiltered = angular.copy(filtered); // This is the full filtered and sorted list (before spliting for paging purposes)
                pagination.totalItemCount = filtered.length;

                if (group.predicate !== undefined) {
                    filtered = groupByProperty(filtered, group.predicate);
                }

                if (pagination.number !== undefined) {
                    pagination.numberOfPages = filtered.length > 0 ? Math.ceil(filtered.length / pagination.number) : 1;
                    pagination.start = pagination.start >= filtered.length ? (pagination.numberOfPages - 1) * pagination.number : pagination.start;
                    output = filtered.slice(pagination.start, pagination.start + pagination.number);
                }
                displaySetter($scope, output || filtered);
                displayFilteredSetter($scope, fullFiltered);
                if ($attrs.stScrollId) {
                    $location.hash($attrs.stScrollId);
                    $anchorScroll();
                }
            };
            function isNotDefinedAndNotNull(passedParam) {
                return (typeof passedParam !== "undefined" && passedParam !== null);
            }
            /**
             * select a dataRow (it will add the attribute isSelected to the row object)
             * @param {Object} row - the row to select
             * @param {String} [mode] - "single" or "multiple" (multiple by default)
             */
            this.select = function select(row, mode) {
                var rows = safeCopy;
                var index = rows.indexOf(row);
                if (index !== -1) {
                    if (mode === 'single') {
                        row.isSelected = row.isSelected !== true;
                        if (lastSelected) {
                            lastSelected.isSelected = false;
                        }
                        lastSelected = row.isSelected === true ? row : undefined;
                    } else {
                        rows[index].isSelected = !rows[index].isSelected;
                    }
                }
            };

            /**
             * take a slice of the current sorted/filtered collection (pagination)
             *
             * @param {Number} start - start index of the slice
             * @param {Number} number - the number of item in the slice
             */
            this.slice = function splice(start, number) {
                tableState.pagination.start = start;
                tableState.pagination.number = number;
                return this.pipe();
            };

            /**
             * return the current state of the table
             * @returns {{sort: {}, search: {}, pagination: {start: number}}}
             */
            this.tableState = function getTableState() {
                return tableState;
            };

            /**
             * Use a different filter function than the angular FilterFilter
             * @param filterName the name under which the custom filter is registered
             */
            this.setFilterFunction = function setFilterFunction(filterName) {
                filter = $filter(filterName);
                customFilterName = filterName;
            };

            /**
             *User a different function than the angular orderBy
             * @param sortFunctionName the name under which the custom order function is registered
             */
            this.setSortFunction = function setSortFunction(sortFunctionName) {
                orderBy = $filter(sortFunctionName);
            };

            /**
             * Usually when the safe copy is updated the pipe function is called.
             * Calling this method will prevent it, which is something required when using a custom pipe function
             */
            this.preventPipeOnWatch = function preventPipe() {
                pipeAfterSafeCopy = false;
            };


            this.colFilter = function colFilter(colName, splitSubArray, dateFormat) {
                var filRows = [];
                if (colName.indexOf(".") > -1) {
                    var colObj = colName.split(".");
                    var obj = colObj[0];
                    var col = colObj[1];
                    //if column exist with in object of list
                    for (var ix = 0; ix < safeCopy.length; ix++) {
                        if (filRows.indexOf(safeCopy[ix][obj][col]) < 0 && safeCopy[ix][obj][col] != null && safeCopy[ix][obj][col] != '') {
                            if (splitSubArray == true && Object.prototype.toString.call(safeCopy[ix][obj][col]) === '[object Array]') {
                                for (var sb = 0; sb < safeCopy[ix][obj][col].length; sb++) {
                                    if (filRows.indexOf(safeCopy[ix][obj][col][sb]) < 0 && safeCopy[ix][obj][col][sb] != null && safeCopy[ix][obj][col][sb] != '') {
                                        filRows.push(safeCopy[ix][obj][col][sb]);
                                    }
                                }
                            }
                            else {
                                if ($.type(safeCopy[ix][obj][col]) == 'date') {
                                    safeCopy[ix][obj][col] = dateFormat ? moment(safeCopy[ix][obj][col]).format(dateFormat) : moment(safeCopy[ix][obj][col]).format('L');
                                }
                                filRows.push(safeCopy[ix][obj][col]);
                            }
                        }
                    }
                }
                else {
                    for (var ix = 0; ix < safeCopy.length; ix++) {
                        if (filRows.indexOf(safeCopy[ix][colName]) < 0 && safeCopy[ix][colName] != null && safeCopy[ix][colName] != '') {
                            if (splitSubArray == true && Object.prototype.toString.call(safeCopy[ix][colName]) === '[object Array]') {
                                for (var sb = 0; sb < safeCopy[ix][colName].length; sb++) {
                                    if (filRows.indexOf(safeCopy[ix][colName][sb]) < 0 && safeCopy[ix][colName][sb] != null && safeCopy[ix][colName][sb] != '') {
                                        if ($.type(safeCopy[ix][colName]) == 'date') {
                                            safeCopy[ix][colName][sb] = dateFormat ? moment(safeCopy[ix][colName][sb]).format(dateFormat) : moment(safeCopy[ix][colName][sb]).format('L');
                                        }
                                        filRows.push(safeCopy[ix][colName][sb]);
                                    }
                                }
                            } else {
                                if ($.type(safeCopy[ix][colName]) == 'date') {
                                    safeCopy[ix][colName] = dateFormat ? moment(safeCopy[ix][colName]).format(dateFormat) : moment(safeCopy[ix][colName]).format('L');
                                }
                                filRows.push(safeCopy[ix][colName]);
                                //boolean datatype support
                                if (($.type(safeCopy[ix][colName]) == 'boolean') && (filRows.length < 2)) {
                                    if (filRows[0]) {
                                        filRows.push(false);
                                    } else {
                                        filRows.push(true);
                                    }
                                }
                            }// added blank option in filter dropdown.
                        } else if (filRows.indexOf(safeCopy[ix][colName]) < 0 && safeCopy[ix][colName] == null) {
                            if (filRows.indexOf("Null") < 0) {
                                filRows.push("Null");
                            }
                        } else if (filRows.indexOf(safeCopy[ix][colName]) < 0 && safeCopy[ix][colName] == '') {
                            if ($.type(safeCopy[ix][colName]) == "number") {
                                if (safeCopy[ix][colName] == null && filRows.indexOf("Null") < 0) {
                                    filRows.push("Null");
                                } else if (safeCopy[ix][colName] == 0 && filRows.indexOf("0") < 0) {
                                    filRows.push("0");
                                }
                            } else {
                                if (filRows.indexOf("Blank") < 0) {
                                    filRows.push("Blank");
                                }
                            }
                        }
                    }
                }
                return filRows;
            };
            this.safeCopy = function () {
                return safeCopy;
            };
        }])
        .directive('stTable', function () {
            return {
                restrict: 'A',
                controller: 'stTableController',
                link: function (scope, element, attr, ctrl) {

                    if (attr.stSetFilter) {
                        ctrl.setFilterFunction(attr.stSetFilter);
                    }

                    if (attr.stSetSort) {
                        ctrl.setSortFunction(attr.stSetSort);
                    }

                    // Custom Attribute to Allow Global Searching - Added REDI 28Feb2015
                    if (attr.stGlobalSearch) {
                        scope.$watch(attr.stGlobalSearch, function (newValue, oldValue) {
                            if (newValue !== oldValue) {
                                ctrl.search(newValue, null);
                                ctrl.tableState().search;
                            }
                        });
                    }
                }
            };
        });

    ng.module('smart-table')
        .directive('stSearch', ['$timeout', '$parse', function ($timeout, $parse) {
            return {
                controller: 'stTableController',
                require: '^stTable',
                restrict: 'A',
                priority: -1,
                link: function (scope, element, attr, ctrl) {
                    var tableCtrl = ctrl;
                    var promise = null;
                    var throttle = attr.stDelay || 400;

                    attr.$observe('stSearch', function (newValue, oldValue) {
                        var input = element[0].value;
                        if (newValue !== oldValue && input) {
                            ctrl.tableState().search = {};
                            tableCtrl.search(input, newValue);
                        }
                    });

                    //table state -> view
                    scope.$watch(function () {
                        return ctrl.tableState().search;
                    }, function (newValue, oldValue) {
                        var predicateExpression = attr.stSearch || '$';
                        predicateExpression = predicateExpression.replace("'", "").replace("'", "");
                        if (newValue.predicateObject && $parse(predicateExpression)(newValue.predicateObject) !== element[0].value) {
                            //element[0].value = $parse(predicateExpression)(newValue.predicateObject) || '';
                            var wkVal = $parse(predicateExpression)(newValue.predicateObject);
                            if (element.prop('tagName') == 'SELECT' && wkVal != undefined && wkVal != "") {
                                wkVal = "string:" + wkVal;
                            }
                            element[0].value = wkVal || '';
                        }
                    }, true);

                    /*scope.$watch(function () {
                        return ctrl.tableState().search;
                    }, function (newValue, oldValue) {
                        var predicateExpression = scope.predicate || '$';
                        if (newValue.predicateObject && newValue.predicateObject[predicateExpression] !== element[0].value) {
                            element[0].value = newValue.predicateObject[predicateExpression] || '';
                        }
                    }, true);*/

                    // view -> table state
                    if (element.prop('tagName') == 'SELECT') {
                        element.bind('change', function (evt) {
                            elementChanged(evt);
                        });
                    }
                    else {
                        element.bind('input', function (evt) {
                            elementChanged(evt);
                        });
                    }

                    function elementChanged(evt) {
                        evt = evt.originalEvent || evt;
                        if (promise !== null) {
                            $timeout.cancel(promise);
                        }
                        promise = $timeout(function () {
                            var field = "";
                            if (attr.stSearch != null) {
                                field = attr.stSearch.replace("'", "").replace("'", "");
                            }
                            if (evt.target.type == "select-one") {
                                var selectedOption = evt.target.options[evt.target.selectedIndex].text
                                tableCtrl.search(selectedOption, field || '');
                            }
                            else {
                                tableCtrl.search(evt.target.value, field || '');
                            }
                            promise = null;
                        }, throttle);
                    }
                }
            };
        }]);

    ng.module('smart-table')
        .directive('stSelectRow', function () {
            return {
                restrict: 'A',
                require: '^stTable',
                scope: {
                    row: '=stSelectRow'
                },
                link: function (scope, element, attr, ctrl) {
                    var mode = attr.stSelectMode || 'single';
                    element.bind('click', function () {
                        scope.$apply(function () {
                            ctrl.select(scope.row, mode);
                        });
                    });

                    scope.$watch('row.isSelected', function (newValue, oldValue) {
                        if (newValue === true) {
                            // element.addClass('st-selected');
                            element.addClass('multiselect');
                        } else {
                            //  element.removeClass('st-selected');
                            element.removeClass('multiselect');
                        }
                    });
                }
            };
        });

    ng.module('smart-table')
        .directive('stSort', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                require: '^stTable',
                link: function (scope, element, attr, ctrl) {

                    var predicate = attr.stSort;
                    var getter = $parse(predicate);
                    var index = 0;
                    var classAscent = attr.stClassAscent || 'st-sort-ascent';
                    var classDescent = attr.stClassDescent || 'st-sort-descent';
                    var stateClasses = [classAscent, classDescent];
                    var sortDefault;
                    var skipNatural = attr.stSkipNatural !== undefined ? attr.stSkipNatural : false;

                    if (attr.stSortDefault) {
                        sortDefault = scope.$eval(attr.stSortDefault) !== undefined ? scope.$eval(attr.stSortDefault) : attr.stSortDefault;
                    }


                    //view --> table state
                    function sort() {
                        index++;
                        predicate = ng.isFunction(getter(scope)) ? getter(scope) : attr.stSort;
                        if (index % 3 === 0 && !!skipNatural !== true) {
                            //manual reset
                            index = 0;
                            ctrl.tableState().sort = {};
                            ctrl.tableState().pagination.start = 0;
                            ctrl.pipe();
                        } else {
                            ctrl.sortBy(predicate, index % 2 === 0);
                        }
                    }

                    if (ng.isFunction(getter(scope))) {
                        predicate = getter(scope);
                    }

                    element.bind('click', function sortClick() {
                        if (predicate) {
                            scope.$apply(sort);
                        }
                    });

                    if (sortDefault) {
                        index = sortDefault === 'reverse' ? 1 : 0;
                        sort();
                    }

                    //table state --> view
                    scope.$watch(function () {
                        return ctrl.tableState().sort;
                    }, function (newValue) {
                        if (newValue.predicate !== predicate) {
                            index = 0;
                            element
                                .removeClass(classAscent)
                                .removeClass(classDescent);
                        } else {
                            index = newValue.reverse === true ? 2 : 1;
                            element
                                .removeClass(stateClasses[index % 2])
                                .addClass(stateClasses[index - 1]);
                        }
                    }, true);
                }
            };
        }]);

    ng.module('smart-table')
        .directive('stPagination', function () {
            return {
                restrict: 'EA',
                require: '^stTable',
                scope: {
                    stItemsByPage: '=?',
                    stDisplayedPages: '=?'
                },
                templateUrl: 'template/smart-table/pagination.html',
                link: function (scope, element, attrs, ctrl) {

                    scope.stItemsByPage = scope.stItemsByPage ? +(scope.stItemsByPage) : 10;
                    scope.stDisplayedPages = scope.stDisplayedPages ? +(scope.stDisplayedPages) : 5;

                    scope.currentPage = 1;
                    scope.pages = [];

                    function redraw() {
                        var paginationState = ctrl.tableState().pagination;
                        var start = 1;
                        var end;
                        var i;
                        scope.currentPage = Math.floor(paginationState.start / paginationState.number) + 1;

                        start = Math.max(start, scope.currentPage - Math.abs(Math.floor(scope.stDisplayedPages / 2)));
                        end = start + scope.stDisplayedPages;

                        if (end > paginationState.numberOfPages) {
                            end = paginationState.numberOfPages + 1;
                            start = Math.max(1, end - scope.stDisplayedPages);
                        }

                        scope.pages = [];
                        scope.numPages = paginationState.numberOfPages;

                        for (i = start; i < end; i++) {
                            scope.pages.push(i);
                        }
                    }

                    //table state --> view
                    scope.$watch(function () {
                        return ctrl.tableState().pagination;
                    }, redraw, true);

                    //scope --> table state  (--> view)
                    scope.$watch('stItemsByPage', function () {
                        scope.selectPage(1);
                    });

                    scope.$watch('stDisplayedPages', redraw);

                    //view -> table state
                    scope.selectPage = function (page) {
                        if (page > 0 && page <= scope.numPages) {
                            ctrl.slice((page - 1) * scope.stItemsByPage, scope.stItemsByPage);
                        }
                    };

                    //select the first page
                    ctrl.slice(0, scope.stItemsByPage);
                }
            };
        });

    ng.module('smart-table')
        .directive('stPipe', function () {
            return {
                require: 'stTable',
                scope: {
                    stPipe: '='
                },
                link: {
                    pre: function (scope, element, attrs, ctrl) {

                        if (ng.isFunction(scope.stPipe)) {
                            ctrl.preventPipeOnWatch();
                            ctrl.pipe = function () {
                                scope.stPipe(ctrl.tableState(), ctrl);
                            }
                        }
                    }
                }
            };
        });

    ng.module('smart-table')
        .directive('stPersist', function () {
            return {
                require: '^stTable',
                link: function (scope, element, attr, ctrl) {
                    var nameSpace = attr.stPersist;

                    //save the table state every time it changes
                    scope.$watch(function () {
                        return ctrl.tableState();
                    }, function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            localStorage.setItem(nameSpace, JSON.stringify(newValue));
                        }
                    }, true);

                    //fetch the table state when the directive is loaded
                    if (localStorage.getItem(nameSpace)) {
                        var savedState = JSON.parse(localStorage.getItem(nameSpace));
                        var tableState = ctrl.tableState();

                        angular.extend(tableState, savedState);
                        ctrl.pipe();

                    }

                }
            };
        });

    /*  Description         : Added boolean datatype support, boolean column will show true, false options in drop down.
************************************************************************************************
    Author Name         : Ashok Tewatia
    Modified Date       : Sept 28, 2016
***********************************************************************************************/
    ng.module('smart-table')
        .directive('stColFilter', ['$parse', '$compile', '$timeout', '$interval', function ($parse, $compile, $timeout, $interval) {
            return {
                priority: 1001, // compiles first
                terminal: true, // prevent lower priority directives to compile after it
                restrict: 'A',
                require: '^stTable',
                compile: function (element, attrs) {
                    element.attr("ng-options", "rec as rec for rec in filterList['" + attrs.stColFilter + "']");
                    element.attr("ng-model", "filterValues." + attrs.stColFilter);
                    element.attr("ng-class", "{bgyellow: (filterValues." + attrs.stColFilter + " != null && filterValues." + attrs.stColFilter + " != '' )? true:false }"); // Change background colour if column filters has value
                    element.removeAttr('st-col-filter'); // necessary to avoid infinite compile loop      
                    var fn = $compile(element);
                    return function (scope, ielement, iattrs, ctrl) {
                        if (scope.filterList == undefined) {
                            scope.filterList = {};
                            scope.filterValues = {};
                        }

                        scope.filterList[iattrs.stColFilter] = [];
                        fn(scope);
                        var predicate = iattrs.stColFilter;
                        var dateFormat = iattrs.stDateFormat;
                        scope.filterValues[predicate] = "";
                        var stColSplitSubArray = iattrs.stColSplitSubArray == "true";

                        $timeout(function () {
                            if (ctrl.tableState().search.predicateObject != undefined) {
                                var testFil = ctrl.tableState().search.predicateObject[predicate];
                                if (testFil != undefined) {
                                    scope.filterList[predicate].push(testFil);
                                    scope.filterValues[predicate] = testFil;
                                }
                            }
                        }, 100);

                        var stopTime1 = $interval(function () {
                            if (ctrl.tableState().search.predicateObject != undefined) {
                                var testFil = ctrl.tableState().search.predicateObject[predicate];
                                if (testFil != undefined) {
                                    scope.filterList[predicate] = ctrl.colFilter(predicate, stColSplitSubArray, dateFormat);
                                    var filteredValReturn = scope.filterList[predicate].filter(function (filteredVal) {
                                        filteredVal = filteredVal.toString();
                                        testFil = testFil.toString();
                                        return (filteredVal.trim() === testFil.trim());
                                    });
                                    if (filteredValReturn.length === 0 && scope.filterValues[predicate] != "Blank") {
                                        scope.filterValues[predicate] = '';
                                        ctrl.search(scope.filterValues[predicate], predicate);
                                    }
                                }
                            }
                        }, 1500);
                        // listen on DOM destroy (removal) event, and cancel the next UI update
                        // to prevent updating time after the DOM element was removed.
                        element.on('$destroy', function () {
                            $interval.cancel(stopTime1);
                        });
                        //element.bind('focus', function getFilterList() {
                        //    if (predicate) {
                        //        scope.filterList[predicate] = ctrl.colFilter(predicate, stColSplitSubArray, dateFormat);
                        //        sortValues(scope.filterList[predicate]);
                        //        setBlankNullAndZeroOnTop(scope.filterList[predicate]);
                        //        scope.$apply();
                        //    }
                        //});
                        element.bind('mousedown', function getFilterList() {
                            if (predicate) {
                                scope.filterList[predicate] = ctrl.colFilter(predicate, stColSplitSubArray, dateFormat);
                                sortValues(scope.filterList[predicate]);
                                setBlankNullAndZeroOnTop(scope.filterList[predicate]);
                                scope.$apply();
                            }
                        });
                        element.bind('change', function getFilterList() {
                            $timeout(function () {
                                var selectedOption = element[0].options[element[0].selectedIndex].text;
                                //boolean datatype support
                                if (iattrs.stDataType != undefined && selectedOption != "" && (iattrs.stDataType.toLowerCase() == "boolean")) {
                                    selectedOption = JSON.parse(selectedOption);
                                }
                                if (iattrs.stDataType != undefined && selectedOption != "" && (iattrs.stDataType.toLowerCase() == "integar" || iattrs.stDataType.toLowerCase() == "int" || iattrs.stDataType.toLowerCase() == "number")) {
                                    if (selectedOption != "Null" && selectedOption != "Blank" && selectedOption != "0") {
                                        selectedOption = JSON.parse(selectedOption);
                                    }
                                }
                                if (ctrl.tableState().search.predicateObject != undefined) {
                                    /*var testFil = ctrl.tableState().search.predicateObject[predicate];
                                    if (testFil != undefined) {
                                        scope.filterList[predicate].push(testFil);
                                        scope.filterValues[predicate] = testFil;
                                    }*/
                                    ctrl.search(selectedOption, predicate);
                                }
                                else {
                                    ctrl.search(selectedOption, predicate);
                                }
                            }, 500);
                        });
                        function sortValues(valuesArray) {
                            valuesArray.sort(function (obj, other) {
                                if (moment(obj, "DD/MM/YYYY", true).isValid() && moment(other, "DD/MM/YYYY", true).isValid()) {

                                    //Swap month and day numbers around so the sort can work properly
                                    obj = obj.substr(3, 2) + "/" + obj.substr(0, 2) + "/" + obj.substr(6, 4);
                                    other = other.substr(3, 2) + "/" + other.substr(0, 2) + "/" + other.substr(6, 4);

                                    return new Date(obj) - new Date(other);
                                }
                                else {
                                    if (typeof obj == "string" && typeof other == "string") {
                                        obj = obj.toLowerCase();
                                        other = other.toLowerCase();
                                    }
                                    if (obj > other) {
                                        return 1;
                                    } else if (obj < other) {
                                        return -1;
                                    }
                                }

                                return 0;
                            });
                        }

                        // function added to keep blank option in filter dropdown on top.
                        function setBlankNullAndZeroOnTop(arr) {

                            var zeroIndex = scope.filterList[predicate].indexOf("0");
                            if (zeroIndex > -1) {
                                arr.splice(zeroIndex, 1);
                                arr.unshift("0");
                            }
                            var nullIndex = scope.filterList[predicate].indexOf("Null");
                            if (nullIndex > -1) {
                                arr.splice(nullIndex, 1);
                                arr.unshift("Null");
                            }
                            var blankIndex = scope.filterList[predicate].indexOf("Blank");
                            if (blankIndex > -1) {
                                arr.splice(blankIndex, 1);
                                arr.unshift("Blank");
                            }
                            return arr;
                        }

                    };
                }
            };
        }]);

    ng.module('smart-table')
          .directive('stGroup', ['$parse', function ($parse) {
              return {
                  restrict: 'A',
                  require: '^stTable',
                  link: function (scope, element, attr, ctrl) {
                      var predicate = attr.stGroup;

                      //view --> table state
                      function group() {
                          ctrl.groupBy(predicate);
                      }

                      if (predicate) {
                          group();
                      }
                  }
              };
          }]);

    ng.module('smart-table')
        .directive('csSelect', function () {
            return {
                require: '^stTable',
                template: '',
                scope: {
                    row: '=csSelect'
                },
                link: function (scope, element, attr, ctrl) {

                    element.bind('change', function (evt) {
                        scope.$apply(function () {
                            ctrl.select(scope.row, 'multiple');
                        });
                    });

                    scope.$watch('row.isSelected', function (newValue, oldValue) {
                        if (newValue === true) {
                            element.parent().addClass('st-selected');
                        } else {
                            element.parent().removeClass('st-selected');
                        }
                    });
                }
            };
        });

    ng.module('smart-table')
        /*  Description         : multiple selection filter dropdown using checkbox
        ************************************************************************************************
            Author Name         : Ashok Tewatia New
            Created Date        : Aug 10, 2015
            Modified Date       : Aug 14, 2015
        ***********************************************************************************************/
        .directive('colFilterMultiple', [function () {
            var template = '<div class="dropdown dropdownexpand">' +
                                '<div style="width:100%;margin: 0px !important;" class="btn btn-default dropdown-toggle txt-lft" ng-class="{bgyellow: dropdownLabel != ' + "'Select'" + '}" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' +
                                    '{{dropdownLabel}}' +
                                    '<span class="caret"></span>' +
                                '</div>' +
                                '<div class="dropdown-menu dropdown-home">' +
                                    '<div class="field-area">' +
                                        '<ul  aria-labelledby="dropdownMenu1" class="nopadding">' +
                                            '<li ng-show="IsSelected"><a style="padding: 5px 0px 5px 0px !important;" data-ng-click="unCheckAll()"><i class="fa fa-remove"></i>  Clear All</a>' +
                                            '<li ng-repeat="item in distinctItems">' +
                                                '<label>' +
                                                    '<input type="checkbox" ng-model="item.selected" class="multiple-select" ng-click="keepDropDownOpen($event)">' +
                                                    '{{item.value}}' +
                                                '</label>' +
                                            '</li>' +
                                        '</ul>' +
                                    '</div>' +
                                    '<div class="action-area">' +
                                        '<button class="btn btn-primary btn-ok btn-xs" ng-click="filterChanged()">Ok</button>' +
                                        '<button class="btn btn-default btn-cancel btn-xs">Cancel</button>' +
                                    '</div>'
            '</div>' +
        '</div>';

            return {
                restrict: 'E',
                controller: 'stTableController',
                require: '^stTable',
                scope: {
                    collection: '=',
                    predicate: '@',
                    cPersist: '@',
                    dateFormat: '@'
                },
                template: template,
                link: function (scope, element, attr, table) {
                    scope.dropdownLabel = '';
                    scope.IsSelected = false;
                    scope.filterChanged = filterChanged;
                    var nameSpace = scope.cPersist;

                    scope.keepDropDownOpen = function ($event) {
                        var parent = angular.element($event.target).parents(".dropdown");
                        if (!parent.hasClass("open"))
                            parent.addClass("open");
                        $event.stopPropagation();
                    }
                    scope.unCheckAll = function () {
                        angular.forEach(scope.distinctItems, function (item) {
                            item.selected = false;
                        });
                        filterChanged();
                    };

                    scope.$watch('collection', function (newValue, oldValue) {
                        if (newValue != oldValue) {
                            scope.collection = newValue;
                            initialize();
                        }
                        else {
                            initialize();
                        }
                    });
                    function initialize() {
                        angular.forEach(scope.collection, function (item) {
                            if ($.type(item[scope.predicate]) == 'date') {
                                item[scope.predicate] = scope.dateFormat ? moment(item[scope.predicate]).format(scope.dateFormat) : moment(item[scope.predicate]).format('L');
                            }
                        });
                        bindCollection(scope.collection);
                    }

                    function getPredicate() {
                        var predicate = scope.predicate;
                        if (!predicate && scope.predicateExpression) {
                            predicate = scope.predicateExpression;
                        }
                        return predicate;
                    }

                    function getDropdownLabel() {
                        if (scope.distinctItems == null) {
                            scope.IsSelected = false;
                            return 'Select';
                        }
                        var allCount = scope.distinctItems.length;

                        var selected = getSelectedOptions();

                        if (selected != null && allCount === selected.length && selected.length > 0) {
                            scope.IsSelected = true;
                            return 'All';
                        }

                        if (selected == null || selected.length === 0) {
                            scope.IsSelected = false;
                            return 'Select';
                        }

                        if (selected.length === 1) {
                            scope.IsSelected = true;
                            return selected[0];
                        }
                        scope.IsSelected = true;
                        return selected.length + ' items';
                    }

                    function getSelectedOptions() {
                        var selectedOptions = [];

                        angular.forEach(scope.distinctItems, function (item) {
                            if (item.selected) {
                                selectedOptions.push(item.value);
                            }
                        });

                        return selectedOptions;
                    }

                    function setBlankNullAndZeroOnTop(arr) {
                        var zeroObject = undefined;
                        var blankObject = undefined;
                        var nullObject = undefined;
                        angular.forEach(arr, function (item, key) {
                            if (item.value == "0") {
                                zeroObject = item;
                                arr.splice(key, 1);
                            }
                        });
                        angular.forEach(arr, function (item, key) {
                            if (item.value == "Null") {
                                nullObject = item;
                                arr.splice(key, 1);
                            }
                        });
                        angular.forEach(arr, function (item, key) {
                            if (item.value == "Blank") {
                                blankObject = item;
                                arr.splice(key, 1);
                            }
                        });

                        if (zeroObject != undefined) {
                            arr.unshift(zeroObject);
                        }
                        if (nullObject != undefined) {
                            arr.unshift(nullObject);
                        }
                        if (blankObject != undefined) {
                            arr.unshift(blankObject);
                        }
                    }
                    function bindCollection(collection) {
                        if (collection && collection.length > 0) {
                            var predicate = getPredicate();
                            var distinctItems = [];

                            angular.forEach(collection, function (item) {
                                var value = item[predicate];
                                fillDistinctItems(value, distinctItems);
                            });

                            distinctItems.sort(function (obj, other) {
                                if (!isNaN(obj.value)) {
                                    return obj.value - other.value;
                                }
                                else {
                                    if (obj.value > other.value) {
                                        return 1;
                                    } else if (obj.value < other.value) {
                                        return -1;
                                    }
                                    return 0;
                                }
                            });
                            setBlankNullAndZeroOnTop(distinctItems);
                            var localStorageData = localStorage[nameSpace];
                            var localCollection = [];
                            if (localStorageData != undefined) {
                                var localStorageDataObject = JSON.parse(localStorageData);
                                if (JSON.parse(localStorage[nameSpace]).search.predicateObject) {
                                    var predicateObject = JSON.parse(localStorage[nameSpace]).search.predicateObject;
                                    if (predicateObject != null && predicateObject[predicate] != null && predicateObject[predicate].matchAny != null) {
                                        localCollection = predicateObject[predicate].matchAny.items;
                                    }
                                    if (localCollection.length > 0) {
                                        angular.forEach(distinctItems, function (item) {
                                            var result = findItems(localCollection, item);
                                            if (result) {
                                                item.selected = true;
                                            } else {
                                                item.selected = false;
                                            }
                                        });
                                        scope.distinctItems = distinctItems;
                                        filterChanged();
                                    } else {
                                        scope.distinctItems = distinctItems;
                                        filterChanged();
                                    }

                                } else {
                                    scope.distinctItems = distinctItems;
                                    filterChanged();
                                }
                            } else {
                                scope.distinctItems = distinctItems;
                                filterChanged();
                            }
                        }
                    }

                    function filterChanged() {
                        scope.dropdownLabel = getDropdownLabel();

                        var predicate = getPredicate();

                        var query = {
                            matchAny: {}
                        };

                        query.matchAny.items = getSelectedOptions();
                        var numberOfItems = query.matchAny.items.length;
                        if (numberOfItems === 0 || numberOfItems === scope.distinctItems.length) {
                            query.matchAny.all = true;
                        } else {
                            query.matchAny.all = false;
                        }

                        table.search(query, predicate);
                    }

                    function fillDistinctItems(value, distinctItems) {
                        if ($.type(value) == "number") {
                            if (value == null) {
                                value = "Null";
                            } else if (value == 0) {
                                value = "0";
                            }
                        } else if ($.type(value) == "boolean") {
                            if (value) {
                                value = "Y"; // this is for true.
                            } else {
                                value = "N";
                            }
                        }
                        else {
                            if (value == null) {
                                value = "Null";
                            } else if (value == "") {
                                value = "Blank";
                            }
                        }

                        if (value && !findItemWithValue(distinctItems, value)) {
                            distinctItems.push({
                                value: value,
                                selected: false
                            });
                        }
                    }

                    function findItemWithValue(collection, value) {
                        var found = _.find(collection, function (item) {
                            return item.value === value;
                        });
                        return found;
                    }
                    function findItems(collection, value) {
                        var found = _.find(collection, function (item) {
                            return item === value.value;
                        });

                        return found;
                    }
                }
            }
        }])

        /*  Description         : custom filter for dropdown using checkbox
        ************************************************************************************************
            Author Name         : Ashok Tewatia New
            Created Date        : Aug 10, 2015
            Modified Date       : Aug 14, 2015
        ***********************************************************************************************/
        .filter('customFilter', ['$filter', function ($filter) {
            var filterFilter = $filter('filter');
            var standardComparator = function standardComparator(obj, text) {
                text = ('' + text).toLowerCase();
                return ('' + obj).toLowerCase() == text;
            };
            return function customFilter(array, expression) {
                function customComparator(actual, expected) {
                    var isBeforeActivated = expected == null ? null : expected.before;
                    var isAfterActivated = expected == null ? null : expected.after;
                    var isLower = expected == null ? null : expected.lower;
                    var isHigher = expected == null ? null : expected.higher;
                    var higherLimit;
                    var lowerLimit;
                    var itemDate;
                    var queryDate;

                    if (ng.isObject(expected)) {
                        //exact match
                        if (expected.distinct) {
                            if (!actual || actual.toLowerCase() !== expected.distinct.toLowerCase()) {
                                return false;
                            }
                            return true;
                        }

                        //matchAny
                        if (expected.matchAny) {
                            if (expected.matchAny.all) {
                                return true;
                            }

                            if (!actual) {
                                return false;
                            }

                            if (expected.matchAny.items != null) {
                                for (var i = 0; i < expected.matchAny.items.length; i++) {
                                    if (actual === expected.matchAny.items[i]) {
                                        return true;
                                    }
                                }
                            }

                            return false;
                        }

                        //date range
                        if (expected.before || expected.after) {
                            try {
                                if (isBeforeActivated) {
                                    higherLimit = expected.before;

                                    itemDate = new Date(actual);
                                    queryDate = new Date(higherLimit);

                                    if (itemDate > queryDate) {
                                        return false;
                                    }
                                }

                                if (isAfterActivated) {
                                    lowerLimit = expected.after;


                                    itemDate = new Date(actual);
                                    queryDate = new Date(lowerLimit);

                                    if (itemDate < queryDate) {
                                        return false;
                                    }
                                }

                                return true;
                            } catch (e) {
                                return false;
                            }

                        }
                        else if (isLower || isHigher) {
                            //number range
                            if (isLower) {
                                higherLimit = expected.lower;

                                if (actual > higherLimit) {
                                    return false;
                                }
                            }

                            if (isHigher) {
                                lowerLimit = expected.higher;
                                if (actual < lowerLimit) {
                                    return false;
                                }
                            }

                            return true;
                        }
                        //etc

                        return true;

                    }
                    return standardComparator(actual, expected);
                }
                var output = filterFilter(array, expression, customComparator);
                return output;
            };
        }]);

    ng.module('smart-table')
        /*  Description         : strict filter
        ************************************************************************************************
            Author Name         : Ashok Tewatia New
            Created Date        : Sep 10, 2015
            Modified Date       : Sep 15, 2015
        ***********************************************************************************************/
        .filter('strictFilter', function ($filter) {
            var filterFilter = $filter('filter');
            return function strictFilter(input, predicate) {
                var output = filterFilter(input, predicate, !('$' in predicate));
                return output;
            }
        });

})(angular);