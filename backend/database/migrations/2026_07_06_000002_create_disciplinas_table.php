<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disciplinas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 20)->unique();
            $table->string('nome', 150);
            $table->integer('carga_horaria');
            $table->integer('vagas');
            $table->string('professor', 150)->nullable();
            $table->string('curso', 100)->nullable();
            $table->string('periodo', 20);
            $table->string('departamento', 80)->nullable();
            $table->string('status', 20)->default('ativa');
            $table->text('descricao')->nullable();
            $table->text('ementa')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disciplinas');
    }
};
