angular.module('botb_mobile.services', ['ngResource'])

.factory('Entry', function($resource) {
	var entry = $resource('http://battleofthebits.com/api/v1/entry/666');
	console.log(entry);
	return entry;
	
})

.factory('api_resource', function($http) {
	var api_resource = {
		url_base : 'http://battleofthebits.com/api/v1/',
		data : {},
		call : function(query) {
			$http({
				method: 'GET',
				url: this.url_base + query
			}).then(function successCallback(response) {
				this.data = response.data;
				console.log(this.data);
				return this.data;
			}, function errorCallback(response) {
				console.log(response);
			});
		}
	};
	return api_resource;
})

.service('player', ['$cordovaNativeAudio', '$http', '$rootScope', '$location', function ($cordovaNativeAudio, $http, $rootScope, $location) {
	this.single = function(entry) {
		console.log('loading track?');
		console.log(entry.play_url);
		//angular.element(document).find('player').attr('entry', entry);
		$rootScope.entry = entry;
		$cordovaNativeAudio
		.preloadComplex('music', entry.play_url, 1, 1)
		.then(function(msg) {
			console.log(msg);
			$cordovaNativeAudio.play('music');
		}, function(error) {
			console.log('error: ' + error);
		});
		//this.entry = entry;
		//$location.path('/player/single/' + entry_id);

	};
}])

.directive('player', [function() {
	return {
		//transclude: true,
		templateUrl: 'templates/player.html',
		restrict: 'E',
		scope: {},
		link: function(scope, element, attributes) {
			console.log(attributes);
			console.log(scope.$parent.$parent);
			scope.$watch(scope.$parent.$parent.entry, function(value) {
				console.log('watchdog invoked');
				console.log(value);
			});
		}
	};
}])

.service('spriteshit_loader', ['$http', '$rootScope', function($http, $rootScope) {
	this.init = function() {
		$http.get($rootScope.api_base + 'spriteshit/version')
		.success(function(data) {
			// insert CSS
			console.log(data);
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = $rootScope.botb_base + 'styles/spriteshit/' + data.spriteshit_version + '.css';
			angular.element(document.querySelector('head')).append(link);
		});
	}
}])


.factory('infinite_loader', ['$http', '$rootScope', function($http, $rootScope) {
	return function(query, sort) {
		return {
			query: query,
			sort: sort,
			page: 0,
			items: [],
			more: true,
			load_items: function() {
				var $this = this;
				$http.get($rootScope.api_base + query + '/' + this.page + sort)
				.success(function(items) {
					angular.forEach(items, function(item) {
						$this.items.push(item);
					});
				})
				.error(function(data) {
					$this.more = false;
				})
				.finally(function() {
					$this.page++;
					$rootScope.$broadcast('scroll.infiniteScrollComplete');
				});
			},
		};
	};
}])

.service('api_caller', ['$http', '$rootScope', function($http, $rootScope) {
	this.load = function(object_type, object_id) {
		return $http.get($rootScope.api_base + object_type + '/load/' + object_id);
	};
}])

/*
		.error(function() {
			let alert_msg = Alert.create({
				title: 'Failz0hrz Err0Hrz',
				message: 'SANTYX ERROR ::| Could not load type "' + type + '" with id "' + id + '"',
				buttons: ['Dismiss']
			});
			this.nav.present(alert_msg);
		});
	}
})
*/
.factory('Chats', function() {

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
