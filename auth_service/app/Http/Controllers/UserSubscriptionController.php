<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserMainSubscriptionData;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserSubscriptionController extends Controller
{

    public function activateFreeTrial():JsonResponse
    {
        try {
            $User = User::find(Auth::id());

            if($User->trial_used){
                return response()->json('Free Trial already used.', 400);
            } else {
                UserMainSubscriptionData::create([
                    'user_id' => Auth::id(),
                    'payment_id'=>'FREE_TRIAL',
                    'is_active'=> true,
                    'valid_till'=>Carbon::now()->addMonth()->toDateString()
                ]);

                $User->trial_used = true;
                $User->save();
                return response()->json(['success'=>true]);
            }
        } catch (\Exception $e) {
            return response()->json(['error'=>$e->getMessage()], 400);
        }
    }

    public function buySubscription():JsonResponse
    {
        try {
            /*$userMainSubscription = new UserMainSubscriptionData();
            $userMainSubscription->user_id = Auth::user()->id;
            $userMainSubscription->payment_id = '0';
            $userMainSubscription->monthly_charge = 99.99;
            $userMainSubscription->renewal_date = Carbon::now();
            $userMainSubscription->is_active = true;
            $userMainSubscription->save();*/

            return response()->json(['message' => 'NOT IMPLEMENTED'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
