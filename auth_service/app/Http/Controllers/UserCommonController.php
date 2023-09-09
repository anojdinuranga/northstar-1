<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserCommonController extends Controller
{

    public function healthDataConsent():JsonResponse
    {
        try {
            $user = Auth::user();
            $user->health_data = !$user->health_data;
            $user->save();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function updateProfilePicture(Request $request):JsonResponse
    {
        try {
            //implement upload logic here
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getClientsByIDs(Request $request): JsonResponse
    {

        return response()->json(User::whereIn('id', json_decode($request->get('user_ids'),true))->get());
    }
}
