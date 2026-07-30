<?php

namespace App\Http\Middleware;

use App\Support\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Runs after auth:sanctum. It reads school_id from the *authenticated user*
 * (never from request input, which a caller could forge) and pins it for the
 * rest of the request. From here on, every tenant-scoped query is filtered
 * automatically.
 */
class ResolveTenant
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($user = $request->user()) {
            Tenant::set($user->school_id);
        }

        return $next($request);
    }
}
