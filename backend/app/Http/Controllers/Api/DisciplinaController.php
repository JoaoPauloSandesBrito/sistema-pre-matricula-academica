<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDisciplinaRequest;
use App\Http\Requests\UpdateDisciplinaRequest;
use App\Http\Resources\DisciplinaResource;
use App\Models\Disciplina;
use App\Services\DisciplinaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DisciplinaController extends Controller
{
    public function __construct(
        private readonly DisciplinaService $service
    ) {
    }

    public function index(Request $request)
    {
        $disciplinas = $this->service->listar($request->query('search'));

        return DisciplinaResource::collection($disciplinas);
    }

    public function store(StoreDisciplinaRequest $request)
    {
        $disciplina = $this->service->criar($request->validated());

        return new DisciplinaResource($disciplina);
    }

    public function show(Disciplina $disciplina)
    {
        return new DisciplinaResource($disciplina);
    }

    public function update(UpdateDisciplinaRequest $request, Disciplina $disciplina)
    {
        $disciplinaAtualizada = $this->service->atualizar(
            $disciplina,
            $request->validated()
        );

        return new DisciplinaResource($disciplinaAtualizada);
    }

    public function destroy(Disciplina $disciplina): JsonResponse
    {
        $this->service->excluir($disciplina);

        return response()->json([
            'message' => 'Disciplina excluída com sucesso.',
        ]);
    }
}
