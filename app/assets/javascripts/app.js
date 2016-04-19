var app=angular.module('crm', ['ui.router', 'ngResource', 'templates'])
    .constant("baseURL", "https://rails-crmsystem-wildman2bad.c9users.io/")
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('contacts', {
                url:'/contacts',
                templateUrl: 'contacts.html',
                controller  : 'ContactsController',
                controllerAs: 'contacts',
                /* used the promise in order to resolve the factory and return an array to the controller,
                   instead of ussing success and error functions inside query that would have returned an object that is not usable inside the child controller*/
                resolve: {contacts: ['contactFactory', function(contactFactory) {
                    return contactFactory.getContact().query({limit:5})
                            .$promise.then(function(response){ 
                                return response;
                            }, 
                            function (response) {
                               return response.statusText; 
                            }); 
                }]}
            })
           .state('contacts.contact-detail', {
                url:'/:id',
                templateUrl: 'contact.html',
                controller: 'ContactController',
                controllerAs: 'contact'
            })
            $urlRouterProvider.otherwise('/');
    })