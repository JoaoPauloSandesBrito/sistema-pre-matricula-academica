<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('usuario')?->id ?? $this->route('usuario');

        return [
            'firebase_uid' => [
                'nullable',
                'string',
                'max:128',
                Rule::unique('usuarios', 'firebase_uid')->ignore($id),
            ],
            'nome' => ['sometimes', 'required', 'string', 'max:150'],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:150',
                Rule::unique('usuarios', 'email')->ignore($id),
            ],
            'matricula' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('usuarios', 'matricula')->ignore($id),
            ],
            'curso' => ['nullable', 'string', 'max:100'],
            'perfil' => ['sometimes', 'required', 'in:aluno,secretaria'],
            'status' => ['boolean'],
        ];
    }
}
