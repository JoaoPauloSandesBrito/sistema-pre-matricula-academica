<?php

namespace Database\Seeders;

use App\Models\Disciplina;
use App\Models\Interesse;
use App\Models\Matricula;
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $alunoJoao = Usuario::create([
            'firebase_uid' => 'demo-firebase-uid',
            'nome' => 'João Paulo Sandes Brito',
            'email' => '202110811@uesb.edu.br',
            'matricula' => '202110811',
            'curso' => 'Ciência da Computação',
            'perfil' => 'aluno',
            'status' => true,
        ]);

        $alunoIvana = Usuario::create([
            'firebase_uid' => 'demo-aluno-ivana',
            'nome' => 'Ivana Souza Santos',
            'email' => '202110812@uesb.edu.br',
            'matricula' => '202110812',
            'curso' => 'Ciência da Computação',
            'perfil' => 'aluno',
            'status' => true,
        ]);

        $alunoVitor = Usuario::create([
            'firebase_uid' => 'demo-aluno-vitor',
            'nome' => 'João Vitor Oliveira',
            'email' => '202110813@uesb.edu.br',
            'matricula' => '202110813',
            'curso' => 'Ciência da Computação',
            'perfil' => 'aluno',
            'status' => true,
        ]);

        Usuario::create([
            'firebase_uid' => 'demo-secretaria-uid',
            'nome' => 'Secretaria Acadêmica',
            'email' => 'secretaria@uesb.edu.br',
            'matricula' => null,
            'curso' => 'Administração Acadêmica',
            'perfil' => 'secretaria',
            'status' => true,
        ]);

        $bd1 = Disciplina::create([
            'codigo' => 'BD001',
            'nome' => 'Banco de Dados 01',
            'carga_horaria' => 60,
            'vagas' => 44,
            'professor' => 'Stênio Longo Araújo',
            'curso' => 'Ciência da Computação',
            'periodo' => '4º semestre',
            'departamento' => 'DCET',
            'status' => 'ativa',
            'descricao' => 'Introdução aos fundamentos de bancos de dados relacionais.',
            'ementa' => 'MER, modelo relacional, SQL, normalização e transações.',
        ]);

        Disciplina::create([
            'codigo' => 'BD002',
            'nome' => 'Banco de Dados 02',
            'carga_horaria' => 60,
            'vagas' => 23,
            'professor' => 'Stênio Longo Araújo',
            'curso' => 'Ciência da Computação',
            'periodo' => '5º semestre',
            'departamento' => 'DCET',
            'status' => 'ativa',
            'descricao' => 'Tópicos avançados em bancos de dados.',
            'ementa' => 'Índices, otimização, triggers, procedures e concorrência.',
        ]);

        $redes = Disciplina::create([
            'codigo' => 'RD001',
            'nome' => 'Redes 01',
            'carga_horaria' => 90,
            'vagas' => 30,
            'professor' => 'Docente do DCET',
            'curso' => 'Ciência da Computação',
            'periodo' => '5º semestre',
            'departamento' => 'DCET',
            'status' => 'ativa',
            'descricao' => 'Fundamentos de redes de computadores.',
            'ementa' => 'Modelo OSI/TCP-IP, transporte, rede, enlace e roteamento.',
        ]);

        Interesse::create([
            'usuario_id' => $alunoJoao->id,
            'disciplina_id' => $bd1->id,
            'status' => 'pendente',
        ]);

        $interesseIvana = Interesse::create([
            'usuario_id' => $alunoIvana->id,
            'disciplina_id' => $bd1->id,
            'status' => 'matriculado',
        ]);

        Interesse::create([
            'usuario_id' => $alunoVitor->id,
            'disciplina_id' => $bd1->id,
            'status' => 'pendente',
        ]);

        Interesse::create([
            'usuario_id' => $alunoJoao->id,
            'disciplina_id' => $redes->id,
            'status' => 'pendente',
        ]);

        Matricula::create([
            'usuario_id' => $alunoIvana->id,
            'disciplina_id' => $bd1->id,
            'interesse_id' => $interesseIvana->id,
            'semestre' => '2026.2',
            'status' => 'ativa',
        ]);
    }
}
