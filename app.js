var app = angular.module('testJS', []);

app.controller('testJSCtrl', function ($scope, $http, $filter, $interval, $q) {
    var delay = 60000;
    $scope.checkedItemIdList = [];
    $scope.isAllChecked = false;

    $http.get('data/items.json').then(function (itemCollection) {
        $scope.itemCollection = itemCollection.data;
    });

    $scope.onAllCheckClicked = function () {
        $scope.checkedItemIdList = [];
        angular.forEach($scope.itemCollection, function (item) {
            item.isChecked = $scope.isAllChecked;
            $scope.isAllChecked && $scope.checkedItemIdList.push(item.id);
        });
    };

    $scope.onCheckboxChanged = function () {
        $scope.checkedItemIdList = [];

        angular.forEach($scope.itemCollection, function (item) {
            if (item.isChecked) $scope.checkedItemIdList.push(item.id);
        });

        $scope.isAllChecked = $scope.checkedItemIdList.length === $scope.itemCollection.length;
    };

    $scope.onRefreshClicked = function (id) {
        var idListToRefresh = id ? [id] : $scope.checkedItemIdList;

        angular.forEach(idListToRefresh, function (id) {
            var item = getItemById(id),
                stop;

            if (item.isLoading) return;
            item.isLoading = true;
            item.percent = 0;

            //Request-response behaviour emulation:
            //Request should be sent every 15 seconds, response would contain status and percentage of readiness.
            //Then status become true, loader hides and new data set.
            //As far as every media kit is refreshed, it model data are replaced with refreshed one.
            stop = $interval(function () {
                item.percent += Math.round(Math.random() * 10);
                if (item.percent >= 100) {
                    $interval.cancel(stop);
                    item.isLoading = false;
                    item.lastRefresh = new Date();
                }
            }, 1500);
        });
    };

    //This is to update refreshed time according current time;
    $interval(function () {
        //Safe apply.
        ($scope.$$phase || $scope.$root.$$phase) ? function () {} : $scope.$apply(fn);
    }, delay);

    function getItemById(id) {
        return $filter('filter')($scope.itemCollection, function (item) {
            return item.id === id;
        })[0];
    }
});

app.directive('row', function () {
    return {
        templateUrl: 'templates/row.html',
        controller: function ($scope) {
            $scope.item.isLoading = false;
            $scope.item.isChecked = false;
            $scope.item.percent = 0;
            $scope.isEmpty = false;
            $scope.targetGroups = '';
            $scope.mediasNames = '';

            angular.forEach($scope.item.medias, function (media) {
                $scope.mediasName
                    ? $scope.mediasNames = $scope.mediasNames.concat(', ', media.name)
                    : $scope.mediasNames = media.name;
            });

            angular.forEach($scope.item.targetGroup, function (group) {
                $scope.targetGroups += ($scope.targetGroups ? ', ' : '') + group.split(' - ')[0];
            }, this);

            $scope.isEmpty = !$scope.targetGroups;
            if (!$scope.targetGroups) {
                $scope.targetGroups = 'None';
            }
        }
    };
});

app.directive('dropDown', function () {
    return {
        templateUrl: 'templates/drop-down.html'
    };
});

app.filter('dateFormat', function ($filter) {
    return function (milliseconds) {
        var date = new Date(milliseconds),
            minuteMillisec = 60,
            hourMillisec = 3600,
            dayMillisec = 86400,
            minute = hourMillisec && Math.round(diffSeconds / minuteMillisec),
            hour = dayMillisec && Math.round(diffSeconds / minuteMillisec),
            day = 7 && diffDays,
            week = 31 && Math.ceil(diffDays / 7),
            diffSeconds = (((new Date()).getTime() - date.getTime()) / 1000),
            diffDays = Math.round(diffSeconds / dayMillisec);

        return diffSeconds < minuteMillisec && 'just now' ||
            diffSeconds < minute + ' minute(s) ago' ||
            diffSeconds < hour + ' hour(s) ago' ||
            diffDays == 1 && 'Yesterday' ||
            diffDays < day + ' day(s) ago' ||
            diffDays < week + ' week(s) ago' ||
            $filter('date')(date);
    };
});
