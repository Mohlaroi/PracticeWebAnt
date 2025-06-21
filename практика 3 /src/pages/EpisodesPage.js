import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EpisodeCard from '../components/EpisodeCard';
import Filters from '../components/Filters';

const EpisodesPage = () => {
  const [episodes, setEpisodes] = useState([]);
  const [page, setPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `https://rickandmortyapi.com/api/episode/?page=${page}`;
        if (filterName) url += `&name=${filterName}`;

        const res = await axios.get(url);
        if (page === 1) {
          setEpisodes(res.data.results);
        } else {
          setEpisodes(prev => [...prev, ...res.data.results]);
        }
        setNextPage(res.data.info.next);
      } catch (err) {
        setError('Ничего не найдено или ошибка загрузки.');
        if (page === 1) setEpisodes([]);
        setNextPage(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, [page, filterName]);

  const loadMore = () => {
    if (nextPage) setPage(prev => prev + 1);
  };

  return (
    <main className="main">
      <img className="main__logo" src="/assets/images/rick-and-morty2 1.svg" alt="Rick and Morty Episodes" />
      <section className="filters" data-type="episode">
        <article className="filters__filter-item" id="episodes-search">
          <img src="/assets/images/lens.svg" alt="Search Icon" />
          <input
            type="text"
            placeholder="Filter by name or episode (ex. S01 or S01E02)"
            value={filterName}
            onChange={e => {
              setFilterName(e.target.value);
              setPage(1);
            }}
          />
        </article>
      </section>
      {error && <p>{error}</p>}
      <section className="episodes cards">
        {episodes.map(ep => (
          <EpisodeCard key={ep.id} episode={ep} />
        ))}
      </section>
      {loading && <p>Загрузка...</p>}
      {nextPage && !loading && (
        <button className="loadmore" onClick={loadMore} data-type="episode">
          LOAD MORE
        </button>
      )}
    </main>
  );
};

export default EpisodesPage;
