import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

import CaravanaLanding from './CaravanaLanding';
import CaravanaPage from './CaravanaPage';
import CreateCaravanaPage from './CreateCaravanaPage';
import JoinCaravanaPage from './JoinCaravanaPage';

const CaravanaManager = () => {
  const { user } = useAuth();

  const [caravanas, setCaravanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('landing');

  useEffect(() => {
    const fetchCaravanas = async () => {
      if (!user?.id) return;

      try {
        const res = await api.get(`/caravanas/usuario/${user.id}`);
        console.log('Resposta API caravanas:', res.data);

        setCaravanas(res.data);

        // 🔥 AQUI está o pulo do gato
        setView(res.data.length > 0 ? 'list' : 'landing');
      } catch (err) {
        console.error('Erro ao buscar caravanas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaravanas();
  }, [user]);

  if (loading) {
    return <div className="p-6">Carregando caravanas...</div>;
  }

  if (view === 'list') {
    return (
      <CaravanaPage
        caravanas={caravanas}
        onCreate={() => setView('create')}
        onJoin={() => setView('join')}
      />
    );
  }

  if (view === 'create') {
    return <CreateCaravanaPage onBack={() => setView('list')} onCreate={() => setView('list')} />;
  }

  if (view === 'join') {
    return <JoinCaravanaPage onBack={() => setView('list')} onJoin={() => setView('list')} />;
  }

  return (
    <CaravanaLanding onCreateClick={() => setView('create')} onJoinClick={() => setView('join')} />
  );
};

export default CaravanaManager;
