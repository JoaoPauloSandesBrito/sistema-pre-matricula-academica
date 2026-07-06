<?php

namespace App\Services;

use App\Models\Disciplina;
use App\Models\Interesse;
use App\Models\Matricula;
use App\Models\Usuario;
use Illuminate\Support\Collection;

class RelatorioService
{
    public function resumo(): array
    {
        $disciplinas = Disciplina::query()
            ->withCount([
                'interesses',
                'matriculas',
            ])
            ->orderBy('codigo')
            ->get();

        return [
            'gerado_em' => now()->toDateTimeString(),
            'indicadores' => $this->indicadoresGerais($disciplinas),
            'status_interesses' => $this->contarPorStatus(Interesse::query()->pluck('status')),
            'status_matriculas' => $this->contarPorStatus(Matricula::query()->pluck('status')),
            'ranking_disciplinas' => $this->rankingDisciplinas($disciplinas),
            'disciplinas_com_vagas' => $this->disciplinasComVagas($disciplinas),
            'disciplinas_alta_demanda' => $this->disciplinasAltaDemanda($disciplinas),
            'disciplinas_sem_interesse' => $this->disciplinasSemInteresse($disciplinas),
            'alunos_por_curso' => $this->alunosPorCurso(),
            'disciplinas' => $this->disciplinasResumo($disciplinas),
        ];
    }

    public function porDisciplina(Disciplina $disciplina): array
    {
        $disciplina->load([
            'interesses.usuario',
            'matriculas.usuario',
        ]);

        $matriculasPorUsuario = $disciplina->matriculas->keyBy('usuario_id');

        $alunosInscritos = $disciplina->interesses
            ->sortBy([
                fn (Interesse $a, Interesse $b) => $a->data_interesse <=> $b->data_interesse,
                fn (Interesse $a, Interesse $b) => ($a->usuario?->nome ?? '') <=> ($b->usuario?->nome ?? ''),
            ])
            ->values()
            ->map(function (Interesse $interesse, int $index) use ($matriculasPorUsuario) {
                $matricula = $matriculasPorUsuario->get($interesse->usuario_id);
                $usuario = $interesse->usuario;
                $situacaoFinal = $matricula
                    ? ($matricula->status ?: 'matriculado')
                    : ($interesse->status ?: 'pendente');

                return [
                    'ordem' => $index + 1,
                    'interesse_id' => $interesse->id,
                    'usuario_id' => $usuario?->id,
                    'nome' => $usuario?->nome,
                    'matricula' => $usuario?->matricula,
                    'email' => $usuario?->email,
                    'curso' => $usuario?->curso,
                    'usuario_status' => $usuario?->status ? 'ativo' : 'inativo',
                    'data_interesse' => $interesse->data_interesse,
                    'status_interesse' => $interesse->status,
                    'matricula_confirmada' => (bool) $matricula,
                    'data_matricula' => $matricula?->data_matricula,
                    'semestre' => $matricula?->semestre,
                    'status_matricula' => $matricula?->status,
                    'situacao_final' => $situacaoFinal,
                ];
            });

        $totais = $this->totaisDisciplina($disciplina, $alunosInscritos);

        return [
            'gerado_em' => now()->toDateTimeString(),
            'tipo' => 'disciplina',
            'disciplina' => $this->dadosDisciplina($disciplina),
            'totais' => $totais,
            'analise' => $this->analiseDisciplina($totais),
            'alunos_inscritos' => $alunosInscritos,
        ];
    }

