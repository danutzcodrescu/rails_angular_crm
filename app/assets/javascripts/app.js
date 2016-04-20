'use strict'

var app=angular.module('crm', ['ui.router', 'ngResource', 'templates', 'infinite-scroll'])
    .constant("baseURL", "https://rails-crmsystem-wildman2bad.c9users.io/")
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('contacts', {
                url:'/contacts',
                views: {'content@': {
                    templateUrl: 'contacts.html',
                    controller  : 'ContactsController',
                    controllerAs: 'contacts',
                    /* used the promise in order to wait for resolve to be resolved. Othewise, if success and failure would have been
                        included in the query it would have triggered the infinite scroll into an infinite loop of queries*/
                    resolve: {contacts: ['contactFactory', function(contactFactory) {
                        return contactFactory.getContact().query({limit:10}).$promise.then(
                                function(response){ 
                                    return response;
                                }, 
                                function (response) {
                                   console.log( response.statusText); 
                                }); 
                    }]}
                }}
                
            })
          
            $urlRouterProvider.otherwise('/');
    })