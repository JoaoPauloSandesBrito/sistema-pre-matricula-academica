<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UsuarioResource;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'firebase_uid' => ['nullable', 'string', 'max:128'],
            'nome' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150'],
            'perfil' => ['nullable', 'in:aluno,secretaria'],
        ]);

        if (!str_ends_with($data['email'], '@uesb.edu.br')) {
            throw ValidationException::withMessages([
                'email' => 'Use um e-mail institucional @uesb.edu.br.',
            ]);
        }

        $usuario = Usuario::firstOrCreate(
            ['email' => $data['email']],
            [
                'firebase_uid' => $data['firebase_uid'] ?? null,
                'nome' => $data['nome'],
                'perfil' => $data['perfil'] ?? 'aluno',
                'curso' => 'Ciência da Computação',
                'status' => true,
            ]
        );

        if (!$usuario->status) {
            throw ValidationException::withMessages([
                'email' => 'Usuário inativo.',
            ]);
        }

        return response()->json([
            'usuario' => new UsuarioResource($usuario),
        ]);
    }
}