    private function indicadoresGerais(Collection $disciplinas): array
    {
        $totalAlunos = Usuario::where('perfil', 'aluno')->count();
        $alunosAtivos = Usuario::where('perfil', 'aluno')->where('status', true)->count();
        $totalDisciplinas = $disciplinas->count();
        $totalInteresses = Interesse::count();
        $totalMatriculas = Matricula::count();
        $vagasDisponiveis = (int) $disciplinas->sum('vagas');
        $capacidadeEstimada = (int) $disciplinas->sum(function (Disciplina $disciplina) {
            return $this->capacidadeEstimada($disciplina);
        });
        $disciplinasComInteresse = $disciplinas->where('interesses_count', '>', 0)->count();
        $alunosComInteresse = Interesse::query()->distinct('usuario_id')->count('usuario_id');

        return [
            'total_alunos' => $totalAlunos,
            'alunos_ativos' => $alunosAtivos,
            'alunos_inativos' => max($totalAlunos - $alunosAtivos, 0),
            'total_disciplinas' => $totalDisciplinas,
            'disciplinas_ativas' => $disciplinas->where('status', 'ativa')->count(),
            'disciplinas_com_interesse' => $disciplinasComInteresse,
            'disciplinas_sem_interesse' => max($totalDisciplinas - $disciplinasComInteresse, 0),
            'total_interesses' => $totalInteresses,
            'total_matriculas' => $totalMatriculas,
            'alunos_com_interesse' => $alunosComInteresse,
            'alunos_sem_interesse' => max($totalAlunos - $alunosComInteresse, 0),
            'vagas_disponiveis' => $vagasDisponiveis,
            'capacidade_estimada' => $capacidadeEstimada,
            'taxa_ocupacao' => $this->percentual($totalMatriculas, $capacidadeEstimada),
            'taxa_demanda' => $this->percentual($totalInteresses, $capacidadeEstimada),
            'media_interesses_por_disciplina' => $this->media($totalInteresses, $totalDisciplinas),
        ];
    }

    private function disciplinasResumo(Collection $disciplinas): Collection
    {
        return $disciplinas->map(function (Disciplina $disciplina) {
            $capacidade = $this->capacidadeEstimada($disciplina);

            return [
                'id' => $disciplina->id,
                'codigo' => $disciplina->codigo,
                'nome' => $disciplina->nome,
                'carga_horaria' => $disciplina->carga_horaria,
                'vagas' => $disciplina->vagas,
                'professor' => $disciplina->professor,
                'periodo' => $disciplina->periodo,
                'status' => $disciplina->status,
                'total_interesses' => $disciplina->interesses_count,
                'total_matriculas' => $disciplina->matriculas_count,
                'capacidade_estimada' => $capacidade,
                'taxa_demanda' => $this->percentual($disciplina->interesses_count, $capacidade),
                'taxa_ocupacao' => $this->percentual($disciplina->matriculas_count, $capacidade),
                'demanda_por_vaga' => $this->razao($disciplina->interesses_count, $capacidade),
            ];
        })->values();
    }

    private function rankingDisciplinas(Collection $disciplinas): Collection
    {
        return $this->disciplinasResumo($disciplinas)
            ->sortByDesc('total_interesses')
            ->values();
    }

    private function disciplinasComVagas(Collection $disciplinas): Collection
    {
        return $this->disciplinasResumo($disciplinas)
            ->filter(fn (array $disciplina) => $disciplina['vagas'] > 0)
            ->sortByDesc('vagas')
            ->values();
    }

    private function disciplinasAltaDemanda(Collection $disciplinas): Collection
    {
        return $this->disciplinasResumo($disciplinas)
            ->filter(fn (array $disciplina) => $disciplina['taxa_demanda'] >= 80)
            ->sortByDesc('taxa_demanda')
            ->values();
    }

    private function disciplinasSemInteresse(Collection $disciplinas): Collection
    {
        return $this->disciplinasResumo($disciplinas)
            ->filter(fn (array $disciplina) => $disciplina['total_interesses'] === 0)
            ->values();
    }

