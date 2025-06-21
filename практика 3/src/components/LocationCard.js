import React from 'react';
import { useNavigate } from 'react-router-dom';

const LocationCard = ({ location }) => {
  const navigate = useNavigate();

  return (
    <article
      className="locations__card card"
      onClick={() => navigate(`/locations/${location.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="locations__card-info">
        <h3 className="locations__card-name">{location.name}</h3>
        <span className="locations__card-other">{location.dimension}</span>
      </div>
    </article>
  );
};

export default LocationCard;
