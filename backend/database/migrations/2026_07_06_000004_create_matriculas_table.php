<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matriculas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->cascadeOnDelete();
            $table->foreignId('disciplina_id')->constrained('disciplinas')->cascadeOnDelete();
            $table->foreignId('interesse_id')
                ->nullable()
                ->unique()
                ->constrained('interesses')
                ->nullOnDelete();
            $table->timestamp('data_matricula')->useCurrent();
            $table->string('semestre', 20);
            $table->string('status', 20)->default('ativa');
            $table->timestamps();

            $table->unique(['usuario_id', 'disciplina_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matriculas');
    }
};
