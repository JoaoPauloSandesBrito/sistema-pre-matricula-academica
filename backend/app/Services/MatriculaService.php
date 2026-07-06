<?php

namespace App\Services;

use App\Models\Disciplina;
use App\Models\Interesse;
use App\Models\Matricula;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MatriculaService
{
    public function listar(): Collection
    {
        return Matricula::query()
            ->with(['usuario', 'disciplina'])
            ->orderByDesc('data_matricula')
            ->get();
    }

    public function criar(array $data): Matricula
    {
        return DB::transaction(function () use ($data) {
            $disciplina = Disciplina::lockForUpdate()->findOrFail($data['disciplina_id']);

            if ($disciplina->vagas <= 0) {
                throw ValidationException::withMessages([
                    'disciplina_id' => 'Não há vagas disponíveis para esta disciplina.',
                ]);
            }

            $exists = Matricula::where('usuario_id', $data['usuario_id'])
                ->where('disciplina_id', $data['disciplina_id'])
                ->exists();

            if ($exists) {
                throw ValidationException::withMessages([
                    'disciplina_id' => 'Este aluno já possui matrícula nesta disciplina.',
                ]);
            }

            $matricula = Matricula::create([
                'usuario_id' => $data['usuario_id'],
                'disciplina_id' => $data['disciplina_id'],
                'interesse_id' => $data['interesse_id'] ?? null,
                'semestre' => $data['semestre'] ?? '2026.2',
                'status' => 'ativa',
            ]);

            $disciplina->decrement('vagas');

            if (!empty($data['interesse_id'])) {
                Interesse::where('id', $data['interesse_id'])->update([
                    'status' => 'matriculado',
                ]);
            }

            return $matricula->load(['usuario', 'disciplina']);
        });
    }

    public function cancelar(Matricula $matricula): void
    {
        DB::transaction(function () use ($matricula) {
            $interesseId = $matricula->interesse_id;

            $matricula->disciplina()->increment('vagas');
            $matricula->delete();

            if ($interesseId) {
                Interesse::where('id', $interesseId)->update([
                    'status' => 'pendente',
                ]);
            }
        });
    }
}
