<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDisciplinaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('disciplina')?->id ?? $this->route('disciplina');

        return [
            'codigo' => [
                'sometimes',
                'required',
                'string',
                'max:20',
                Rule::unique('disciplinas', 'codigo')->ignore($id),
            ],
            'nome' => ['sometimes', 'required', 'string', 'max:150'],
            'carga_horaria' => ['sometimes', 'required', 'integer', 'min:1'],
            'vagas' => ['sometimes', 'required', 'integer', 'min:0'],
            'professor' => ['nullable', 'string', 'max:150'],
            'curso' => ['nullable', 'string', 'max:100'],
            'periodo' => ['sometimes', 'required', 'string', 'max:20'],
            'departamento' => ['nullable', 'string', 'max:80'],
            'status' => ['nullable', 'string', 'max:20'],
            'descricao' => ['nullable', 'string'],
            'ementa' => ['nullable', 'string'],
        ];
    }
}
