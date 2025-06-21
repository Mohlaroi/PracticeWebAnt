document.addEventListener('DOMContentLoaded', () => {
  const type =
    document.querySelector('[data-type]')?.dataset.type ||
    document.querySelector('.filters')?.dataset.type ||
    'character';

  const containerSelector = `section.${type}s.cards`;
  const container = document.querySelector(containerSelector);
  const filtersSection = document.querySelector('.filters');
  const loadMoreBtn = document.querySelector(`.loadmore[data-type="${type}"]`);
  const baseUrl = loadMoreBtn?.dataset.url || '';
  const searchInput = filtersSection?.querySelector('input[type="text"]') || null;
  const selects = filtersSection?.querySelectorAll('select[data-filter]') || null;

  // Функция заполнения опций в селектах
  function fillSelectOptions(selectElement, valuesSet) {
    valuesSet.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      selectElement.appendChild(option);
    });
  }

  // Загрузка опций фильтров в зависимости от типа страницы
  function loadFilterOptions() {
    if (type === 'character') {
      const speciesSet = [
        "Alien", "Animal", "Cronenberg", "Disease", "Human",
        "Humanoid", "Mythological Creature", "Poopybutthole",
        "Robot", "unknown"
      ];
      const genderSet = ["Female", "Genderless", "Male", "unknown"];
      const statusSet = ["Alive", "Dead", "unknown"];

      document.querySelectorAll('select[data-filter="species"]').forEach(select => {
        fillSelectOptions(select, speciesSet);
      });
      document.querySelectorAll('select[data-filter="gender"]').forEach(select => {
        fillSelectOptions(select, genderSet);
      });
      document.querySelectorAll('select[data-filter="status"]').forEach(select => {
        fillSelectOptions(select, statusSet);
      });
    } else if (type === 'location') {
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

      document.querySelectorAll('select[data-filter="type"]').forEach(select => {
        fillSelectOptions(select, typeSet);
      });
      document.querySelectorAll('select[data-filter="dimension"]').forEach(select => {
        fillSelectOptions(select, dimensionSet);
      });
    }
  }

  // Получение параметров фильтра из input и select
  function getFilterParams() {
    const params = new URLSearchParams();
    if (searchInput) {
      const value = searchInput.value.trim();

      if (type === 'episode') {
        if (value) {
          if (/^S\d{2}E\d{2}$/i.test(value) || /^S\d{2}$/i.test(value)) {
            params.append('episode', value);
          } else {
            params.append('name', value);
          }
        }
      } else {
        if (value) params.append('name', value);
        selects.forEach(select => {
          const val = select.value;
          const filterType = select.dataset.filter;
          const defaultOption = select.querySelector('option[disabled]').textContent;
          if (filterType && val && val !== defaultOption) {
            params.append(filterType, val);
          }
        });
      }
    }
    return params.toString();
  }

  // Создание карточки в зависимости от типа
  function createCard(data, type) {
    let card, info, name;

    if (type === 'character') {
      card = document.createElement('article');
      card.className = 'characters__card card';

      const imageBox = document.createElement('div');
      imageBox.className = 'characters__card-image-box';

      const img = document.createElement('img');
      img.className = 'characters__card-image';
      img.src = data.image;
      img.alt = data.name;
      imageBox.appendChild(img);

      info = document.createElement('div');
      info.className = 'characters__card-info';

      name = document.createElement('h3');
      name.className = 'characters__card-name';
      name.textContent = data.name;

      const specie = document.createElement('span');
      specie.className = 'characters__card-other';
      specie.textContent = data.species;

      info.appendChild(name);
      info.appendChild(specie);

      card.appendChild(imageBox);
      card.appendChild(info);

    } else if (type === 'location') {
      card = document.createElement('article');
      card.className = 'locations__card card';

      info = document.createElement('div');
      info.className = 'locations__card-info';

      name = document.createElement('h3');
      name.className = 'locations__card-name';
      name.textContent = data.name;

      const dimension = document.createElement('span');
      dimension.className = 'locations__card-other';
      dimension.textContent = data.dimension;

      info.appendChild(name);
      info.appendChild(dimension);

      card.appendChild(info);

    } else if (type === 'episode') {
      card = document.createElement('article');
      card.className = 'episodes__card card';

      info = document.createElement('div');
      info.className = 'episodes__card-info';

      name = document.createElement('h3');
      name.className = 'episodes__card-name';
      name.textContent = data.name;

      const date = document.createElement('span');
      date.className = 'episodes__card-other';
      date.textContent = data.air_date;

      const serie = document.createElement('p');
      serie.className = 'episodes__card-serie';
      serie.textContent = data.episode;

      info.appendChild(name);
      info.appendChild(date);
      info.appendChild(serie);

      card.appendChild(info);
    }

    card.style.cursor = 'pointer';
    const pageMap = {
      character: 'characters_details.html',
      location: 'locations_details.html',
      episode: 'episodes_details.html'
    };

    card.addEventListener('click', () => {
      const page = pageMap[type] || 'index.html';
      window.location.href = `${page}?id=${data.id}`;
    });

    return card;
  }

  // Загрузка и отрисовка данных с фильтрами
  function loadAndRenderFiltered(url, containerSelector, type, loadMoreBtn, filters = '', clearContainer = true) {
    const fullUrl = filters ? `${url}?${filters}` : url;
    const container = document.querySelector(containerSelector);

    fetch(fullUrl)
      .then(response => response.json())
      .then(data => {
        if (clearContainer) {
          container.innerHTML = '';
        }

        data.results.forEach(item => {
          const card = createCard(item, type);
          container.appendChild(card);
        });

        loadMoreBtn.dataset.url = data.info.next;

        if (!data.info.next) {
          loadMoreBtn.style.display = 'none';
        } else {
          loadMoreBtn.style.display = 'block';
        }
      })
      .catch(error => {
        console.error('Ошибка:', error);
        container.innerHTML = '<p>Ничего не найдено.</p>';
        loadMoreBtn.style.display = 'none';
      });
  }

  function isDesktop() {
    return window.innerWidth > 530;
  }

  // Обновление результатов по фильтрам
  function updateResults() {
    const filters = getFilterParams();
    loadAndRenderFiltered(baseUrl, containerSelector, type, loadMoreBtn, filters);
  }

  let debounceTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (!isDesktop()) return;
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(updateResults, 500);
    });
  }

  // Обработчики для select фильтров
  if (selects) {
    selects.forEach(select => {
      const wrapper = select.closest('.select-wrapper');

      select.addEventListener('change', () => {
        if (wrapper) {
          const isNotDefault = !select.querySelector('option[disabled]:checked');
          wrapper.classList.toggle('has-value', isNotDefault);
        }
        if (isDesktop()) {
          updateResults();
        }
      });

      if (wrapper) {
        wrapper.addEventListener('click', (e) => {
          if (!e.target.closest('select') && wrapper.classList.contains('has-value')) {
            select.selectedIndex = 0;
            select.dispatchEvent(new Event('change'));
          }
        });
      }
    });
  }

  // Обработчик кнопки LOAD MORE
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      const nextUrl = loadMoreBtn.dataset.url;
      if (nextUrl) {
        fetch(nextUrl)
          .then(response => response.json())
          .then(data => {
            const container = document.querySelector(containerSelector);
            data.results.forEach(item => {
              const card = createCard(item, type);
              container.appendChild(card);
            });

            loadMoreBtn.dataset.url = data.info.next;

            if (!data.info.next) {
              loadMoreBtn.style.display = 'none';
            }
          })
          .catch(error => console.error('Ошибка:', error));
      }
    });
  }

  // Кнопки сброса фильтров
  document.querySelectorAll('.reset-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const filterType = btn.dataset.reset;
      const select = document.querySelector(`select[data-filter="${filterType}"]`);
      if (select) {
        select.selectedIndex = 0;
        updateResults();
      }
    });
  });

  // Инициализация фильтров и загрузка данных
  if (filtersSection) {
    loadFilterOptions();
    updateResults();
  }

  // Мобильное меню
  const burgerBtn = document.querySelector('.burger-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  burgerBtn?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burgerBtn.classList.toggle('open', isOpen);
  });

  // Мобильные фильтры
  const openFiltersBtn = document.querySelector('.open-filters');
  const filtersModal = document.querySelector('.mobile-filters');
  const closeBtn = document.querySelector('.mobile-filters__content-title-wrapper .close-btn');
  const applyFiltersBtn = document.querySelector('.apply-filters');
  const overlay = document.querySelector('.overlay-blur');

  openFiltersBtn?.addEventListener('click', () => {
    filtersModal.classList.add('open');
    overlay.classList.add('visible');
    document.body.classList.add('no-scroll');
  });

  closeBtn?.addEventListener('click', () => {
    filtersModal.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.classList.remove('no-scroll');
  });

  // Применение фильтров из мобильного меню
  function getAllFilters() {
    const allFilters = {};
    document.querySelectorAll('select[data-filter]').forEach(select => {
      if (select.value) {
        allFilters[select.dataset.filter] = select.value;
      }
    });
    if (searchInput && searchInput.value.trim()) {
      allFilters.name = searchInput.value.trim();
    }
    return allFilters;
  }

  function applyFilters(filters = {}) {
    const params = new URLSearchParams(window.location.search);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
  }

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      const filters = getAllFilters();
      applyFilters(filters);
      filtersModal.classList.remove('open');
      overlay.classList.remove('visible');
      document.body.classList.remove('no-scroll');
      updateResults();
    });
  }

  // Детали персонажа, локации и эпизода
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (id && id !== 'null') {
    if (type === 'character') {
      fetch(`https://rickandmortyapi.com/api/character/${id}`)
        .then(res => {
          if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
          return res.json();
        })
        .then(data => {
          const container = document.querySelector('.character-details');
          if (!container) return;

          container.innerHTML = `
            <div class="character-details__portrait">
              <img src="${data.image}" alt="${data.name}">
              <h1>${data.name}</h1>
            </div>
            <div class="character-details__info">
              <div class="character-details__info-block informations-items">
                <h3>Informations</h3>
                <article class="informations__item">
                  <div class="informations__item-contetnt">
                    <h6>Gender</h6>
                    <span>${data.gender}</span>
                  </div>
                </article>
                <article class="informations__item">
                  <div class="informations__item-contetnt">
                    <h6>Status</h6>
                    <span>${data.status}</span>
                  </div>
                </article>
                <article class="informations__item">
                  <div class="informations__item-contetnt">
                    <h6>Species</h6>
                    <span>${data.species}</span>
                  </div>
                </article>
                <article class="informations__item">
                  <div class="informations__item-contetnt">
                    <h6>Origin</h6>
                    <span>${data.origin.name}</span>
                  </div>
                </article>
                <article class="informations__item">
                  <div class="informations__item-contetnt">
                    <h6>Type</h6>
                    <span>${data.type || 'Unknown'}</span>
                  </div>
                </article>
                <article class="informations__item" id="location_url" data-id="${data.location.url.split('/').pop()}">
                  <div class="informations__item-contetnt">
                    <h6>Location</h6>
                    <span>${data.location.name}</span>
                  </div>
                  <div class="informations__item-svg">
                    <img src="assets/images/chevron_right_24px.svg" alt="More" />
                  </div>
                </article>
              </div>
              <div class="character-details__info-block episodes-items">
                <h3>Episodes</h3>
              </div>
            </div>
          `;

          const episodesContainer = container.querySelector('.episodes-items');
          const firstEpisodes = data.episode.slice(0, 4);

          Promise.all(firstEpisodes.map(url => fetch(url).then(res => res.json())))
            .then(episodes => {
              episodes.forEach(epData => {
                const episodeEl = document.createElement('article');
                episodeEl.className = 'episodes__item';
                episodeEl.dataset.id = epData.id;
                episodeEl.innerHTML = `
                  <div class="episodes__item-content">
                    <h6>${epData.episode}</h6>
                    <span>${epData.name}</span>
                    <p>${epData.air_date}</p>
                  </div>
                  <div class="episodes__item-svg">
                    <img src="assets/images/chevron_right_24px.svg" alt="More" />
                  </div>
                `;
                episodesContainer.appendChild(episodeEl);
              });
            });
        })
        .catch(err => {
          console.error('Ошибка загрузки данных персонажа:', err);
        });
    } else if (type === 'location' && id) {
      const container = document.querySelector('section.characters.cards');
      const loadMoreBtn = document.querySelector('.loadmore[data-type="location"]');

      fetch(`https://rickandmortyapi.com/api/location/${id}`)
        .then(res => res.json())
        .then(locationData => {
          // Обновляем заголовок и фильтры
          document.querySelector('.main__title').textContent = locationData.name;
          document.querySelector('.selected-filters__item:nth-child(1) span').textContent = locationData.type;
          document.querySelector('.selected-filters__item:nth-child(2) span').textContent = locationData.dimension;

          const residentsUrls = locationData.residents;
          let currentIndex = 0;
          const PAGE_SIZE = 20;

          // Показываем кнопку сразу, если есть жители
          if (residentsUrls.length > 0) {
            loadMoreBtn.style.display = 'block';
          } else {
            loadMoreBtn.style.display = 'none';
          }

          // Функция загрузки следующей порции жителей
          function renderResidents() {
            const nextResidents = residentsUrls.slice(currentIndex, currentIndex + PAGE_SIZE);
            Promise.all(nextResidents.map(url => fetch(url).then(r => r.json())))
              .then(characters => {
                characters.forEach(character => {
                  const card = createCard(character, 'character');
                  container.appendChild(card);
                });
                currentIndex += PAGE_SIZE;
                if (currentIndex >= residentsUrls.length) {
                  loadMoreBtn.style.display = 'none'; // Скрываем кнопку, если все загружено
                }
              })
              .catch(err => {
                console.error('Ошибка загрузки жителей:', err);
              });
          }

          // Очищаем контейнер и загружаем первую порцию
          container.innerHTML = '';
          renderResidents();

          // Обработчик клика по кнопке "LOAD MORE"
          loadMoreBtn.onclick = () => {
            renderResidents();
          };
        })
        .catch(err => {
          console.error('Ошибка загрузки локации:', err);
          loadMoreBtn.style.display = 'none';
        });
    } else if (type === 'episode') {
      fetch(`https://rickandmortyapi.com/api/episode/${id}`)
        .then(res => res.json())
        .then(episodeData => {
          document.querySelector('.main__title').textContent = episodeData.name;
          document.querySelector('.selected-filters__item:nth-child(1) span').textContent = episodeData.air_date;
          document.querySelector('.selected-filters__item:nth-child(2) span').textContent = episodeData.episode;

          const container = document.querySelector('section.characters.cards');
          container.innerHTML = '';
          const charType = 'character';

          episodeData.characters.forEach(url => {
            fetch(url)
              .then(res => res.json())
              .then(character => {
                const card = createCard(character, charType);
                container.appendChild(card);
              });
          });
        });
    }
  }

  // Обработка клика по локации в деталях персонажа
  document.addEventListener('click', (e) => {
    const locationEl = e.target.closest('#location_url');
    if (locationEl) {
      const id = locationEl.dataset.id;
      if (id) {
        window.location.href = `locations_details.html?id=${id}`;
      }
    }
  });

  // Обработка клика по эпизоду в деталях персонажа
  document.addEventListener('click', (e) => {
    const episodeEl = e.target.closest('.episodes__item');
    if (episodeEl) {
      const id = episodeEl.dataset.id;
      if (id) {
        window.location.href = `episodes_details.html?id=${id}`;
      }
    }
  });

  // Кнопка назад
  const goback = document.querySelector(".goback-btn");
  if (goback) {
    goback.addEventListener("click", () => {
      history.back();
    });
  }
});
