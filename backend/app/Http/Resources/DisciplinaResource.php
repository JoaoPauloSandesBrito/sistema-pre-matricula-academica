<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DisciplinaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'codigo' => $this->codigo,
            'nome' => $this->nome,
            'carga_horaria' => $this->carga_horaria,
            'vagas' => $this->vagas,
            'professor' => $this->professor,
            'curso' => $this->curso,
            'periodo' => $this->periodo,
            'departamento' => $this->departamento,
            'status' => $this->status,
            'descricao' => $this->descricao,
            'ementa' => $this->ementa,
        ];
    }
}
