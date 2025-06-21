import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocationCard from '../components/LocationCard';
import Filters from '../components/Filters';

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ name: '', type: '', dimension: '' });
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `https://rickandmortyapi.com/api/location/?page=${page}`;
        if (filters.name) url += `&name=${filters.name}`;
        if (filters.type) url += `&type=${filters.type}`;
        if (filters.dimension) url += `&dimension=${filters.dimension}`;

        const res = await axios.get(url);
        if (page === 1) {
          setLocations(res.data.results);
        } else {
          setLocations(prev => [...prev, ...res.data.results]);
        }
        setNextPage(res.data.info.next);
      } catch (err) {
        setError('Ничего не найдено или ошибка загрузки.');
        if (page === 1) setLocations([]);
        setNextPage(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [page, filters]);

  const loadMore = () => {
    if (nextPage) setPage(prev => prev + 1);
  };

  return (
    <main className="main">
      <img className="main__logo" src="/assets/images/locations.svg" alt="Locations" />
      <Filters filters={filters} setFilters={setFilters} setPage={setPage} type="location" />
      {error && <p>{error}</p>}
      <section className="locations cards">
        {locations.map(loc => (
          <LocationCard key={loc.id} location={loc} />
        ))}
      </section>
      {loading && <p>Загрузка...</p>}
      {nextPage && !loading && (
        <button className="loadmore" onClick={loadMore} data-type="location">
          LOAD MORE
        </button>
      )}
    </main>
  );
};

export default LocationsPage;
