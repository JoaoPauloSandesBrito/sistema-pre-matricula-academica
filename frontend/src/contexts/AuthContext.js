import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { ADMIN_EMAILS } from '../config/adminEmails';
import { app } from '../firebase/firebase';
import { mockSecretaria, mockUsuario } from '../data/mockData';
import { loginBackend } from '../services/authService';

export const AuthContext = createContext(null);

function getPerfilPorEmail(email) {
  return ADMIN_EMAILS.includes(email) ? 'secretaria' : 'aluno';
}

function getUsuarioSalvo() {
  const raw = localStorage.getItem('usuario');

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    localStorage.removeItem('usuario');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(getUsuarioSalvo);
  const [perfil, setPerfil] = useState(usuario?.perfil || null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
      setPerfil(usuario.perfil);
    }
  }, [usuario]);

  const entrarComoDemo = useCallback((tipo = 'aluno') => {
    const usuarioDemo = tipo === 'secretaria' ? mockSecretaria : mockUsuario;

    setUsuario(usuarioDemo);
    setPerfil(usuarioDemo.perfil);
    localStorage.setItem('usuario', JSON.stringify(usuarioDemo));
  }, []);

  const entrarComGoogle = useCallback(async () => {
    if (!app) {
      entrarComoDemo('aluno');
      return;
    }

    setCarregando(true);

    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const token = await firebaseUser.getIdToken();

      if (!firebaseUser.email.endsWith('@uesb.edu.br')) {
        await signOut(auth);
        throw new Error('Use um e-mail institucional @uesb.edu.br.');
      }

      localStorage.setItem('firebase_token', token);

      const payload = {
        firebase_uid: firebaseUser.uid,
        nome: firebaseUser.displayName,
        email: firebaseUser.email,
        perfil: getPerfilPorEmail(firebaseUser.email),
        foto_url: firebaseUser.photoURL || '',
      };

      const response = await loginBackend(payload);
      const usuarioBackend = response.usuario || response.data || payload;
      const usuarioComDadosGoogle = {
        ...payload,
        ...usuarioBackend,
        nome: usuarioBackend.nome || payload.nome,
        email: usuarioBackend.email || payload.email,
        perfil: usuarioBackend.perfil || payload.perfil,
        foto_url:
          usuarioBackend.foto_url ||
          usuarioBackend.photoURL ||
          usuarioBackend.photo_url ||
          payload.foto_url,
      };

      setUsuario(usuarioComDadosGoogle);
      setPerfil(usuarioComDadosGoogle.perfil);
    } finally {
      setCarregando(false);
    }
  }, [entrarComoDemo]);

  const sair = useCallback(async () => {
    if (app) {
      const auth = getAuth(app);
      await signOut(auth);
    }

    localStorage.removeItem('usuario');
    localStorage.removeItem('firebase_token');

    setUsuario(null);
    setPerfil(null);
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      perfil,
      carregando,
      entrarComGoogle,
      entrarComoDemo,
      sair,
    }),
    [
      usuario,
      perfil,
      carregando,
      entrarComGoogle,
      entrarComoDemo,
      sair,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
