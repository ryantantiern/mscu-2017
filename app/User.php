<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

use App\Route;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
         'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function routes()
    {
        return $this->hasMany(Route::class);
    }

    /**
     *  Shared Routes User-User-Route Relationship Definitions
     */


    // Returns list of users User has sent routes to
    private function sharedRoutesWith()
    {
        return $this->belongsToMany(User::class, 'shared_routes', 'sender_id', 'receiver_id')->withPivot('route_id');
    }

    // Returns list of users that User has received routes from
    private function sharedRoutesReceivedFrom()
    {
        return $this->belongsToMany(User::class, 'shared_routes', 'receiver_id', 'sender_id')->withPivot('route_id');
    }

    // Returns list of route ids User has sent AND is still pending
    public function sharedRoutesSentPending()
    {
        return $this->sharedRoutesWith()->wherePivot('accepted' , false)->pivot->route_id->get();
    }

    // Returns list of route ids User has received AND is still pending
    public function sharedRoutesReceivedPending()
    {
        return $this->sharedRoutesReceivedFrom()->wherePivot('accepted' , false)->pivot->route_id->get();
    }

    // Accept a shared route where composite key is User (receiver_id), sender_id and route_id
    public function acceptSharedRouteRequest(User $user, Route $route)
    {
        $this->sharedRoutesReceivedFrom()->where('id', $user->id)->pivot->where('route_id', $route->id)->update([
            'accepted' => true
            ]);
    }

    // Share route with a User
    public function shareRoute(User $user, Route $route)
    {
        $this->sharedRoutesWith()->attach($user->id, ['route_id' => $route->id]);
    }

    /**
     *  Friending User-User Relationship Definitions
     */

    // Returns list of users User has added as a friend
    private function friendsWith()
    {
        return $this->belongsToMany(User::class, 'friends', 'user_id', 'friend_id');
    }

    // Returns list of users User has received friend requests from
    private function friendOf()
    {
        return $this->belongsToMany(User::class, 'friends', 'friend_id', 'user_id');
    }

    // Returns list of users User has added AND User has received friend requests from AND User has accepted
    public function friends()
    {
        return $this->friendsWith()->wherePivot('accepted', true)->get()->merge($this->friendOf()->wherePivot('accepted', true)->get());
    }

    public function addFriend(User $user)
    {
         $this->friendOf()->attach($user->id);
    }

    // Returns list of users User sent friend requests to AND friends has not accepted
    public function friendRequestsSentPending()
    {
        return $this->friendsWith()->wherePivot('accepted', false)->get();
    }

    // Returns list of users User has received friend requests to AND has not accepted
    public function friendRequestsReceivedPending()
    {
        return $this->friendOf()->wherePivot('accepted', false)->get();
    }

    public function acceptFriendRequest(User $user)
    {
        $this->friendRequests()->where('id', $user->id)->first()->pivot->update([
            'accepted' => true,
            ]);
    }

    public function isFriendsWith(User $user)
    {
        return (bool) $this->friends()->where('id', $user->id)->count();
    }


}
