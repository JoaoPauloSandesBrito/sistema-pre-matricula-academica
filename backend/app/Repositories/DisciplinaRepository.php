<?php

namespace App\Repositories;

use App\Models\Disciplina;
use Illuminate\Database\Eloquent\Collection;

class DisciplinaRepository
{
    public function all(?string $search = null): Collection
    {
        return Disciplina::query()
            ->when($search, function ($query) use ($search) {
                $query->where('nome', 'ilike', "%{$search}%")
                    ->orWhere('codigo', 'ilike', "%{$search}%");
            })
            ->orderBy('codigo')
            ->get();
    }

    public function find(int $id): Disciplina
    {
        return Disciplina::findOrFail($id);
    }

    public function create(array $data): Disciplina
    {
        return Disciplina::create($data);
    }

    public function update(Disciplina $disciplina, array $data): Disciplina
    {
        $disciplina->update($data);

        return $disciplina->fresh();
    }

    public function delete(Disciplina $disciplina): void
    {
        $disciplina->delete();
    }
}
