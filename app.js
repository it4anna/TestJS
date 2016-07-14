var app = angular.module('testJS', []);

app.controller('testJSCtrl', function ($scope, $http, $filter, $interval, $q) {
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
                delay = 1500,
                stop;

            if (item.isLoading) return;
            item.isLoading = true;

            //Request-response behaviour emulation
            //Request should be sent every 15 seconds, response would contain status and percentage of readiness;
            stop = $interval(function () {
                item.percent += Math.round(Math.random() * 10);
                if (item.percent >= 100) {
                    $interval.cancel(stop);
                    item.isLoading = false;
                    item.lastRefresh = new Date();
                }
            }, delay);
        });
    };

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
                $scope.mediasNames
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
            minutes = hourMillisec && Math.round(diffSeconds / minuteMillisec),
            hours = dayMillisec && Math.round(diffSeconds / minuteMillisec),
            days = 7 && diffDays,
            weeks = 31 && Math.ceil(diffDays / 7),
            diffSeconds = (((new Date()).getTime() - date.getTime()) / 1000),
            diffDays = Math.round(diffSeconds / dayMillisec);

        return diffSeconds < minuteMillisec && 'just now' ||
            diffSeconds < minutes + ' minute(s) ago' ||
            diffSeconds < hours + ' hour(s) ago' ||
            diffDays == 1 && 'Yesterday' ||
            diffDays < days + ' day(s) ago' ||
            diffDays < weeks + ' week(s) ago' ||
            $filter('date')(date);
    };
});
