<?php

namespace App\Services;

use App\Models\Disciplina;
use App\Repositories\DisciplinaRepository;
use Illuminate\Database\Eloquent\Collection;

class DisciplinaService
{
    public function __construct(
        private readonly DisciplinaRepository $repository
    ) {
    }

    public function listar(?string $search = null): Collection
    {
        return $this->repository->all($search);
    }

    public function buscar(int $id): Disciplina
    {
        return $this->repository->find($id);
    }

    public function criar(array $data): Disciplina
    {
        return $this->repository->create($data);
    }

    public function atualizar(Disciplina $disciplina, array $data): Disciplina
    {
        return $this->repository->update($disciplina, $data);
    }

    public function excluir(Disciplina $disciplina): void
    {
        $this->repository->delete($disciplina);
    }
}
