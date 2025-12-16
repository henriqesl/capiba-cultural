const CaravanaLanding = ({ onCreateClick, onJoinClick }) => (
  <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
    <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl text-center">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Gerenciar Caravanas</h2>

      <p className="text-gray-600 mb-8">Crie uma nova caravana ou junte-se a um grupo existente.</p>

      <div className="space-y-4">
        <button
          onClick={onCreateClick}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl"
        >
          Criar Nova Caravana
        </button>

        <button
          onClick={onJoinClick}
          className="w-full bg-gray-200 text-gray-800 font-bold py-4 rounded-xl"
        >
          Entrar com Código
        </button>
      </div>
    </div>
  </div>
);

export default CaravanaLanding;
