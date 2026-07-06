import { useEffect, useMemo, useState } from 'react';

import Icon from '../../components/Icon/Icon';
import Card from '../../components/Card/Card';
import Table from '../../components/Table/Table';
import {
  mockAlunos,
  mockDisciplinas,
  mockInteresses,
  mockMatriculas,
} from '../../data/mockData';
import {
  buscarRelatorioDisciplina,
  buscarRelatorioGeral,
  buscarResumoRelatorios,
} from '../../services/relatorioService';

function formatarData(data) {
  if (!data) {
    return '-';
  }

  return new Date(data).toLocaleDateString('pt-BR');
}

function formatarDataHora(data) {
  if (!data) {
    return '-';
  }

  return new Date(data).toLocaleString('pt-BR');
}

function formatarNumero(valor) {
  return Number(valor || 0).toLocaleString('pt-BR');
}

function formatarPercentual(valor) {
  return `${Number(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

function formatarRazao(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function calcularPercentual(parte, total) {
  if (!total || Number(total) <= 0) {
    return 0;
  }

  return Math.round((Number(parte || 0) / Number(total)) * 1000) / 10;
}

function normalizarStatus(status) {
  return String(status || 'pendente')
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll('í', 'i')
    .replaceAll('á', 'a')
    .replaceAll('ã', 'a')
    .replaceAll('ç', 'c');
}

function contarPorStatus(lista, campo = 'status') {
  return lista.reduce((acc, item) => {
    const status = item[campo] || 'não informado';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
}

function capacidadeEstimadaDisciplina(disciplina) {
  const matriculas = mockMatriculas.filter(
    (matricula) => Number(matricula.disciplina_id) === Number(disciplina.id)
  ).length;

  return Number(disciplina.vagas || 0) + matriculas;
}

function gerarResumoDisciplinasLocal() {
  return mockDisciplinas.map((disciplina) => {
    const totalInteresses = mockInteresses.filter(
      (interesse) => Number(interesse.disciplina_id) === Number(disciplina.id)
    ).length;
    const totalMatriculas = mockMatriculas.filter(
      (matricula) => Number(matricula.disciplina_id) === Number(disciplina.id)
    ).length;
    const capacidade = capacidadeEstimadaDisciplina(disciplina);

    return {
      ...disciplina,
      total_interesses: totalInteresses,
      total_matriculas: totalMatriculas,
      capacidade_estimada: capacidade,
      taxa_demanda: calcularPercentual(totalInteresses, capacidade),
      taxa_ocupacao: calcularPercentual(totalMatriculas, capacidade),
      demanda_por_vaga: capacidade ? totalInteresses / capacidade : 0,
    };
  });
}

function gerarRelatorioGeralLocal() {
  const disciplinas = gerarResumoDisciplinasLocal();
  const totalAlunos = mockAlunos.filter((aluno) => aluno.perfil === 'aluno').length;
  const totalInteresses = mockInteresses.length;
  const totalMatriculas = mockMatriculas.length;
  const capacidadeEstimada = disciplinas.reduce(
    (total, disciplina) => total + Number(disciplina.capacidade_estimada || 0),
    0
  );
  const alunosComInteresse = new Set(
    mockInteresses.map((interesse) => interesse.usuario_id)
  ).size;

  return {
    gerado_em: new Date().toISOString(),
    indicadores: {
      total_alunos: totalAlunos,
      alunos_ativos: mockAlunos.filter((aluno) => aluno.status).length,
      alunos_inativos: mockAlunos.filter((aluno) => !aluno.status).length,
      total_disciplinas: mockDisciplinas.length,
      disciplinas_ativas: mockDisciplinas.filter(
        (disciplina) => disciplina.status === 'ativa'
      ).length,
      disciplinas_com_interesse: disciplinas.filter(
        (disciplina) => disciplina.total_interesses > 0
      ).length,
      disciplinas_sem_interesse: disciplinas.filter(
        (disciplina) => disciplina.total_interesses === 0
      ).length,
      total_interesses: totalInteresses,
      total_matriculas: totalMatriculas,
      alunos_com_interesse: alunosComInteresse,
      alunos_sem_interesse: Math.max(totalAlunos - alunosComInteresse, 0),
      vagas_disponiveis: disciplinas.reduce(
        (total, disciplina) => total + Number(disciplina.vagas || 0),
        0
      ),
      capacidade_estimada: capacidadeEstimada,
      taxa_ocupacao: calcularPercentual(totalMatriculas, capacidadeEstimada),
      taxa_demanda: calcularPercentual(totalInteresses, capacidadeEstimada),
      media_interesses_por_disciplina: disciplinas.length
        ? totalInteresses / disciplinas.length
        : 0,
    },
    status_interesses: contarPorStatus(mockInteresses),
    status_matriculas: contarPorStatus(mockMatriculas),
    ranking_disciplinas: [...disciplinas].sort(
      (a, b) => b.total_interesses - a.total_interesses
    ),
    disciplinas_com_vagas: disciplinas.filter((disciplina) => disciplina.vagas > 0),
    disciplinas_alta_demanda: disciplinas.filter(
      (disciplina) => disciplina.taxa_demanda >= 80
    ),
    disciplinas_sem_interesse: disciplinas.filter(
      (disciplina) => disciplina.total_interesses === 0
    ),
    alunos_por_curso: [
      {
        curso: 'Ciência da Computação',
        total: totalAlunos,
      },
    ],
    disciplinas,
  };
}

function gerarRelatorioLocal(disciplina) {
  const interesses = mockInteresses.filter(
    (item) => Number(item.disciplina_id) === Number(disciplina.id)
  );

  const alunosInscritos = interesses.map((interesse, index) => {
    const matricula = mockMatriculas.find(
      (item) =>
        Number(item.usuario_id) === Number(interesse.usuario_id) &&
        Number(item.disciplina_id) === Number(interesse.disciplina_id)
    );
    const situacaoFinal = matricula
      ? matricula.status || 'matriculado'
      : interesse.status || 'pendente';

    return {
      ordem: index + 1,
      interesse_id: interesse.id,
      usuario_id: interesse.usuario?.id,
      nome: interesse.usuario?.nome,
      matricula: interesse.usuario?.matricula,
      email: interesse.usuario?.email,
      curso: interesse.usuario?.curso,
      usuario_status: interesse.usuario?.status ? 'ativo' : 'inativo',
      data_interesse: interesse.data_interesse,
      status_interesse: interesse.status,
      matricula_confirmada: Boolean(matricula),
      data_matricula: matricula?.data_matricula,
      semestre: matricula?.semestre,
      status_matricula: matricula?.status,
      situacao_final: situacaoFinal,
    };
  });

  const capacidade = capacidadeEstimadaDisciplina(disciplina);
  const matriculasConfirmadas = alunosInscritos.filter(
    (aluno) => aluno.matricula_confirmada
  ).length;
  const taxaDemanda = calcularPercentual(alunosInscritos.length, capacidade);
  const taxaOcupacao = calcularPercentual(matriculasConfirmadas, capacidade);
  const excedenteDemanda = Math.max(alunosInscritos.length - capacidade, 0);

  return {
    gerado_em: new Date().toISOString(),
    tipo: 'disciplina',
    disciplina,
    totais: {
      inscritos: alunosInscritos.length,
      pendentes: alunosInscritos.filter((aluno) => !aluno.matricula_confirmada)
        .length,
      matriculas_confirmadas: matriculasConfirmadas,
      vagas_disponiveis: disciplina.vagas,
      capacidade_estimada: capacidade,
      vagas_ocupadas: matriculasConfirmadas,
      excedente_demanda: excedenteDemanda,
      taxa_demanda: taxaDemanda,
      taxa_ocupacao: taxaOcupacao,
      demanda_por_vaga: capacidade ? alunosInscritos.length / capacidade : 0,
    },
    analise: {
      classificacao_demanda:
        taxaDemanda >= 80 ? 'Alta demanda' : 'Demanda moderada ou baixa',
      classificacao_ocupacao:
        taxaOcupacao >= 80 ? 'Alta ocupação' : 'Ocupação parcial',
      recomendacao:
        taxaDemanda >= 80
          ? 'Acompanhar a confirmação das matrículas e avaliar necessidade de nova turma.'
          : 'Manter acompanhamento durante o período de pré-matrícula.',
    },
    alunos_inscritos: alunosInscritos,
  };
}

function normalizarResumo(data) {
  if (data?.indicadores) {
    return data;
  }

  const fallback = gerarRelatorioGeralLocal();
  const disciplinas = data?.disciplinas || fallback.disciplinas;

  return {
    ...fallback,
    gerado_em: data?.gerado_em || fallback.gerado_em,
    indicadores: {
      ...fallback.indicadores,
      total_alunos: data?.total_alunos ?? fallback.indicadores.total_alunos,
      total_disciplinas:
        data?.total_disciplinas ?? fallback.indicadores.total_disciplinas,
      total_interesses:
        data?.total_interesses ?? fallback.indicadores.total_interesses,
      total_matriculas:
        data?.total_matriculas ?? fallback.indicadores.total_matriculas,
      vagas_disponiveis: data?.total_vagas ?? fallback.indicadores.vagas_disponiveis,
    },
    disciplinas,
  };
}

function ReportMetric({ label, value, helper, icon }) {
  return (
    <div className="report-metric">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {helper && <small>{helper}</small>}
      </div>
      {icon && <Icon name={icon} />}
    </div>
  );
}

function ProgressBar({ label, value, helper }) {
  const percentage = Math.min(Math.max(Number(value || 0), 0), 100);

  return (
    <div className="report-progress-item">
      <div className="report-progress-header">
        <span>{label}</span>
        <strong>{formatarPercentual(value)}</strong>
      </div>

      <div className="report-progress-track">
        <div
          className="report-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {helper && <p>{helper}</p>}
    </div>
  );
}

function StatusDistribution({ title, items }) {
  const entries = Object.entries(items || {});

  return (
    <section className="report-section compact">
      <h3>{title}</h3>

      <div className="status-distribution">
        {entries.length === 0 && <p>Nenhum registro encontrado.</p>}

        {entries.map(([status, total]) => (
          <div key={status}>
            <span className={`status-pill ${normalizarStatus(status)}`}>
              {status}
            </span>
            <strong>{formatarNumero(total)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReportHeader({ titulo, subtitulo, geradoEm, onImprimir }) {
  return (
    <header className="report-header">
      <div>
        <p className="report-kicker">Universidade Estadual do Sudoeste da Bahia</p>
        <h2>{titulo}</h2>
        <p>{subtitulo}</p>
        <p className="report-generated-at">
          Gerado em {formatarDataHora(geradoEm)} pelo Sistema de Pré-Matrícula
          Acadêmica.
        </p>
      </div>

      <button
        type="button"
        className="btn btn-primary no-print"
        onClick={onImprimir}
      >
        <Icon name="print" />
        Imprimir relatório
      </button>
    </header>
  );
}

function RelatorioGeral({ relatorio, onImprimir }) {
  const indicadores = relatorio?.indicadores || {};
  const ranking = relatorio?.ranking_disciplinas || [];
  const altaDemanda = relatorio?.disciplinas_alta_demanda || [];
  const disciplinasSemInteresse = relatorio?.disciplinas_sem_interesse || [];
  const alunosPorCurso = relatorio?.alunos_por_curso || [];

  if (!relatorio) {
    return null;
  }

  return (
    <article className="print-area report-card report-rich">
      <ReportHeader
        titulo="Relatório geral de pré-matrícula"
        subtitulo="Visão consolidada dos alunos, disciplinas, interesses, matrículas, vagas e demanda acadêmica."
        geradoEm={relatorio.gerado_em}
        onImprimir={onImprimir}
      />

      <section className="report-section">
        <h3>Resumo executivo</h3>

        <div className="report-metric-grid">
          <ReportMetric
            label="Alunos cadastrados"
            value={formatarNumero(indicadores.total_alunos)}
            helper={`${formatarNumero(indicadores.alunos_ativos)} ativos`}
            icon="groups"
          />
          <ReportMetric
            label="Disciplinas ofertadas"
            value={formatarNumero(indicadores.total_disciplinas)}
            helper={`${formatarNumero(indicadores.disciplinas_ativas)} ativas`}
            icon="menu_book"
          />
          <ReportMetric
            label="Interesses registrados"
            value={formatarNumero(indicadores.total_interesses)}
            helper={`${formatarNumero(indicadores.alunos_com_interesse)} alunos com interesse`}
            icon="how_to_reg"
          />
          <ReportMetric
            label="Matrículas efetivadas"
            value={formatarNumero(indicadores.total_matriculas)}
            helper={`${formatarPercentual(indicadores.taxa_ocupacao)} de ocupação`}
            icon="task_alt"
          />
          <ReportMetric
            label="Vagas disponíveis"
            value={formatarNumero(indicadores.vagas_disponiveis)}
            helper={`${formatarNumero(indicadores.capacidade_estimada)} vagas estimadas no total`}
            icon="event_seat"
          />
          <ReportMetric
            label="Média de interesses"
            value={formatarRazao(indicadores.media_interesses_por_disciplina)}
            helper="Interesses por disciplina"
            icon="analytics"
          />
        </div>
      </section>

      <section className="report-section report-two-columns">
        <div>
          <h3>Leitura dos indicadores</h3>
          <div className="report-analysis-box">
            <ProgressBar
              label="Taxa de demanda"
              value={indicadores.taxa_demanda}
              helper="Percentual de interesses registrados em relação à capacidade estimada."
            />
            <ProgressBar
              label="Taxa de ocupação"
              value={indicadores.taxa_ocupacao}
              helper="Percentual de matrículas confirmadas em relação à capacidade estimada."
            />
          </div>
        </div>

        <div>
          <h3>Situação acadêmica</h3>
          <div className="report-analysis-box">
            <p>
              <strong>{formatarNumero(indicadores.alunos_sem_interesse)}</strong>{' '}
              aluno(s) ainda não registraram interesse em disciplinas.
            </p>
            <p>
              <strong>{formatarNumero(indicadores.disciplinas_sem_interesse)}</strong>{' '}
              disciplina(s) ainda não possuem interessados.
            </p>
            <p>
              <strong>{formatarNumero(altaDemanda.length)}</strong> disciplina(s)
              aparecem como alta demanda e exigem acompanhamento da secretaria.
            </p>
          </div>
        </div>
      </section>

      <section className="report-section report-two-columns">
        <StatusDistribution
          title="Status dos interesses"
          items={relatorio.status_interesses}
        />
        <StatusDistribution
          title="Status das matrículas"
          items={relatorio.status_matriculas}
        />
      </section>

      <section className="report-section">
        <h3>Ranking de disciplinas por procura</h3>

        <div className="report-table-wrapper">
          <table className="report-table compact-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Código</th>
                <th>Disciplina</th>
                <th>Professor</th>
                <th>Interesses</th>
                <th>Matrículas</th>
                <th>Capacidade</th>
                <th>Demanda</th>
                <th>Ocupação</th>
              </tr>
            </thead>
            <tbody>
              {ranking.length === 0 && (
                <tr>
                  <td colSpan="9" className="empty-cell">
                    Nenhuma disciplina encontrada.
                  </td>
                </tr>
              )}

              {ranking.map((disciplina, index) => (
                <tr key={disciplina.id || disciplina.codigo}>
                  <td>{index + 1}</td>
                  <td>{disciplina.codigo}</td>
                  <td>{disciplina.nome}</td>
                  <td>{disciplina.professor || '-'}</td>
                  <td>{formatarNumero(disciplina.total_interesses)}</td>
                  <td>{formatarNumero(disciplina.total_matriculas)}</td>
                  <td>{formatarNumero(disciplina.capacidade_estimada)}</td>
                  <td>{formatarPercentual(disciplina.taxa_demanda)}</td>
                  <td>{formatarPercentual(disciplina.taxa_ocupacao)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="report-section report-two-columns">
        <div>
          <h3>Disciplinas com alta demanda</h3>
          <ul className="report-list">
            {altaDemanda.length === 0 && (
              <li>Nenhuma disciplina atingiu o limite de alta demanda.</li>
            )}

            {altaDemanda.map((disciplina) => (
              <li key={disciplina.id || disciplina.codigo}>
                <strong>{disciplina.codigo}</strong> — {disciplina.nome}
                <span>{formatarPercentual(disciplina.taxa_demanda)} de demanda</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Disciplinas sem interesse</h3>
          <ul className="report-list">
            {disciplinasSemInteresse.length === 0 && (
              <li>Todas as disciplinas possuem pelo menos um interessado.</li>
            )}

            {disciplinasSemInteresse.map((disciplina) => (
              <li key={disciplina.id || disciplina.codigo}>
                <strong>{disciplina.codigo}</strong> — {disciplina.nome}
                <span>Monitorar oferta e divulgação.</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="report-section">
        <h3>Alunos cadastrados por curso</h3>

        <div className="report-table-wrapper small-table">
          <table className="report-table compact-table">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Total de alunos</th>
              </tr>
            </thead>
            <tbody>
              {alunosPorCurso.map((item) => (
                <tr key={item.curso}>
                  <td>{item.curso}</td>
                  <td>{formatarNumero(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="report-footer">
        <div>
          <span>Responsável pela emissão</span>
        </div>
        <div>
          <span>Secretaria Acadêmica</span>
        </div>
      </footer>
    </article>
  );
}

function RelatorioDisciplina({ relatorio, onImprimir }) {
  const disciplina = relatorio?.disciplina;
  const totais = relatorio?.totais || {};
  const analise = relatorio?.analise || {};
  const alunos = relatorio?.alunos_inscritos || [];

  if (!relatorio || !disciplina) {
    return null;
  }

  return (
    <article className="print-area report-card report-rich">
      <ReportHeader
        titulo="Relatório detalhado da disciplina"
        subtitulo="Relação nominal de alunos inscritos, situação de interesse, confirmação de matrícula e indicadores de demanda."
        geradoEm={relatorio.gerado_em}
        onImprimir={onImprimir}
      />

      <section className="report-section">
        <h3>Identificação da disciplina</h3>

        <div className="report-info-grid detailed">
          <div>
            <span>Código</span>
            <strong>{disciplina.codigo}</strong>
          </div>
          <div>
            <span>Nome</span>
            <strong>{disciplina.nome}</strong>
          </div>
          <div>
            <span>Professor</span>
            <strong>{disciplina.professor || '-'}</strong>
          </div>
          <div>
            <span>Curso</span>
            <strong>{disciplina.curso || '-'}</strong>
          </div>
          <div>
            <span>Período ideal</span>
            <strong>{disciplina.periodo || '-'}</strong>
          </div>
          <div>
            <span>Carga horária</span>
            <strong>{disciplina.carga_horaria || '-'}h</strong>
          </div>
          <div>
            <span>Departamento</span>
            <strong>{disciplina.departamento || '-'}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong className={`status-pill ${normalizarStatus(disciplina.status)}`}>
              {disciplina.status || 'ativa'}
            </strong>
          </div>
        </div>
      </section>

      <section className="report-section report-two-columns">
        <div>
          <h3>Descrição</h3>
          <p className="report-text-block">{disciplina.descricao || '-'}</p>
        </div>
        <div>
          <h3>Ementa</h3>
          <p className="report-text-block">{disciplina.ementa || '-'}</p>
        </div>
      </section>

      <section className="report-section">
        <h3>Indicadores da disciplina</h3>

        <div className="report-metric-grid compact-metrics">
          <ReportMetric
            label="Alunos inscritos"
            value={formatarNumero(totais.inscritos)}
            helper="Total de interesses registrados"
            icon="how_to_reg"
          />
          <ReportMetric
            label="Pendentes"
            value={formatarNumero(totais.pendentes)}
            helper="Interesses ainda não efetivados"
            icon="pending_actions"
          />
          <ReportMetric
            label="Matrículas confirmadas"
            value={formatarNumero(totais.matriculas_confirmadas)}
            helper="Alunos efetivamente matriculados"
            icon="task_alt"
          />
          <ReportMetric
            label="Vagas disponíveis"
            value={formatarNumero(totais.vagas_disponiveis)}
            helper={`${formatarNumero(totais.capacidade_estimada)} vagas estimadas`}
            icon="event_seat"
          />
          <ReportMetric
            label="Demanda por vaga"
            value={formatarRazao(totais.demanda_por_vaga)}
            helper="Interesses divididos pela capacidade"
            icon="monitoring"
          />
          <ReportMetric
            label="Excedente de demanda"
            value={formatarNumero(totais.excedente_demanda)}
            helper="Interesses acima da capacidade"
            icon="priority_high"
          />
        </div>
      </section>

      <section className="report-section report-two-columns">
        <div>
          <h3>Análise automática</h3>
          <div className="report-analysis-box">
            <p>
              <strong>Demanda:</strong> {analise.classificacao_demanda || '-'}
            </p>
            <p>
              <strong>Ocupação:</strong> {analise.classificacao_ocupacao || '-'}
            </p>
            <p>
              <strong>Recomendação:</strong> {analise.recomendacao || '-'}
            </p>
          </div>
        </div>

        <div>
          <h3>Taxas principais</h3>
          <div className="report-analysis-box">
            <ProgressBar
              label="Taxa de demanda"
              value={totais.taxa_demanda}
              helper="Quanto a procura representa da capacidade estimada."
            />
            <ProgressBar
              label="Taxa de ocupação"
              value={totais.taxa_ocupacao}
              helper="Quanto já foi convertido em matrícula efetiva."
            />
          </div>
        </div>
      </section>

      <section className="report-section">
        <h3>Relação nominal de alunos inscritos</h3>

        <div className="report-table-wrapper">
          <table className="report-table compact-table">
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Matrícula</th>
                <th>Aluno</th>
                <th>E-mail</th>
                <th>Curso</th>
                <th>Interesse</th>
                <th>Matrícula</th>
                <th>Semestre</th>
                <th>Situação final</th>
              </tr>
            </thead>
            <tbody>
              {alunos.length === 0 && (
                <tr>
                  <td colSpan="9" className="empty-cell">
                    Nenhum aluno inscrito nesta disciplina.
                  </td>
                </tr>
              )}

              {alunos.map((aluno) => (
                <tr key={`${aluno.usuario_id}-${aluno.interesse_id}`}>
                  <td>{aluno.ordem || '-'}</td>
                  <td>{aluno.matricula || '-'}</td>
                  <td>{aluno.nome || '-'}</td>
                  <td>{aluno.email || '-'}</td>
                  <td>{aluno.curso || '-'}</td>
                  <td>
                    <span>{formatarData(aluno.data_interesse)}</span>
                    <small className="table-subtext">{aluno.status_interesse}</small>
                  </td>
                  <td>
                    {aluno.matricula_confirmada ? (
                      <>
                        <span>{formatarData(aluno.data_matricula)}</span>
                        <small className="table-subtext">Confirmada</small>
                      </>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>{aluno.semestre || '-'}</td>
                  <td>
                    <span
                      className={`status-pill ${normalizarStatus(
                        aluno.situacao_final
                      )}`}
                    >
                      {aluno.situacao_final || 'pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="report-footer">
        <div>
          <span>Responsável pela emissão</span>
        </div>
        <div>
          <span>Secretaria Acadêmica</span>
        </div>
      </footer>
    </article>
  );
}

export default function Relatorios() {
  const [resumo, setResumo] = useState(gerarRelatorioGeralLocal());
  const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);
  const [tipoRelatorio, setTipoRelatorio] = useState(null);
  const [carregandoRelatorio, setCarregandoRelatorio] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    async function carregarResumo() {
      try {
        const data = await buscarResumoRelatorios();
        setResumo(normalizarResumo(data));
      } catch (error) {
        setResumo(gerarRelatorioGeralLocal());
      }
    }

    carregarResumo();
  }, []);

  const indicadores = resumo.indicadores || {};

  const disciplinas = useMemo(() => {
    return resumo.disciplinas?.length ? resumo.disciplinas : gerarResumoDisciplinasLocal();
  }, [resumo.disciplinas]);

  async function abrirRelatorioGeral() {
    setMensagem(null);
    setCarregandoRelatorio(true);

    try {
      const data = await buscarRelatorioGeral();
      setRelatorioSelecionado(normalizarResumo(data));
      setTipoRelatorio('geral');
    } catch (error) {
      setRelatorioSelecionado(gerarRelatorioGeralLocal());
      setTipoRelatorio('geral');
      setMensagem({
        tipo: 'warning',
        texto:
          'Não foi possível consultar a API. Exibindo relatório geral com dados de demonstração.',
      });
    } finally {
      setCarregandoRelatorio(false);
    }
  }

  async function abrirRelatorioDisciplina(disciplina) {
    setMensagem(null);
    setCarregandoRelatorio(true);

    try {
      const data = await buscarRelatorioDisciplina(disciplina.id);
      setRelatorioSelecionado(data);
      setTipoRelatorio('disciplina');
    } catch (error) {
      setRelatorioSelecionado(gerarRelatorioLocal(disciplina));
      setTipoRelatorio('disciplina');
      setMensagem({
        tipo: 'warning',
        texto:
          'Não foi possível consultar a API. Exibindo relatório da disciplina com dados de demonstração.',
      });
    } finally {
      setCarregandoRelatorio(false);
    }
  }

  function imprimirRelatorioSelecionado() {
    if (!relatorioSelecionado) {
      setMensagem({
        tipo: 'error',
        texto: 'Gere ou selecione um relatório antes de imprimir.',
      });
      return;
    }

    window.print();
  }

  const columns = [
    {
      key: 'codigo',
      label: 'Código',
    },
    {
      key: 'nome',
      label: 'Disciplina',
    },
    {
      key: 'vagas',
      label: 'Vagas disp.',
      render: (item) => formatarNumero(item.vagas),
    },
    {
      key: 'total_interesses',
      label: 'Inscritos',
      render: (item) => formatarNumero(item.total_interesses),
    },
    {
      key: 'total_matriculas',
      label: 'Matrículas',
      render: (item) => formatarNumero(item.total_matriculas),
    },
    {
      key: 'taxa_demanda',
      label: 'Demanda',
      render: (item) => formatarPercentual(item.taxa_demanda),
    },
    {
      key: 'taxa_ocupacao',
      label: 'Ocupação',
      render: (item) => formatarPercentual(item.taxa_ocupacao),
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: (disciplina) => (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => abrirRelatorioDisciplina(disciplina)}
        >
          <Icon name="description" />
          Ver relatório
        </button>
      ),
    },
  ];

  return (
    <section>
      <div className="page-intro screen-only">
        <h2>Relatórios gerenciais</h2>
        <p className="page-description">
          Gere relatórios completos com indicadores de demanda, ocupação,
          situação das matrículas e relação nominal dos alunos inscritos por
          disciplina.
        </p>
      </div>

      {mensagem && (
        <div className={`message ${mensagem.tipo} screen-only`}>
          {mensagem.texto}
        </div>
      )}

      <div className="grid-cards screen-only">
        <Card
          titulo="Alunos"
          valor={indicadores.total_alunos}
          descricao={`${formatarNumero(indicadores.alunos_com_interesse)} com interesse`}
          variante="blue"
          icon="groups"
        />
        <Card
          titulo="Interesses"
          valor={indicadores.total_interesses}
          descricao={`${formatarPercentual(indicadores.taxa_demanda)} de demanda`}
          variante="green"
          icon="how_to_reg"
        />
        <Card
          titulo="Matrículas"
          valor={indicadores.total_matriculas}
          descricao={`${formatarPercentual(indicadores.taxa_ocupacao)} de ocupação`}
          variante="amber"
          icon="task_alt"
        />
        <Card
          titulo="Vagas"
          valor={indicadores.vagas_disponiveis}
          descricao={`${formatarNumero(indicadores.capacidade_estimada)} capacidade estimada`}
          variante="slate"
          icon="event_seat"
        />
      </div>

      <div className="content-card screen-only">
        <div className="toolbar report-toolbar">
          <div className="toolbar-title">
            <h3>Relatório geral</h3>
            <p className="page-description">
              Consolida a situação do processo de pré-matrícula, indicando
              procura, ocupação, disciplinas críticas e alunos por curso.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-success"
            onClick={abrirRelatorioGeral}
          >
            <Icon name="summarize" />
            Gerar relatório geral
          </button>
        </div>
      </div>

      <div className="content-card screen-only">
        <div className="toolbar">
          <div className="toolbar-title">
            <h3>Relatórios por disciplina</h3>
            <p className="page-description">
              Cada relatório mostra dados da disciplina, indicadores de demanda
              e todos os alunos inscritos com situação individual.
            </p>
          </div>
        </div>

        <Table
          columns={columns}
          data={disciplinas}
          emptyMessage="Nenhuma disciplina disponível."
        />
      </div>

      {carregandoRelatorio && (
        <div className="content-card screen-only">
          <p className="page-description">Carregando relatório...</p>
        </div>
      )}

      {!relatorioSelecionado && !carregandoRelatorio && (
        <div className="content-card report-empty-state screen-only">
          <Icon name="clinical_notes" />
          <h3>Escolha um relatório</h3>
          <p>
            Gere o relatório geral ou escolha uma disciplina para visualizar
            uma versão completa antes de imprimir.
          </p>
        </div>
      )}

      {relatorioSelecionado && tipoRelatorio === 'geral' && (
        <RelatorioGeral
          relatorio={relatorioSelecionado}
          onImprimir={imprimirRelatorioSelecionado}
        />
      )}

      {relatorioSelecionado && tipoRelatorio === 'disciplina' && (
        <RelatorioDisciplina
          relatorio={relatorioSelecionado}
          onImprimir={imprimirRelatorioSelecionado}
        />
      )}
    </section>
  );
}
