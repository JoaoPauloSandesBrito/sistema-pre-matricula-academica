<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Disciplina extends Model
{
    use HasFactory;

    protected $table = 'disciplinas';

    protected $fillable = [
        'codigo',
        'nome',
        'carga_horaria',
        'vagas',
        'professor',
        'curso',
        'periodo',
        'departamento',
        'status',
        'descricao',
        'ementa',
    ];

    public function interesses(): HasMany
    {
        return $this->hasMany(Interesse::class);
    }

    public function matriculas(): HasMany
    {
        return $this->hasMany(Matricula::class);
    }
}
