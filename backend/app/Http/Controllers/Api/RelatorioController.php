<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Disciplina;
use App\Services\RelatorioService;
use Illuminate\Http\JsonResponse;

class RelatorioController extends Controller
{
    public function __construct(
        private readonly RelatorioService $service
    ) {
    }

    public function resumo(): JsonResponse
    {
        return response()->json($this->service->resumo());
    }

    public function geral(): JsonResponse
    {
        return response()->json($this->service->resumo());
    }

    public function porDisciplina(Disciplina $disciplina): JsonResponse
    {
        return response()->json($this->service->porDisciplina($disciplina));
    }
}
