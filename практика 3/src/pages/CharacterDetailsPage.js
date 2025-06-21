import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CharacterDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const res = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
        setCharacter(res.data);

        const firstEpisodes = res.data.episode.slice(0, 4);
        const episodesData = await Promise.all(firstEpisodes.map(url => axios.get(url).then(r => r.data)));
        setEpisodes(episodesData);
      } catch (err) {
        setError('Ошибка загрузки данных персонажа.');
      }
    };
    fetchCharacter();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!character) return <p>Загрузка...</p>;

  return (
    <main className="main">
      <button className="goback-btn" onClick={() => navigate(-1)}>
        <img src="/assets/images/arrow_back_24px.svg" alt="Go Back" className="back-button__icon" />
        GO BACK
      </button>
      <section className="character-details">
        <div className="character-details__portrait">
          <img src={character.image} alt={character.name} />
          <h1>{character.name}</h1>
        </div>
        <div className="character-details__info">
          <div className="character-details__info-block informations-items">
            <h3>Informations</h3>
            <article className="informations__item">
              <div className="informations__item-contetnt">
                <h6>Gender</h6>
                <span>{character.gender}</span>
              </div>
            </article>
            <article className="informations__item">
              <div className="informations__item-contetnt">
                <h6>Status</h6>
                <span>{character.status}</span>
              </div>
            </article>
            <article className="informations__item">
              <div className="informations__item-contetnt">
                <h6>Species</h6>
                <span>{character.species}</span>
              </div>
            </article>
            <article className="informations__item">
              <div className="informations__item-contetnt">
                <h6>Origin</h6>
                <span>{character.origin.name}</span>
              </div>
            </article>
            <article className="informations__item">
              <div className="informations__item-contetnt">
                <h6>Type</h6>
                <span>{character.type || 'Unknown'}</span>
              </div>
            </article>
            <article
              className="informations__item"
              id="location_url"
              data-id={character.location.url?.split('/').pop()}
              style={{ cursor: character.location.url ? 'pointer' : 'default' }}
              onClick={() => {
                if (character.location.url) {
                  const locationId = character.location.url.split('/').pop();
                  navigate(`/locations/${locationId}`);
                }
              }}
            >
              <div className="informations__item-contetnt">
                <h6>Location</h6>
                <span>{character.location.name}</span>
              </div>
              <div className="informations__item-svg">
                <img src="/assets/images/chevron_right_24px.svg" alt="More" />
              </div>
            </article>
          </div>
          <div className="character-details__info-block episodes-items">
            <h3>Episodes</h3>
            {episodes.map(ep => (
              <article
                key={ep.id}
                className="episodes__item"
                data-id={ep.id}
                onClick={() => navigate(`/episodes/${ep.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="episodes__item-content">
                  <h6>{ep.episode}</h6>
                  <span>{ep.name}</span>
                  <p>{ep.air_date}</p>
                </div>
                <div className="episodes__item-svg">
                  <img src="/assets/images/chevron_right_24px.svg" alt="More" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CharacterDetailsPage;
