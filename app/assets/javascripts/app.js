var app=angular.module('crm', ['ui.router', 'ngResource', 'templates'])
    .constant("baseURL", "https://rails-crmsystem-wildman2bad.c9users.io/")
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('contacts', {
                url:'/',
                templateUrl: 'contacts.html',
                controller  : 'ContactController'
            })
            .state('contact', {
                url: 'contact/:id',
                templateUrl: 'contacts.html',
                controller  : 'DishDetailController'
            });
            $urlRouterProvider.otherwise('/');
    })