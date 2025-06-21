import React from 'react';

const Filters = ({ filters, setFilters, setPage, type }) => {
  const speciesSet = [
    "Alien", "Animal", "Cronenberg", "Disease", "Human",
    "Humanoid", "Mythological Creature", "Poopybutthole",
    "Robot", "unknown"
  ];
  const genderSet = ["Female", "Genderless", "Male", "unknown"];
  const statusSet = ["Alive", "Dead", "unknown"];

  const typeSet = [
    "Acid Plant", "Arcade", "Artificially generated world", "Asteroid", "Base",
    "Box", "Cluster", "Consciousness", "Convention", "Country", "Customs",
    "Daycare", "Death Star", "Diegesis", "Dimension", "Dream",
    "Dwarf planet (Celestial Dwarf)", "Elemental Rings", "Fantasy town",
    "Game", "Hell", "Human", "Liquid", "Machine", "Memory", "Menagerie",
    "Microverse", "Miniverse", "Mount", "Nightmare", "Non-Diegetic Alternative Reality",
    "Planet", "Police Department", "Quadrant", "Quasar", "Reality", "Resort",
    "Spa", "Space", "Space station", "Spacecraft", "TV", "Teenyverse",
    "Woods", "unknown"
  ];
  const dimensionSet = [
    "Chair Dimension", "Cromulon Dimension", "Cronenberg Dimension", "Dimension 5-126",
    "Dimension C-137", "Dimension C-35", "Dimension C-500A", "Dimension D-99",
    "Dimension D716", "Dimension D716-B", "Dimension D716-C", "Dimension J-22",
    "Dimension J19ζ7", "Dimension K-22", "Dimension K-83", "Eric Stoltz Mask Dimension",
    "Evil Rick's Target Dimension", "Fantasy Dimension", "Fascist Dimension",
    "Fascist Shrimp Dimension", "Fascist Teddy Bear Dimension", "Giant Telepathic Spiders Dimension",
    "Magic Dimension", "Merged Dimension", "Phone Dimension", "Pizza Dimension",
    "Post-Apocalyptic Dimension", "Replacement Dimension", "Testicle Monster Dimension",
    "Tusk Dimension", "Unknown dimension", "Wasp Dimension", "unknown"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  return (
    <section className="filters" data-type={type}>
      <article className="filters__filter-item">
        <img src="/assets/images/lens.svg" alt="Search Icon" />
        <input
          type="text"
          placeholder="Filter by name..."
          name="name"
          value={filters.name}
          onChange={handleChange}
        />
      </article>
      {(type === 'character' || type === 'location') && (
        <div className="select-wrappers-wrapper">
          {type === 'character' && (
            <>
              <div className="select-wrapper">
                <select name="species" value={filters.species} onChange={handleChange} className="filters__filter-item" data-filter="species">
                  <option value="" disabled>Species</option>
                  {speciesSet.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                </select>
              </div>
              <div className="select-wrapper">
                <select name="gender" value={filters.gender} onChange={handleChange} className="filters__filter-item" data-filter="gender">
                  <option value="" disabled>Gender</option>
                  {genderSet.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="select-wrapper">
                <select name="status" value={filters.status} onChange={handleChange} className="filters__filter-item" data-filter="status">
                  <option value="" disabled>Status</option>
                  {statusSet.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </>
          )}
          {type === 'location' && (
            <>
              <div className="select-wrapper">
                <select name="type" value={filters.type} onChange={handleChange} className="filters__filter-item" data-filter="type">
                  <option value="" disabled>Type</option>
                  {typeSet.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="select-wrapper">
                <select name="dimension" value={filters.dimension} onChange={handleChange} className="filters__filter-item" data-filter="dimension">
                  <option value="" disabled>Dimension</option>
                  {dimensionSet.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default Filters;
