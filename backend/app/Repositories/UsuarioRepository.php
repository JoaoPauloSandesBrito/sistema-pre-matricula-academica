<?php

namespace App\Repositories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;

class UsuarioRepository
{
    public function all(?string $perfil = null): Collection
    {
        return Usuario::query()
            ->when($perfil, fn ($query) => $query->where('perfil', $perfil))
            ->orderBy('nome')
            ->get();
    }

    public function find(int $id): Usuario
    {
        return Usuario::findOrFail($id);
    }

    public function create(array $data): Usuario
    {
        return Usuario::create($data);
    }

    public function update(Usuario $usuario, array $data): Usuario
    {
        $usuario->update($data);

        return $usuario->fresh();
    }

    public function delete(Usuario $usuario): void
    {
        $usuario->delete();
    }
}
