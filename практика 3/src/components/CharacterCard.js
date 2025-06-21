import React from 'react';
import { useNavigate } from 'react-router-dom';

const CharacterCard = ({ character }) => {
  const navigate = useNavigate();

  return (
    <article
      className="characters__card card"
      onClick={() => navigate(`/characters/${character.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="characters__card-image-box">
        <img className="characters__card-image" src={character.image} alt={character.name} />
      </div>
      <div className="characters__card-info">
        <h3 className="characters__card-name">{character.name}</h3>
        <span className="characters__card-other">{character.species}</span>
      </div>
    </article>
  );
};

export default CharacterCard;
 