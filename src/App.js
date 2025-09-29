// src/App.js
import React, { useEffect, useState } from "react";
import { login, getAccessToken } from "./spotifyAuth";

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

        // pega top 5 músicas
        setLoadingTracks(true);
        const tracksRes = await fetch(
          "https://api.spotify.com/v1/me/top/tracks?limit=5",
          {
            headers: { Authorization: "Bearer " + t },
          }
        );
        const tracksData = await tracksRes.json();
        setTopTracks(tracksData.items || []);
        setLoadingTracks(false);

        // pega playlists do usuário
        setLoadingPlaylists(true);
        const playlistsRes = await fetch(
          "https://api.spotify.com/v1/me/playlists?limit=10",
          {
            headers: { Authorization: "Bearer " + t },
          }
        );
        const playlistsData = await playlistsRes.json();
        setPlaylists(playlistsData.items || []);
        setLoadingPlaylists(false);
      }
    }
    initApp();
  }, []);

  if (!token) {
    return (
      <div className="p-4">
        <h1>🎵 Spotify Academic App</h1>
        <button onClick={login} className="btn btn-success">
          Login com Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1>🎵 Spotify Academic App</h1>

      {/* ====================== MÚSICAS MAIS OUVIDAS ====================== */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Minhas 5 músicas mais ouvidas</h2>
        {loadingTracks ? (
          <p>Carregando músicas...</p>
        ) : topTracks.length === 0 ? (
          <p>Não encontramos músicas.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {topTracks.slice(0, 5).map((track, index) => (
              <li
                key={track.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                  gap: "15px",
                }}
              >
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  #{index + 1}
                </span>
                <img
                  src={
                    track.album?.images?.[0]?.url ||
                    "https://via.placeholder.com/60"
                  }
                  alt={track.name}
                  style={{ width: "60px", borderRadius: "8px" }}
                />
                <div>
                  <h4 style={{ margin: 0 }}>{track.name}</h4>
                  <p style={{ margin: 0, color: "gray" }}>
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </p>
                </div>
                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: "auto",
                    padding: "6px 12px",
                    backgroundColor: "#1DB954",
                    color: "white",
                    borderRadius: "20px",
                    textDecoration: "none",
                  }}
                >
                  Ouvir
                </a>
              </li>
            ))}
          </ul>
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
