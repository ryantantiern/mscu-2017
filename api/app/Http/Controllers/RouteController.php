<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Route;
use App\User;

class RouteController extends Controller
{
    public function routes(Request $request)
    {
        $user = $request->user();
        $routes = $user->routes()->get();

        $response = ['status' => 'response', 'response' => 'routes', 'routes' => $routes];

        /*
        Todo: response should not expose id of route within the table
         */

        return $response;
    }

    public function create(Request $request)
    {
    /*	Test Data
    $coordinates = [
    		[26.15430, 12.45632],
    		[134.13256, 66.29301],
    		[145.22410, 70.30109],
    		[150.00156, 73.44561],
    		[153.32962, 74.22701],
    		[154.48327, 78.97830],
    	];

    	$json_coordinates = json_encode($coordinates);*/

    	$json_coordinates = $request->input('coordinates');
    	$array_coordinates = json_decode($json_coordinates);

    	if (!is_array($array_coordinates)) {
    		return ['status' => 'error', 'error' => 'Route is not an array'];
      	}

      	foreach ($array_coordinates as $coord) {
      		if (!is_array($coord)) {
      			return ['status' => 'error' , 'error' => 'Coordinates are not an array'];
      		}
      		if (!count($coord) == 2) {
      			return ['status' => 'error', 'error' => 'Not a a pair of coordinates'];
      		}

			foreach ($coord as $val) {
				if (!is_numeric($val)) {
					return ['status' => 'error', 'error' => 'Coordinate is not numeric value'];
				}
  			}
      	}
	    
    	$route = Route::create([
    		'user_id' => $request->user()->id,
    		'body' => $json_coordinates
    	]);

        $response = ['status' => 'response', 'response' => 'route', 'route' => $route];

    	return $route;
    }

    public function share(Request $request, $user_id, $route_id)
    {
        $response = ['status' => 'success'];
        $user = $request->user();
        $friend = User::find($user_id);
        $route = $user->routes()->find($route_id);

        if (empty($friend)){
            $respons = ['status' => 'fail', 'fail' => 'Friend with id ' . $user_id . 'does not exist'];
        }
        else if (empty($route)){ $response = ['status' => 'fail' , 'fail' => 'You do not own a route with id ' . $route_id]; }
        else if (!$user->isFriendsWith($friend)) { $response = ['status' => 'fail', 'fail' => 'You are not friends with user: ' . $user_id];}
        else{ $user->shareRoute($friend, $route); }
        return $response;
    }

    public function received()
    {
        
    }

    public function accept() 
    {

    }

    public function decline()
    {

    }


}
