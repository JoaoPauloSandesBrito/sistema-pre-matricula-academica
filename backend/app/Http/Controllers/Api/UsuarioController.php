<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUsuarioRequest;
use App\Http\Requests\UpdateUsuarioRequest;
use App\Http\Resources\UsuarioResource;
use App\Models\Usuario;
use App\Services\UsuarioService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function __construct(
        private readonly UsuarioService $service
    ) {
    }

    public function index(Request $request)
    {
        $usuarios = $this->service->listar($request->query('perfil'));

        return UsuarioResource::collection($usuarios);
    }

    public function store(StoreUsuarioRequest $request)
    {
        $usuario = $this->service->criar($request->validated());

        return new UsuarioResource($usuario);
    }

    public function show(Usuario $usuario)
    {
        return new UsuarioResource($usuario);
    }

    public function update(UpdateUsuarioRequest $request, Usuario $usuario)
    {
        $usuarioAtualizado = $this->service->atualizar(
            $usuario,
            $request->validated()
        );

        return new UsuarioResource($usuarioAtualizado);
    }

    public function destroy(Usuario $usuario): JsonResponse
    {
        $this->service->excluir($usuario);

        return response()->json([
            'message' => 'Usuário excluído com sucesso.',
        ]);
    }
}
