<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UsuarioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'firebase_uid' => $this->firebase_uid,
            'nome' => $this->nome,
            'email' => $this->email,
            'matricula' => $this->matricula,
            'curso' => $this->curso,
            'perfil' => $this->perfil,
            'status' => $this->status,
        ];
    }
}
