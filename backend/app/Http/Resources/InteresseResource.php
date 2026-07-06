<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InteresseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'usuario_id' => $this->usuario_id,
            'disciplina_id' => $this->disciplina_id,
            'data_interesse' => $this->data_interesse,
            'status' => $this->status,
            'usuario' => new UsuarioResource($this->whenLoaded('usuario')),
            'disciplina' => new DisciplinaResource($this->whenLoaded('disciplina')),
        ];
    }
}
