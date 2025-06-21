import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CharacterCard from '../components/CharacterCard';

const LocationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [residents, setResidents] = useState([]);
  const [error, setError] = useState(null);
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(`https://rickandmortyapi.com/api/location/${id}`);
        setLocation(res.data);
        setResidents([]);
        setCurrentIndex(0);
      } catch (err) {
        setError('Ошибка загрузки локации.');
      }
    };
    fetchLocation();
  }, [id]);

  useEffect(() => {
    if (!location) return;

    const loadInitialResidents = async () => {
      setLoadingResidents(true);
      try {
        const initialResidentsUrls = location.residents.slice(0, PAGE_SIZE);
        const residentsData = await Promise.all(
          initialResidentsUrls.map(url => axios.get(url).then(r => r.data))
        );
        setResidents(residentsData);
        setCurrentIndex(PAGE_SIZE);
      } catch (err) {
        setError('Ошибка загрузки жителей.');
      } finally {
        setLoadingResidents(false);
      }
    };

    loadInitialResidents();
  }, [location]);

  const loadMoreResidents = async () => {
    if (!location) return;
    setLoadingResidents(true);
    try {
      const nextResidentsUrls = location.residents.slice(currentIndex, currentIndex + PAGE_SIZE);
      const residentsData = await Promise.all(
        nextResidentsUrls.map(url => axios.get(url).then(r => r.data))
      );
      setResidents(prev => [...prev, ...residentsData]);
      setCurrentIndex(prev => prev + PAGE_SIZE);
    } catch (err) {
      setError('Ошибка загрузки жителей.');
    } finally {
      setLoadingResidents(false);
    }
  };

  if (error) return <p>{error}</p>;
  if (!location) return <p>Загрузка...</p>;

  return (
    <main className="main">
      <button className="goback-btn" onClick={() => navigate(-1)}>
        <img src="/assets/images/arrow_back_24px.svg" alt="Go Back" className="back-button__icon" />
        GO BACK
      </button>
      <h1 className="main__title">{location.name}</h1>
      <section className="selected-filters">
        <div className="selected-filters__item">
          <p>Type</p>
          <span>{location.type}</span>
        </div>
        <div className="selected-filters__item">
          <p>Dimension</p>
          <span>{location.dimension}</span>
        </div>
      </section>
      <div className="characters-wrapper">
        <h3 className="characters__subtitle">Residents</h3>
      </div>
      <section className="characters cards location-details">
        {residents.map(resident => (
          <CharacterCard key={resident.id} character={resident} />
        ))}
      </section>
      {loadingResidents && <p>Загрузка жителей...</p>}
      {location.residents.length > residents.length && !loadingResidents && (
        <button className="loadmore" onClick={loadMoreResidents} data-type="location">
          LOAD MORE
        </button>
      )}
    </main>
  );
};

export default LocationDetailsPage;
