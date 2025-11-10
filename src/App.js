import React, { useEffect, useState } from "react";
import { login, getAccessToken } from "./spotifyAuth";
import { APIController } from "./apiController";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

  useEffect(() => {
    async function initApp() {
      const t = await getAccessToken();
      if (t) {
        setToken(t);

        setLoadingTracks(true);
        const tracksData = await APIController.getTopTracks(t);
        setTopTracks(tracksData);
        setLoadingTracks(false);

        setLoadingPlaylists(true);
        const playlistsData = await APIController.getUserPlaylists(t);
        setPlaylists(playlistsData);
        setLoadingPlaylists(false);
      }
    }
    initApp();
  }, []);

  // ================= TELA DE LOGIN =================
  if (!token) {
    return (
      <div className="login-screen">
        <h1>🎵 Spotify Academic App</h1>
        <p>Explore suas músicas e playlists favoritas com estilo 🔥</p>
        <button onClick={login} className="login-button">
          Login com Spotify
        </button>
        <footer>© {new Date().getFullYear()} Projeto Acadêmico</footer>
      </div>
    );
  }

  // ================= APP PRINCIPAL =================
  return (
    <div className="app-container">
      <h1>🎵 Spotify Academic App</h1>

      {/* ====================== COLAGENS DE ÁLBUNS ====================== */}
      <section className="album-collage-section">
        <h2>🎧 Colagem 2x2 - Álbuns mais escutados</h2>
        {loadingTracks ? (
          <p>Carregando álbuns...</p>
        ) : (
          <div className="collage-grid grid-2x2">
            {topTracks.slice(0, 4).map((track) => (
              <img
                key={track.id}
                src={track.album?.images?.[0]?.url}
                alt={track.name}
                className="collage-img"
              />
            ))}
          </div>
        )}
      </section>

      <section className="album-collage-section">
        <h2>🎵 Colagem 3x3 - Mais tocadas recentemente</h2>
        {loadingTracks ? (
          <p>Carregando álbuns...</p>
        ) : (
          <div className="collage-grid grid-3x3">
            {topTracks
              .concat(topTracks) // duplica pra garantir 9 imagens se tiver só 5 topTracks
              .slice(0, 9)
              .map((track, index) => (
                <img
                  key={`${track.id}-${index}`}
                  src={track.album?.images?.[0]?.url}
                  alt={track.name}
                  className="collage-img"
                />
              ))}
          </div>
        )}
      </section>

      {/* ====================== PLAYLISTS ====================== */}
      <section>
        <h2>Minhas playlists</h2>
        {loadingPlaylists ? (
          <p>Carregando playlists...</p>
        ) : playlists.length === 0 ? (
          <p>Não encontramos playlists.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {playlists.map((pl) => (
              <div
                key={pl.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <img
                  src={
                    pl.images?.[0]?.url ||
                    "https://via.placeholder.com/200x200"
                  }
                  alt={pl.name}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <div style={{ padding: "10px" }}>
                  <h4
                    style={{
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {pl.name}
                  </h4>
                  <p style={{ margin: "5px 0", color: "gray" }}>
                    {pl.tracks.total} músicas
                  </p>
                  <a
                    href={pl.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: "8px",
                      padding: "6px 12px",
                      backgroundColor: "#1DB954",
                      color: "white",
                      borderRadius: "20px",
                      textDecoration: "none",
                    }}
                  >
                    Abrir no Spotify
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
