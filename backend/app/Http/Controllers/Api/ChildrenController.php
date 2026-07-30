<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\Tenant;
use Illuminate\Http\Request;

class ChildrenController extends Controller
{
    /**
     * The authenticated parent's linked children. The subquery reads
     * parent_children (auto-scoped to the tenant by the BelongsToSchool global
     * scope when queried via the model) — here inlined and pinned to the tenant
     * explicitly, because User is the tenant root and has no global scope.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return User::query()
            ->where('users.school_id', Tenant::id())
            ->whereIn('users.id', function ($q) use ($user) {
                $q->select('child_id')
                    ->from('parent_children')
                    ->where('school_id', Tenant::id())
                    ->where('parent_id', $user->id);
            })
            ->orderBy('name')
            ->get();
    }
}
