app.controller("mainController", function($scope, $http){
  //API
  $scope.apiKey = "1cb1d3f0d94731306135c40c539dcf60";
  //vars
  $scope.results = [];
  $scope.filterText = null;
  $scope.availableGenres = [];
  $scope.genreFilter = null;
  $scope.orderFields = ["Air Date", "Rating"];
  $scope.orderDirections = ["Descending", "Ascending"];
  $scope.orderField = "Air Date"; //Default order field
  $scope.orderReverse = false;

  // creating init function, because it is loaded after the page
  $scope.init = function() {
    // date
    var today = new Date();
    // format date
    var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
    $http.jsonp('http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK').success(function(data) {
      // success cb
      angular.forEach(data, function(value, index){
        // save date outside the for each loop. // DAN: Actually, the issue is that the dates are not attached to individual episodes, but you want to display them that way on your page.
        var date = value.date;
        // loop over episode values
        angular.forEach(value.episodes, function(tvshow, index){
          //time
          tvshow.date = date;
          //push into array
          $scope.results.push(tvshow);
          //filter by genres // DAN: We aren't filtering by Genres here, we are creating our list of available genres, which we are using to populate the filter.
          angular.forEach(tvshow.show.genres, function(genre, index){
            //save to array genre
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
  }; // DAN: Added semicolon

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


app.filter('isGenre', function() {
  return function(input, genre) {
    if (typeof genre == 'undefined' || genre == null) {
      return input;
    } else {
      var out = [];
      // compare genre to the passed value
      for (var a = 0; a < input.length; a++){ // DAN: For efficiency, consider writing this as: for (var a = 0, len = input.length; a < len; a++) {
        for (var b = 0; b < input[a].show.genres.length; b++){ // DAN: For efficiency, consider writing this as: for (var b = 0, genreLength = input[a].show.genres.length; b < genreLength; b++) {
          if(input[a].show.genres[b] == genre) {
            out.push(input[a]);
          }
        }
      }
      return out;
    }
  };
});
