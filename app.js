var BEmock = [
    {
        id: 1,
        name: "Home decor fans",
        medias: [
            {id: "m1", name: "Isabelas.dk"},
            {id: "m2", name: "Tidenskvinder.dk"},
            {id: "m3", name: "elle.dk"},
            {id: "m4", name: "femina.dk"}
        ],
        targetGroup: ["Gender - female", "Age - any"],
        lastRefresh: 1468106075831,
        reach: 0.4,
        pagesPerUser: 5
    },
    {
        id: 2,
        name: "Likes cooking",
        medias: [
            {id: "m5", name: "Slankeklubben.dk"},
            {id: "m6", name: "Spisbedre.dk"},
            {id: "m7", name: "Madogbolig.dk"}
        ],
        targetGroup: [],
        lastRefresh: 1458889075831,
        reach: 0.2,
        pagesPerUser: 3.123123
    },
    {
        id: 3,
        name: "Young women",
        medias: [
            {id: "m4", name: "femina.dk"},
            {id: "m8", name: "viunge.dk"}
        ],
        targetGroup: ["Gender - women", "Age - young"],
        lastRefresh: 1468105050831,
        reach: 0.05,
        pagesPerUser: 8
    }
];

var app = angular.module("testJS", []);

app.controller('testJSCtrl', function ($scope) {
    $scope.itemCollection = BEmock;
    $scope.isAllChecked = false;

    $scope.allCheckedClicked = function () {
        angular.forEach($scope.itemCollection, function (item) {
            item.isChecked = $scope.isAllChecked;
        });
    };

    $scope.onCheckBoxChanged = function () {
        $scope.isAllChecked = $scope.itemCollection.every(function (item) {
            return item.isChecked;
        });
    };
});

app.directive("row", function () {
    return {
        template: '<td><input type="checkbox" data-ng-model="item.isChecked" data-ng-change="onCheckBoxChanged()"></td> \
        <td>{{item.name}}</td> \
        <td>{{mediasNames}}</td> \
        <td data-ng-class="{empty: isEmpty}">{{targetGroups}}</td> \
        <td>{{item.lastRefresh | dateFormat}}</td> \
        <td>{{item.reach * 100}}%</td> \
        <td> \
        <div class="inline-block pages">{{item.pagesPerUser}}</div> \
        <div data-ng-include="\'drop_down.html\'" class="inline-block pull-right"></div> \
        </td>',
        controllerAs: 'rowCtrl',
        controller: function ($scope) {
            $scope.item.isChecked = false;
            $scope.isEmpty = false;
            $scope.targetGroups = '';
            $scope.mediasNames = '';

            angular.forEach($scope.item.medias, function (media) {
                $scope.mediasNames ? $scope.mediasNames = $scope.mediasNames.concat(', ', media.name) : $scope.mediasNames = media.name;
            });

            angular.forEach($scope.item.targetGroup, function (group) {
                $scope.targetGroups += ($scope.targetGroups ? ', ' : '') + group.split(' - ')[0];
            }, this);

            $scope.isEmpty = !$scope.targetGroups;
            if (!$scope.targetGroups) {$scope.targetGroups = 'None';}
        }
    };
});

app.filter('dateFormat', function ($filter) {
    return function (milliseconds) {
        var date = new Date(milliseconds),
            minuteMillisec = 60,
            hourMillisec = 3600,
            dayMillisec = 86400,
            diffSeconds = (((new Date()).getTime() - date.getTime()) / 1000),
            diffDays = Math.round(diffSeconds / dayMillisec);

        return diffSeconds < minuteMillisec && "just now" ||
            diffSeconds < hourMillisec && Math.round(diffSeconds / minuteMillisec) + " minute(s) ago" ||
            diffSeconds < dayMillisec && Math.round(diffSeconds / minuteMillisec) + " hour(s) ago" ||
            diffDays == 1 && "Yesterday" ||
            diffDays < 7 && diffDays + " day(s) ago" ||
            diffDays < 31 && Math.ceil(diffDays / 7) + " week(s) ago" ||
            $filter('date')(date);
    };
});
