"use strict";var vouchedForApp=angular.module("vouchedForApp",["ngResource","ngRoute","ui.router","ipCookie"]);vouchedForApp.config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("admin",{url:"/admin",templateUrl:"views/Admin.html",controller:"PollsController"}).state("admin.options",{url:"/options",templateUrl:"views/AdminMenu.html"}).state("admin.newquestion",{url:"/new-question",templateUrl:"views/Admin/NewQuestion.html"}).state("admin.viewquestions",{url:"/view-questions",templateUrl:"views/Admin/ViewQuestions.html"}).state("poll",{url:"/poll",templateUrl:"views/Poll.html",controller:"PollsController"}).state("start",{url:"/",templateUrl:"views/main.html",controller:"MainController"})}]),vouchedForApp.controller("PollsController",["$window","$rootScope","$scope","$state","ipCookie",function(a,b,c,d,e){c.polls=[],c.answeredQuestions={},socket.emit("questionsRequest"),c.refresh=function(){socket.emit("questionsRequest"),c.checkAnsweredQuestions()},c.checkAnsweredQuestions=function(){var a=e("answeredPolls");a&&(c.answeredQuestions=a)},c.isPollAnswered=function(a){return c.answeredQuestions[a.id]?!0:!1},c.selectAnswer=function(a,b){return c.answeredQuestions[a.id]?!1:(b.times++,a.question.times++,b.selected=!0,c.updateCookie(a),void socket.emit("pollUpdate",a))},c.updateCookie=function(a){var b=e("answeredPolls");b=b&&b.length>0?JSON.parse(b):{},b[a.id]="answered",e("answeredPolls",JSON.stringify(b),{expires:99}),c.refresh()},c.submitQuestion=function(a){var b;for(b in a.answers)a.answers[b].times=0;socket.emit("newQuestion",{id:c.polls.length,question:{text:a.newQuestion,times:0},answers:a.answers})},socket.on("pollUpdateSuccess",function(){c.refresh()}),socket.on("newQuestionSaved",function(){c.refresh(),d.go("admin.viewquestions")}),socket.on("questionsData",function(a){c.$apply(function(){c.polls=[];var b;for(b in a)a[b]&&a[b].length>0&&(a[b]=JSON.parse(a[b]),c.polls.unshift(a[b]))})}),c.checkAnsweredQuestions()}]),vouchedForApp.directive("dynamicFields",function(){return{restrict:"ACE",link:function(a,b,c){a.fields=new Array(parseInt(c.fields)),a.addField=function(){a.fields.length<c.maxfields&&a.fields.push("")}}}}),angular.module("vouchedForApp").controller("MainController",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]);