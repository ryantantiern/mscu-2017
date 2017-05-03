# mscu-2017
## Server Pre-requisite ##
1. Composer<br/>
2. PHP >= 5.6.4<br/>
3. Hosted (or local) PostgreSQL Database<br/>

## App Pre-requisites ##
1. Node.js 6.x LTS<br/>
2. [Android](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html): Java Development Kit (JDK) 7, Android SDK<br/>
3. iOS: Xcode (Non OSX users cannot build for iOS)<br/>

## Server setup ##

In your database base server, create a new database called `api_cu` or run execute query `CREATE DATABASE api_cu`. At the root of `/api` directory, change `.env` to insert appropriate `DB_USERNAME, DB_HOSTNAME, DB_PASSWORD` to resemble your PostgreSQL instance. Upload the `/api` directory into your web server via SSH or your favourite FTP client. In the terminal/cmd, execute `php composer.phar` install to install the project dependencies. After the dependencies had been installed, execute `php artisan migrate` followed by `php artisan passport:install`. This will create a database migration within `api_cu` of your PostgreSQL instance then initialize the Passport package to create a new client secret key. It will return to the console  <i>“Laravel Password Grant Client”</i>followed by a key. Store this key in a secure place. 

## App setup ##

In the root of /app directory, run command npm install. This will install the Ionic and Cordova command line tools followed by the app’s respective dependencies.In /app/www/scripts/controllers.js, find LoginCtrl. Within LoginCtrl, find and set client_secret to the <key> value we stored earlier. Next, navigate to /app/www/scripts/app.js. Find var apiurl, then set var apiurl=<your web server host name>.<br/>

Next decide which platform you will be building for (Non OSX users cannot build for iOS). Connect your mobile device with your machine. Run ionic platform add ios or ionic platform add android followed by ionic build ios or ionic build android depending on your mobile OS.<br/> 

Your app is ready to be used!
<br/>

To deploy the app, follow the guide on [Publishing your app](http://ionicframework.com/docs/v1/guide/publishing.html)
<br/>

## API directory ##

Laravel follows an MVC Framework. Check out [Laravel](https://laravel.com/docs/5.4/structure) for more details.
<br/>
#### Controllers ####
Location: /api/app/Http/Controllers<br/>
Key Files: <br/>
<u>FriendController.php<br/>
RegisterController.php<br/>
RouteController.php<br/>
SearchController.php<br/>
</u>
<br/>
#### Models ####
Location: /api/app<br/>
Key FIles:<br/>
Route.php<br/>
User.php<br/>
Waypoint.php<br/>
<br/>
#### Routes ####
Location:/api/routes<br/>
Key Files: <br/>
api.php<br/>
<br/>
#### Database Migrations ####
Location: /api/database/migrations<br/>
Key Files: All<br/>
<br/>
## APP Directory ##

#### Template Views ####
Location: /app/www/templates<br/>
Key Files: All<br/>
<br/>
Scripts<br/>
Location: /app/www/scripts<br/>
Key Files: <br/>
app.js<br/>
controllers.js<br/>
directives.js<br/>
services.js<br/>

