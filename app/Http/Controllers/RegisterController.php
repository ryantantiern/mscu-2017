<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;


class RegisterController extends Controller
{
    public function register(Request $request)
    {
    	$this->validate($request, [
    		'email' => 'required|email|unique:users,email|max:60',
    		'password' => 'required|min:6|max:30',
    	]);

    	User::create([
    		'email' => $request->input('email'),
    		'password' => bcrypt($request->input('password')),
    	]);



    	return [
    		'email' => $request->input('email'), 
    		'password' => $request->input('password'), 
    		'status' => 'all ok!'
    	];
    }
}
