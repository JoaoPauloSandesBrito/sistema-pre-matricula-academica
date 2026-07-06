<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDisciplinaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'codigo' => ['required', 'string', 'max:20', 'unique:disciplinas,codigo'],
            'nome' => ['required', 'string', 'max:150'],
            'carga_horaria' => ['required', 'integer', 'min:1'],
            'vagas' => ['required', 'integer', 'min:0'],
            'professor' => ['nullable', 'string', 'max:150'],
            'curso' => ['nullable', 'string', 'max:100'],
            'periodo' => ['required', 'string', 'max:20'],
            'departamento' => ['nullable', 'string', 'max:80'],
            'status' => ['nullable', 'string', 'max:20'],
            'descricao' => ['nullable', 'string'],
            'ementa' => ['nullable', 'string'],
        ];
    }
}
