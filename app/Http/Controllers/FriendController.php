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
    	$response = ['error' => 'Internal Server Error'];
  		try {
  			$friend = User::find($user_id);
  			if ($user->HasAFriendRequest($friend)) { 
  				$response = ['status' => 'fail', 'fail' => 'Already friends with user id: ' . $friend->id]; 
  			}
  			else if ($user->id == $friend->id) {
  				$response = ['status' => 'fail', 'fail' => 'Cannot add self']; 
  			}
  			else { 
  				$user->addFriend($friend);
  				$response = ['status' => 'success'];
  			}
  		} 
  		catch (Exception $e) { $response = ['status' => 'error', 'error' => $e]; } 
  		finally {return $response;}
    }

    public function accept(Request $request, $user_id)
    {

    }
}
