<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MatriculaResource;
use App\Models\Matricula;
use App\Services\MatriculaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MatriculaController extends Controller
{
    public function __construct(
        private readonly MatriculaService $service
    ) {
    }

    public function index()
    {
        return MatriculaResource::collection($this->service->listar());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'usuario_id' => ['required', 'integer', 'exists:usuarios,id'],
            'disciplina_id' => ['required', 'integer', 'exists:disciplinas,id'],
            'interesse_id' => ['nullable', 'integer', 'exists:interesses,id'],
            'semestre' => ['nullable', 'string', 'max:20'],
        ]);

        $matricula = $this->service->criar($data);

        return new MatriculaResource($matricula);
    }

    public function destroy(Matricula $matricula): JsonResponse
    {
        $this->service->cancelar($matricula);

        return response()->json([
            'message' => 'Matrícula cancelada com sucesso.',
        ]);
    }
}
