<?php

namespace App\Services;

use App\Models\Usuario;
use App\Repositories\UsuarioRepository;
use Illuminate\Database\Eloquent\Collection;

class UsuarioService
{
    public function __construct(
        private readonly UsuarioRepository $repository
    ) {
    }

    public function listar(?string $perfil = null): Collection
    {
        return $this->repository->all($perfil);
    }

    public function buscar(int $id): Usuario
    {
        return $this->repository->find($id);
    }

    public function criar(array $data): Usuario
    {
        return $this->repository->create($data);
    }

    public function atualizar(Usuario $usuario, array $data): Usuario
    {
        return $this->repository->update($usuario, $data);
    }

    public function excluir(Usuario $usuario): void
    {
        $this->repository->delete($usuario);
    }
}
