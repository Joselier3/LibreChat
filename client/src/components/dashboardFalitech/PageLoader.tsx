import React, { useEffect, useState } from 'react';

interface PageLoaderProps {
  loader: boolean
}

const PageLoader = ({ loader = false }: PageLoaderProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handlePageLoad = () => {
      setLoading(false); // Cuando la página ha terminado de cargar
    };

    const handlePageBeforeUnload = () => {
      setLoading(true); // Cuando la página está por recargarse o cambiar de estado
    };

    // Detectar cuando el documento ha terminado de cargarse
    if (document.readyState === 'complete') {
      setLoading(false);
    }

    // Escuchar el evento de carga de la página
    window.addEventListener('load', handlePageLoad);
    window.addEventListener('beforeunload', handlePageBeforeUnload);

    // Limpieza de eventos
    return () => {
      window.removeEventListener('load', handlePageLoad);
      window.removeEventListener('beforeunload', handlePageBeforeUnload);
    };
  }, []);

  // Si la página o el data fetching está en carga, mostramos el loader
  const isLoading = loading || loader;

  return (
    <div>
      {loading && (
        <div id='splash' style={{ display: 'flex', alignItems: 'center', position: 'fixed', top: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg,#222428,#444856)', color: '#fff', zIndex: '4000' }}>
          <div className="text-light" style={{ width: '100%', textAlign: 'center' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }} >
              <svg className="gear" style={{ width: '64px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path id="p" fill="#fdb" d="M94.1 58.8c.6-2.8.9-5.8.9-8.8s-.3-6-.9-8.8l-11.7-.4c-.7-2.6-1.7-5-3-7.3l8-8.5c-3.3-4.9-7.5-9.2-12.5-12.5l-8.5 8c-2.3-1.3-4.7-2.3-7.3-3l-.3-11.6C56 5.3 53 5 50 5s-6 .3-8.8.9l-.4 11.7c-2.6.7-5 1.7-7.3 3l-8.5-8c-4.9 3.3-9.2 7.5-12.5 12.5l8 8.5c-1.3 2.3-2.3 4.7-3 7.3l-11.6.3C5.3 44 5 47 5 50s.3 6 .9 8.8l11.7.4c.7 2.6 1.7 5 3 7.3l-8 8.5c3.3 4.9 7.5 9.2 12.5 12.5l8.5-8c2.3 1.3 4.7 2.3 7.3 3l.4 11.7c2.7.5 5.7.8 8.7.8s6-.3 8.8-.9l.4-11.7c2.6-.7 5-1.7 7.3-3l8.5 8c4.9-3.3 9.2-7.5 12.5-12.5l-8-8.5c1.3-2.3 2.3-4.7 3-7.3l11.6-.3zM50 66.9c-9.3 0-16.9-7.6-16.9-16.9S40.7 33.1 50 33.1 66.9 40.7 66.9 50 59.3 66.9 50 66.9z"></path>
              </svg>
              <svg className="gear" style={{ width: '64px', margin: '64px 0 0 -12px', animationDirection: 'reverse' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><use href="#p"></use>
              </svg>
            </div>
            <h1
              style={{
                fontFamily: '\'Trebuchet MS\', Helvetica, sans-serif',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              }}>
              AgentIA
            </h1>
            <div id="splash-msg" style={{ color: '#aaa' }}>
              Please wait, loading ...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageLoader;
