import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CharacterCard from '../components/CharacterCard';
import Filters from '../components/Filters';

const CharactersPage = () => {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ name: '', species: '', gender: '', status: '' });
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
        if (filters.name) url += `&name=${filters.name}`;
        if (filters.species) url += `&species=${filters.species}`;
        if (filters.gender) url += `&gender=${filters.gender}`;
        if (filters.status) url += `&status=${filters.status}`;

        const res = await axios.get(url);
        if (page === 1) {
          setCharacters(res.data.results);
        } else {
          setCharacters(prev => [...prev, ...res.data.results]);
        }
        setNextPage(res.data.info.next);
      } catch (err) {
        setError('Ничего не найдено или ошибка загрузки.');
        if (page === 1) setCharacters([]);
        setNextPage(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [page, filters]);

  const loadMore = () => {
    if (nextPage) setPage(prev => prev + 1);
  };

  return (
    <main className="main">
      <img className="main__logo" src="/assets/images/PngItem.svg" alt="Rick and Morty" />
      <Filters filters={filters} setFilters={setFilters} setPage={setPage} type="character" />
      {error && <p>{error}</p>}
      <section className="characters cards">
        {characters.map(char => (
          <CharacterCard key={char.id} character={char} />
        ))}
      </section>
      {loading && <p>Загрузка...</p>}
      {nextPage && !loading && (
        <button className="loadmore" onClick={loadMore} data-type="character">
          LOAD MORE
        </button>
      )}
    </main>
  );
};

export default CharactersPage;
