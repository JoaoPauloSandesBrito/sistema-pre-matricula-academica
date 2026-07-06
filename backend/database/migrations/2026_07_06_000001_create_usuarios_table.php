<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('firebase_uid', 128)->nullable()->unique();
            $table->string('nome', 150);
            $table->string('email', 150)->unique();
            $table->string('matricula', 20)->nullable()->unique();
            $table->string('curso', 100)->nullable();
            $table->string('perfil', 20)->default('aluno');
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