    private function alunosPorCurso(): Collection
    {
        return Usuario::query()
            ->selectRaw('COALESCE(curso, ?) as curso, COUNT(*) as total', ['Não informado'])
            ->where('perfil', 'aluno')
            ->groupBy('curso')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($item) => [
                'curso' => $item->curso,
                'total' => (int) $item->total,
            ]);
    }

    private function contarPorStatus(Collection $status): array
    {
        return $status
            ->map(fn (?string $value) => $value ?: 'não informado')
            ->countBy()
            ->sortKeys()
            ->toArray();
    }

    private function totaisDisciplina(Disciplina $disciplina, Collection $alunosInscritos): array
    {
        $matriculasConfirmadas = $alunosInscritos
            ->where('matricula_confirmada', true)
            ->count();
        $inscritos = $alunosInscritos->count();
        $pendentes = $alunosInscritos
            ->where('matricula_confirmada', false)
            ->count();
        $capacidade = $this->capacidadeEstimada($disciplina);
        $vagasDisponiveis = (int) $disciplina->vagas;

        return [
            'inscritos' => $inscritos,
            'pendentes' => $pendentes,
            'matriculas_confirmadas' => $matriculasConfirmadas,
            'vagas_disponiveis' => $vagasDisponiveis,
            'capacidade_estimada' => $capacidade,
            'vagas_ocupadas' => $matriculasConfirmadas,
            'excedente_demanda' => max($inscritos - $capacidade, 0),
            'taxa_demanda' => $this->percentual($inscritos, $capacidade),
            'taxa_ocupacao' => $this->percentual($matriculasConfirmadas, $capacidade),
            'demanda_por_vaga' => $this->razao($inscritos, $capacidade),
        ];
    }

    private function dadosDisciplina(Disciplina $disciplina): array
    {
        return [
            'id' => $disciplina->id,
            'codigo' => $disciplina->codigo,
            'nome' => $disciplina->nome,
            'carga_horaria' => $disciplina->carga_horaria,
            'vagas' => $disciplina->vagas,
            'professor' => $disciplina->professor,
            'curso' => $disciplina->curso,
            'periodo' => $disciplina->periodo,
            'departamento' => $disciplina->departamento,
            'status' => $disciplina->status,
            'descricao' => $disciplina->descricao,
            'ementa' => $disciplina->ementa,
        ];
    }

    private function analiseDisciplina(array $totais): array
    {
        $taxaDemanda = $totais['taxa_demanda'];
        $taxaOcupacao = $totais['taxa_ocupacao'];
        $excedente = $totais['excedente_demanda'];

        if ($excedente > 0) {
            return [
                'classificacao_demanda' => 'Demanda acima da capacidade',
                'classificacao_ocupacao' => $this->classificarOcupacao($taxaOcupacao),
                'recomendacao' => 'Avaliar abertura de nova turma, ampliação de vagas ou critérios de prioridade para matrícula.',
            ];
        }

        if ($taxaDemanda >= 80) {
            return [
                'classificacao_demanda' => 'Alta demanda',
                'classificacao_ocupacao' => $this->classificarOcupacao($taxaOcupacao),
                'recomendacao' => 'Acompanhar a confirmação das matrículas e monitorar possíveis desistências.',
            ];
        }

        if ($taxaDemanda >= 40) {
            return [
                'classificacao_demanda' => 'Demanda moderada',
                'classificacao_ocupacao' => $this->classificarOcupacao($taxaOcupacao),
                'recomendacao' => 'Manter a oferta planejada e acompanhar novos interesses durante o período aberto.',
            ];
        }

        return [
            'classificacao_demanda' => 'Baixa demanda',
            'classificacao_ocupacao' => $this->classificarOcupacao($taxaOcupacao),
            'recomendacao' => 'Verificar necessidade de divulgação da disciplina ou revisão da oferta para o período.',
        ];
    }

    private function classificarOcupacao(float $taxa): string
    {
        if ($taxa >= 90) {
            return 'Quase lotada';
        }

        if ($taxa >= 60) {
            return 'Boa ocupação';
        }

        if ($taxa > 0) {
            return 'Ocupação parcial';
        }

        return 'Sem matrículas confirmadas';
    }

    private function capacidadeEstimada(Disciplina $disciplina): int
    {
        return max((int) $disciplina->vagas + (int) ($disciplina->matriculas_count ?? $disciplina->matriculas()->count()), 0);
    }

    private function percentual(int|float $parte, int|float $total): float
    {
        if ($total <= 0) {
            return 0.0;
        }

        return round(($parte / $total) * 100, 1);
    }

    private function razao(int|float $parte, int|float $total): float
    {
        if ($total <= 0) {
            return 0.0;
        }

        return round($parte / $total, 2);
    }
}
