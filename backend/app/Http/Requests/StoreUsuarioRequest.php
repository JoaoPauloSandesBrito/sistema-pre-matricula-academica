<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'firebase_uid' => ['nullable', 'string', 'max:128', 'unique:usuarios,firebase_uid'],
            'nome' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150', 'unique:usuarios,email'],
            'matricula' => ['nullable', 'string', 'max:20', 'unique:usuarios,matricula'],
            'curso' => ['nullable', 'string', 'max:100'],
            'perfil' => ['required', 'in:aluno,secretaria'],
            'status' => ['boolean'],
        ];
    }
}
