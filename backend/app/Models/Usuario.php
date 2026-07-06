<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Usuario extends Model
{
    use HasFactory;

    protected $table = 'usuarios';

    protected $fillable = [
        'firebase_uid',
        'nome',
        'email',
        'matricula',
        'curso',
        'perfil',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
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
