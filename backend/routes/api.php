<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DisciplinaController;
use App\Http\Controllers\Api\InteresseController;
use App\Http\Controllers\Api\MatriculaController;
use App\Http\Controllers\Api\RelatorioController;
use App\Http\Controllers\Api\UsuarioController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::apiResource('usuarios', UsuarioController::class);
Route::apiResource('disciplinas', DisciplinaController::class);

Route::get('/interesses', [InteresseController::class, 'index']);
Route::post('/interesses', [InteresseController::class, 'store']);
Route::delete('/interesses/{interesse}', [InteresseController::class, 'destroy']);

Route::get('/matriculas', [MatriculaController::class, 'index']);
Route::post('/matriculas', [MatriculaController::class, 'store']);
Route::delete('/matriculas/{matricula}', [MatriculaController::class, 'destroy']);

Route::get('/relatorios/resumo', [RelatorioController::class, 'resumo']);
Route::get('/relatorios/geral', [RelatorioController::class, 'geral']);
Route::get('/relatorios/disciplinas/{disciplina}', [RelatorioController::class, 'porDisciplina']);
