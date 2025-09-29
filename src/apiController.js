// src/apiController.js

// Assumindo que a base da URL da API é esta
const apiBaseUrl = "https://api.spotify.com/v1";

export const APIController = (() => {

  // NOVA FUNÇÃO para buscar as top 5 músicas
  const _getTopTracks = async (token) => {
    try {
      const result = await fetch(`${apiBaseUrl}/me/top/tracks?limit=5`, {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      });
      if (!result.ok) return [];
      const data = await result.json();
      return data.items || []; // Retorna os itens (músicas)
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const _getGenres = async (token) => {
    try {
      const result = await fetch(`${apiBaseUrl}/browse/categories?locale=sv_US`, {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      });

      if (!result.ok) return [];
      const data = await result.json();
      return data.categories?.items || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const _getPlaylistByGenre = async (token, genreId) => {
    try {
      const result = await fetch(
        `${apiBaseUrl}/browse/categories/${genreId}/playlists?limit=10`,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (!result.ok) return [];
      const data = await result.json();
      return data.playlists?.items || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // Modificado para receber a URL completa, como enviado pelo App.js
  const _getTracks = async (token, tracksEndPoint) => {
    try {
      const result = await fetch(tracksEndPoint, {
        headers: { Authorization: "Bearer " + token },
      });
      if (!result.ok) return [];
      const data = await result.json();
      return data.items || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // Modificado para receber a URL completa
  const _getTrack = async (token, trackEndPoint) => {
    try {
      const result = await fetch(trackEndPoint, {
        headers: { Authorization: "Bearer " + token },
      });
      if (!result.ok) return null;
      const data = await result.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return {
    getTopTracks: _getTopTracks, // Exporta a nova função
    getGenres: _getGenres,
    getPlaylistByGenre: _getPlaylistByGenre,
    getTracks: _getTracks,
    getTrack: _getTrack,
  };
})();