import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Config, Runner } from 'angular-ecmascript/module-helpers';

class RoutesConfig extends Config {
    constructor() {
        super(...arguments);

        this.isAuthorized = ['$auth', this.isAuthorized.bind(this)];
    }

    configure() {
        this.$stateProvider
            .state('splash', {
                url: '/splash',
                templateUrl: 'client/templates/splash.ng.html',
                controller: 'LoginCtrl as logger'
            })
            .state('tutor-1', {
                url: '/tutor-1',
                templateUrl: 'client/templates/tutor-1.ng.html'
            })
            .state('tutor-2', {
                url: '/tutor-2',
                templateUrl: 'client/templates/tutor-2.ng.html'
            })
            .state('inter-ok', {
                url: '/inter-ok',
                templateUrl: 'client/templates/inter-ok.ng.html'
            })
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'client/templates/tabs.ng.html',
                resolve: {
                    user: this.isAuthorized,
                    chats() {
                        return Meteor.subscribe('chats');
                    }
                }
            })
            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'client/templates/chats.ng.html',
                        controller: 'ChatsCtrl as chats',
                        resolve: {
                            interestByUserId() {
                                return Meteor.subscribe('interestByUserId');
                            }
                        }
                    }
                }
            })
            .state('chatse', {
                url: '/chatse/:contactId',
                templateUrl: 'client/templates/chat.ng.html',
                controller: 'ChatCtrl as chat',
                resolve: {
                    interestByUserId() {
                        return Meteor.subscribe('interestByUserId');
                    }
                }
            })
            .state('tab.groups', {
                url: '/groups',
                views: {
                    'tab-groups': {
                        templateUrl: 'client/templates/tab-groups.ng.html',
                        controller: 'InterestFriend as friend',
                        resolve: {
                            interestByUserId() {
                                return Meteor.subscribe('interestSomeUserId');
                            }
                        }
                    }

                }
            })
            .state('friend', {
                url: '/friend_ineters/:contactId',
                templateUrl: 'client/templates/friend-interest.ng.html',
                controller: 'FriendDetail as friends',
                resolve: {
                    interestByUserId() {
                        return Meteor.subscribe('interestSomeUserId');
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'client/templates/login.ng.html',
                controller: 'LoginCtrl as logger'
            })
            .state('confirmation', {
                url: '/confirmation/:phone',
                templateUrl: 'client/templates/confirmation.ng.html',
                controller: 'ConfirmationCtrl as confirmation'
            })
            .state('tab.settings', {
                url: '/settings',
                views: {
                    'tab-settings': {
                        templateUrl: 'client/templates/settings.ng.html',
                        controller: 'SettingsCtrl as settings'
                    }
                }
            });

        this.$urlRouterProvider.otherwise('tab/chats');
    }

    isAuthorized($auth) {
        return $auth.awaitUser();
    }
}

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

class RoutesRunner extends Runner {
    run() {
        this.$rootScope.$on('$stateChangeError', (...args) => {
            const err = _.last(args);

            if (err === 'AUTH_REQUIRED') {
                this.$state.go('splash');
            }
        });
    }
}

RoutesRunner.$inject = ['$rootScope', '$state'];

export default [RoutesConfig, RoutesRunner];