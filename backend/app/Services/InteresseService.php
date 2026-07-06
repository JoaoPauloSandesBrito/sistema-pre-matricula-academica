<?php

namespace App\Services;

use App\Models\Interesse;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class InteresseService
{
    public function listar(?int $usuarioId = null): Collection
    {
        return Interesse::query()
            ->with(['usuario', 'disciplina'])
            ->when($usuarioId, fn ($query) => $query->where('usuario_id', $usuarioId))
            ->orderByDesc('data_interesse')
            ->get();
    }

    public function criar(array $data): Interesse
    {
        $exists = Interesse::where('usuario_id', $data['usuario_id'])
            ->where('disciplina_id', $data['disciplina_id'])
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'disciplina_id' => 'Este aluno já registrou interesse nessa disciplina.',
            ]);
        }

        return Interesse::create([
            'usuario_id' => $data['usuario_id'],
            'disciplina_id' => $data['disciplina_id'],
            'status' => 'pendente',
        ])->load(['usuario', 'disciplina']);
    }

    public function excluir(Interesse $interesse): void
    {
        if ($interesse->status === 'matriculado') {
            throw ValidationException::withMessages([
                'interesse' => 'Não é possível retirar interesse já convertido em matrícula.',
            ]);
        }

        $interesse->delete();
    }
}
