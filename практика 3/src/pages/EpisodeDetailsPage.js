import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CharacterCard from '../components/CharacterCard';

const PAGE_SIZE = 12;

const EpisodeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [episode, setEpisode] = useState(null);
  const [allCharactersUrls, setAllCharactersUrls] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loadingEpisode, setLoadingEpisode] = useState(false);
  const [loadingCharacters, setLoadingCharacters] = useState(false);

  useEffect(() => {
    const fetchEpisode = async () => {
      setError(null);
      setLoadingEpisode(true);
      try {
        const res = await axios.get(`https://rickandmortyapi.com/api/episode/${id}`);
        setEpisode(res.data);
        setAllCharactersUrls(res.data.characters);
        setCharacters([]);
        setCurrentIndex(0);
      } catch (err) {
        setError('Ошибка загрузки данных эпизода.');
      } finally {
        setLoadingEpisode(false);
      }
    };
    fetchEpisode();
  }, [id]);

  const loadMoreCharacters = async () => {
    if (currentIndex >= allCharactersUrls.length) return;

    setLoadingCharacters(true);
    try {
      const nextUrls = allCharactersUrls.slice(currentIndex, currentIndex + PAGE_SIZE);
      const charactersData = await Promise.all(nextUrls.map(url => axios.get(url).then(r => r.data)));
      setCharacters(prev => [...prev, ...charactersData]);
      setCurrentIndex(prev => prev + PAGE_SIZE);
    } catch (err) {
      setError('Ошибка загрузки персонажей.');
    } finally {
      setLoadingCharacters(false);
    }
  };

  useEffect(() => {
    if (allCharactersUrls.length > 0) {
      loadMoreCharacters();
    }
  }, [allCharactersUrls]);

  if (error) return <p>{error}</p>;
  if (loadingEpisode) return <p>Загрузка эпизода...</p>;
  if (!episode) return null;

  const showLoadMoreButton = allCharactersUrls.length > PAGE_SIZE && currentIndex < allCharactersUrls.length;

  return (
    <main className="main">
      <button className="goback-btn" onClick={() => navigate(-1)}>
        <img src="/assets/images/arrow_back_24px.svg" alt="Go Back" className="back-button__icon" />
        GO BACK
      </button>
      <h1 className="main__title">{episode.name}</h1>
      <section className="selected-filters">
        <div className="selected-filters__item">
          <p>Episode</p>
          <span>{episode.episode}</span>
        </div>
        <div className="selected-filters__item">
          <p>Date</p>
          <span>{episode.air_date}</span>
        </div>
      </section>
      <div className="characters-wrapper">
        <h3 className="characters__subtitle">Cast</h3>
      </div>
      <section className="characters cards">
        {characters.map(char => (
          <CharacterCard key={char.id} character={char} />
        ))}
      </section>
      {loadingCharacters && <p>Загрузка персонажей...</p>}
      {showLoadMoreButton && !loadingCharacters && (
        <button className="loadmore" onClick={loadMoreCharacters}>
          LOAD MORE
        </button>
      )}
      {}
    </main>
  );
};

export default EpisodeDetailsPage;
