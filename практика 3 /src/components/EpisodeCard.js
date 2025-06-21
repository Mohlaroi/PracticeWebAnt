import React from 'react';
import { useNavigate } from 'react-router-dom';

const EpisodeCard = ({ episode }) => {
  const navigate = useNavigate();

  return (
    <article className="episodes__card card" onClick={() => navigate(`/episodes/${episode.id}`)} style={{ cursor: 'pointer' }}>
      <div className="episodes__card-info">
        <h3 className="episodes__card-name">{episode.name}</h3>
        <span className="episodes__card-other">{episode.air_date}</span>
        <p className="episodes__card-serie">{episode.episode}</p>
      </div>
    </article>
  );
};

export default EpisodeCard;
