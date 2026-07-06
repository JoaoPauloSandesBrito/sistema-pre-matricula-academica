<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InteresseResource;
use App\Models\Interesse;
use App\Services\InteresseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InteresseController extends Controller
{
    public function __construct(
        private readonly InteresseService $service
    ) {
    }

    public function index(Request $request)
    {
        $usuarioId = $request->query('usuario_id');
        $interesses = $this->service->listar($usuarioId ? (int) $usuarioId : null);

        return InteresseResource::collection($interesses);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'usuario_id' => ['required', 'integer', 'exists:usuarios,id'],
            'disciplina_id' => ['required', 'integer', 'exists:disciplinas,id'],
        ]);

        $interesse = $this->service->criar($data);

        return new InteresseResource($interesse);
    }

    public function destroy(Interesse $interesse): JsonResponse
    {
        $this->service->excluir($interesse);

        return response()->json([
            'message' => 'Interesse removido com sucesso.',
        ]);
    }
}
