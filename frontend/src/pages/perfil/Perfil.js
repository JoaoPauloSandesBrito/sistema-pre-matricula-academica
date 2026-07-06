import useAuth from '../../hooks/useAuth';

export default function Perfil() {
  const { usuario } = useAuth();
  const inicial = (usuario?.nome || 'U').charAt(0).toUpperCase();
  const foto = usuario?.foto_url || usuario?.photoURL || usuario?.photo_url;

  return (
    <section>
      <div className="page-intro">
        <h2>Dados do usuário autenticado</h2>
        <p className="page-description">
          Consulte as informações associadas ao seu acesso institucional.
        </p>
      </div>

      <div className="content-card profile-card">
        <div className="profile-grid">
          {foto ? (
            <img
              src={foto}
              alt={`Foto de ${usuario?.nome || 'usuário'}`}
              className="profile-photo-large"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="profile-avatar-large">{inicial}</div>
          )}

          <div>
            <h3 className="profile-name">{usuario?.nome}</h3>

            <div className="profile-list">
              <p>
                <strong>Email:</strong> {usuario?.email}
              </p>
              <p>
                <strong>Matrícula:</strong>{' '}
                {usuario?.matricula || 'Não informado'}
              </p>
              <p>
                <strong>Curso:</strong> {usuario?.curso || 'Não informado'}
              </p>
              <p>
                <strong>Perfil:</strong> {usuario?.perfil}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                {usuario?.status ? 'Ativo' : 'Inativo'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
