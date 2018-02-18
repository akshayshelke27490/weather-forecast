var app = angular.module('weatherReport', []);
app.controller('homeCtrl', function($scope, $http, $window) {
      var mydate=new Date()
      var year=mydate.getYear()
      if(year<1000)
      year+=1900
      var day=mydate.getDay()
      var month=mydate.getMonth()
      var daym=mydate.getDate()
      if(daym<10)
      daym="0"+daym
      var dayarray=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
      var montharray=new Array("January","February","March","April","May","June","July","August","September","October","November","December");

      $scope.homeDay = dayarray[day]
      $scope.homeDate = daym+"  "+montharray[month]+"  "+year;

      var city = 'Mumbai';
      var countryId = 'in'; // India
      var appId = '54000cdf5baa13daa52753738be19ba4'; // appId created on account akshayshelke
      var apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?q='+city+','+countryId+'&appid='+appId;
      var objWeather = {};

      $http({
        method : "GET",
        url: apiUrl
      }).then(function success(response) {
          $scope.city = response.data.city.name;
          $scope.temperature = parseFloat((response.data.list[0].main.temp-273.15).toFixed(1));
          $scope.currentWeatherStatus = response.data.list[0].weather[0].main;
          $scope.nextFiveDays = response.data.list;

          if(response.data.list[0].weather[0].main == 'Clear'){
              $scope.weatherCondition = 'clear_sky';
          }else if(response.data.list[0].weather[0].main == 'Rain'){
              $scope.weatherCondition = 'rainy';
          }else if(response.data.list[0].weather[0].main == 'Extreme'){
              $scope.weatherCondition = 'cloudy';
          } else {
              $scope.weatherCondition = 'sunny_day';
          }

          for(var i = 0; i < response.data.list.length-1; i++){
              objWeather[i] = {
                city: response.data.city.name,
                date:new Date(response.data.list[i].dt_txt).getDate()+' '+montharray[new Date(response.data.list[i].dt_txt).getMonth()]+' '+year,
                day: dayarray[new Date(response.data.list[i].dt_txt).getDay()],
                dateGroup: response.data.list[i].dt_txt.split(" "),
                temperature : parseFloat((response.data.list[i].main.temp-273.15).toFixed(1)), // Converted temperature from Kelvin to Celcius
                temp_max: parseFloat((response.data.list[i].main.temp_max-273.15).toFixed(1)),
                temp_min: parseFloat((response.data.list[i].main.temp_min-273.15).toFixed(1)),
                humidity: response.data.list[i].main.humidity
              }
          }
          $scope.weatherDetailsListing = objWeather;
      }, function error(response) {
          $window.alert("Some error has beed occoured. Please Try Again");
      });

      // Toggle the Detail View
      $scope.showDetails = function() {
        $scope.details = !$scope.details;
      };
}); // end homeCtrl
