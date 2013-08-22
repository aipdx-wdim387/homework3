app.controller("mainController", function($scope, $http){
  // Setting up API credentials
  $scope.apiKey = "1cb1d3f0d94731306135c40c539dcf60";
  // Initializing variables
  $scope.results = [];
  $scope.filterText = null;
  $scope.availableGenres = [];
  $scope.genreFilter = null;
  $scope.orderFields = ["Air Date", "Rating"];
  $scope.orderDirections = ["Descending", "Ascending"];
  $scope.orderField = "Air Date"; //Default order field
  $scope.orderReverse = false;

  // Creating the scope function init(), because of where it lives on the index.html file, it will be triggered when the page has been loaded using ng-init
  $scope.init = function() {
    // With a little digging in to the trackt.tv API docs, you will find that the date in required
    var today = new Date();
    // This is just a way to make sure the formatted "Date" is correct
    var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
    $http.jsonp('http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK').success(function(data) {
      // This is triggered when we get a "success" callback from our http request
      // First of two forEach loops, this one is just to separate the response values
      angular.forEach(data, function(value, index){
        // Saving the date seperately for later usage within the forEach loop
        var date = value.date;
        // Usage of the angular.forEach method to loop through all of the episodes
        angular.forEach(value.episodes, function(tvshow, index){
          // Put a timestamp on it
          tvshow.date = date;
          // Building up the results array with each tvshow and it's properties
          $scope.results.push(tvshow);
          // Added step, grab all genres so we can filter by them on the front-end
          angular.forEach(tvshow.show.genres, function(genre, index){
            // A way of checking genre uniqueness before saving it to the array
            var exists = false;
            angular.forEach($scope.availableGenres, function(avGenre, index){
              if (avGenre == genre) {
                exists = true;
              }
            });
            if (exists === false) {
              $scope.availableGenres.push(genre);
            }
          });
        });
      });
    }).error(function(error) {

    });
  };

  $scope.setGenreFilter = function(genre) {
    $scope.genreFilter = genre;
  }

  $scope.customOrder = function(tvshow) {
    switch ($scope.orderField) {
      case "Air Date":
        return tvshow.episode.first_aired;
        break;
      case "Rating":
        return tvshow.episode.ratings.percentage;
        break;
    }
  };
});

// Filters typically should have their own file.
// Similarly to the other filter added to the ng-repeat, this one will trigger.
// But since we wanted to do a little more "advanced" functionality, we separate it out from the front-end code
app.filter('isGenre', function() {
  return function(input, genre) {
    if (typeof genre == 'undefined' || genre == null) {
      return input;
    } else {
      var out = [];
      // This is just comparing tvshow genres with the passed in genre value then compiling a list of the
      // tvshows that match the selected genre
      for (var a = 0; a < input.length; a++){
        for (var b = 0; b < input[a].show.genres.length; b++){
          if(input[a].show.genres[b] == genre) {
            out.push(input[a]);
          }
        }
      }
      return out;
    }
  };
});