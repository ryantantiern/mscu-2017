<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;

class FriendController extends Controller
{
    public function friends(Request $request)
    {
    	$user = $request->user();
    	if (empty($user->friends()->toArray())){ return ['status' => 'response', 'response' => 'You have no friends'];}
    	return $user->friends()->toArray();
    }

    public function add(Request $request, $user_id)
    {
    	$user = $request->user();
    	$response = ['Failed at try/catch'];
  		try {
  			$friend = User::find($user_id);
  			if ($user->isFriendWith($friend)) { $response = ['status' => 'fail', 'fail' => 'Already friends with' . $friend->id]; }
  			else { 
  				$user->addFriend($friend);
  				$response = ['status' => 'success'];
  			}
  		} 
  		catch (Exception $e) { $response = ['status' => 'error', 'error' => $e]; } 
  		finally { return $response; }
    }
}
