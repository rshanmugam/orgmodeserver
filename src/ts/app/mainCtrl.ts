
angular.module('myApp')
    .controller('mainCtrl', ["$scope", "$http", "serverEvent", function($scope, $http, serverEvent) {

        function registerUser(name: string): void {
            $http.post('/user', {name: name})
            .success(function(data, status, headers, config) {
                if (data.id) {
                    $scope.userId = data.id;
                }
            });
        }

        $scope.userId = null;
        $scope.userName = localStorage.getItem("username") || "joe";
        registerUser($scope.userName);

        $scope.debug = false;
        $scope.toggleDebug = function () {
            $scope.debug = !$scope.debug;
        };

        $scope.nameFormVisible = false;

        $scope.showNameForm = function() {
            $scope.newName = $scope.userName;
            $scope.nameFormVisible = true;
        };

        $scope.registerName = function(name) {
            name = name.slice(0, 20);
            $scope.userName = name;
            $scope.nameFormVisible = false;
            localStorage.setItem("username", name);
            $http.post('/user/' + $scope.userId, {name: name})
        };

        $scope.newUser = function(name) {
            $scope.userName = name;
            $scope.nameFormVisible = false;
            localStorage.setItem("username", name);
            registerUser(name);
        };

        $scope.msglist = []
        $scope.newchatmsg = "";
        $scope.sendMsg = function() {
            $http.post('/chatmsg', {
                msg: $scope.newchatmsg,
                user: $scope.userId
            });
            $scope.newchatmsg = "";
        };
        $scope.chatvisible = false;
        $scope.toggleChatVisibility = function() {
            $scope.chatvisible = !$scope.chatvisible;
        };
        serverEvent.addEventListener("chatMsg", function(e) {
            var msg = JSON.parse(e.data);
            $scope.msglist.push({text: msg.msg, name: msg.user});
            $scope.msglist = $scope.msglist.slice(-10, $scope.msglist.length);
            $scope.$apply();
        });
        serverEvent.addEventListener("userCheck", function(e) {
            $http.post('/confirmexists/' + $scope.userId);
        });
    }])