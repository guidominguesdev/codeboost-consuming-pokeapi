const cardPokemon = document.querySelectorAll('.js-open-modal-details-pokemon')
const btnCloseModal = document.querySelector('.js-close-modal-details-pokemon')
const overlayModal = document.querySelector('.js-overlay-modal-details-pokemon')
const areaPokemons = document.getElementById('js-list-pokemons')
const areaTypes = document.getElementById('js-type-area')
const buttonLoadMore = document.getElementById('js-button-load-more')
const countPokemons = document.getElementById('js-count-pokemons')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

cardPokemon.forEach((card) => {
  card.addEventListener('click', openDetailsPokemon)
})

function createCardPokemons(namePok, codePok, imagePok, typePok) {
  const card = document.createElement('button')

  card.setAttribute('code-pokemon', codePok)
  card.classList = `card-pokemon ${typePok} js-open-modal-details-pokemon`
  areaPokemons.appendChild(card)

  const image = document.createElement('div')
  image.classList = 'image'
  card.appendChild(image)

  const imageSrc = document.createElement('img')
  imageSrc.className = 'thumb-img'
  imageSrc.setAttribute('src', imagePok)
  image.appendChild(imageSrc)

  const infoCardPokemon = document.createElement('div')
  infoCardPokemon.classList = 'info'
  card.appendChild(infoCardPokemon)

  const infoTextPokemon = document.createElement('div')
  infoTextPokemon.classList = 'text'
  infoCardPokemon.appendChild(infoTextPokemon)

  const codePokemon = document.createElement('span')
  codePokemon.textContent =
    codePok < 10
      ? `#00${codePok}`
      : codePok < 100
      ? `#0${codePok}`
      : `#${codePok}`
  infoTextPokemon.appendChild(codePokemon)

  const namePokemon = document.createElement('h3')
  namePokemon.textContent = capitalizeFirstLetter(namePok)
  infoTextPokemon.appendChild(namePokemon)

  const areaIcon = document.createElement('div')
  areaIcon.classList = 'icon'
  infoCardPokemon.appendChild(areaIcon)

  const imageType = document.createElement('img')
  imageType.setAttribute('src', `dist/svg/icon-types/${typePok}.svg`)
  areaIcon.appendChild(imageType)
}

function listPokemons(urlApi) {
  // eslint-disable-next-line no-undef
  axios({
    method: 'GET',
    url: urlApi,
  }).then((response) => {
    const { results, count } = response.data

    countPokemons.innerText = count

    results.forEach((pokemon) => {
      const urlApiDetails = pokemon.url

      // eslint-disable-next-line no-undef
      axios({
        method: 'GET',
        url: `${urlApiDetails}`,
      }).then((response) => {
        const { name, id, sprites, types } = response.data

        const infoCard = {
          namePok: name,
          codePok: id,
          imagePok: sprites.other.dream_world.front_default,
          typePok: types[0].type.name,
        }

        createCardPokemons(
          infoCard.namePok,
          infoCard.codePok,
          infoCard.imagePok,
          infoCard.typePok,
        )

        const cardPokemon = document.querySelectorAll(
          '.js-open-modal-details-pokemon',
        )

        cardPokemon.forEach((card) => {
          card.addEventListener('click', openDetailsPokemon)
        })
      })
    })
  })
}

listPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0')

function openDetailsPokemon() {
  document.documentElement.classList.add('open-modal')

  const codePokemon = this.getAttribute('code-pokemon')
  const imagePokemon = this.querySelector('.thumb-img')
  const iconTypePokemon = this.querySelector('.info .icon img')
  const namePokemon = this.querySelector('.info .text h3')
  const codeStringPokemon = this.querySelector('.info .text span')

  const iconTypePokemonModal = document.getElementById('js-image-type-modal')
  const imagePokemonModal = document.getElementById('js-image-pokemon-modal')
  const modalDetails = document.getElementById('js-modal-details-pokemon')
  const namePokemonModal = document.getElementById('js-name-pokemon-modal')
  const codePokemonModal = document.getElementById('js-code-pokemon-modal')
  const heightPokemonModal = document.getElementById('js-height-pokemon')
  const weightPokemonModal = document.getElementById('js-weight-pokemon')
  const mainAbilitiesPokemonModal = document.getElementById('js-main-abilities')

  imagePokemonModal.setAttribute('src', imagePokemon.getAttribute('src'))
  modalDetails.setAttribute('type-pokemon-modal', this.classList[1])
  iconTypePokemonModal.setAttribute('src', iconTypePokemon.getAttribute('src'))

  namePokemonModal.textContent = namePokemon.textContent
  codePokemonModal.textContent = codeStringPokemon.textContent

  // eslint-disable-next-line no-undef
  axios({
    method: 'GET',
    url: `https://pokeapi.co/api/v2/pokemon/${codePokemon}`,
  }).then((response) => {
    const data = response.data

    const infoPokemon = {
      mainAbilities: capitalizeFirstLetter(data.abilities[0].ability.name),
      types: data.types,
      weight: data.weight,
      height: data.height,
      abilities: data.abilities,
      stats: data.stats,
      urlType: data.types[0].type.url,
    }

    function listTypesPokemon() {
      const areaTypesModal = document.getElementById('js-types-pokemon')
      areaTypesModal.innerHTML = ''

      const arrayTypes = infoPokemon.types

      arrayTypes.forEach((itemType) => {
        const itemList = document.createElement('li')
        areaTypesModal.appendChild(itemList)

        const spanList = document.createElement('span')
        spanList.classList = `type-tag ${itemType.type.name}`
        spanList.textContent = capitalizeFirstLetter(itemType.type.name)
        itemList.appendChild(spanList)
      })
    }

    function listWeaknesses() {
      const areaWeak = document.getElementById('js-area-weak')

      areaWeak.innerHTML = ''

      // eslint-disable-next-line no-undef
      axios({
        method: 'GET',
        url: `${infoPokemon.urlType}`,
      }).then((response) => {
        const weaknesses = response.data.damage_relations.double_damage_from

        weaknesses.forEach((itemType) => {
          const itemListWeak = document.createElement('li')
          areaWeak.appendChild(itemListWeak)

          const spanList = document.createElement('span')
          spanList.classList = `type-tag ${itemType.name}`
          spanList.textContent = capitalizeFirstLetter(itemType.name)
          itemListWeak.appendChild(spanList)
        })
      })
    }

    heightPokemonModal.textContent = `${infoPokemon.height / 10}m`
    weightPokemonModal.textContent = `${infoPokemon.weight / 10}kg`
    mainAbilitiesPokemonModal.textContent = infoPokemon.mainAbilities

    const statsHp = document.getElementById('js-stats-hp')
    const statsAttack = document.getElementById('js-stats-attack')
    const statsDefense = document.getElementById('js-stats-defense')
    const statsSpAttack = document.getElementById('js-stats-sp-attack')
    const statsSpDefense = document.getElementById('js-stats-sp-defense')
    const statsSpeed = document.getElementById('js-stats-speed')

    statsHp.style.width = `${infoPokemon.stats[0].base_stat}%`
    statsAttack.style.width = `${infoPokemon.stats[1].base_stat}%`
    statsDefense.style.width = `${infoPokemon.stats[2].base_stat}%`
    statsSpAttack.style.width = `${infoPokemon.stats[3].base_stat}%`
    statsSpDefense.style.width = `${infoPokemon.stats[4].base_stat}%`
    statsSpeed.style.width = `${infoPokemon.stats[5].base_stat}%`

    listTypesPokemon()
    listWeaknesses()
  })
}

function closeDetailsPokemon() {
  document.documentElement.classList.remove('open-modal')
}

btnCloseModal.addEventListener('click', closeDetailsPokemon)
overlayModal.addEventListener('click', closeDetailsPokemon)

// Listing Menu
// eslint-disable-next-line no-undef
axios({
  method: 'GET',
  url: 'https://pokeapi.co/api/v2/type',
}).then((response) => {
  const { results } = response.data

  results.forEach((type, index) => {
    if (index < 18) {
      const itemType = document.createElement('li')
      areaTypes.appendChild(itemType)

      const buttonType = document.createElement('button')
      buttonType.classList = `type-filter ${type.name}`
      buttonType.setAttribute('code-type', index + 1)
      itemType.appendChild(buttonType)

      const iconType = document.createElement('div')
      iconType.classList = 'icon'
      buttonType.appendChild(iconType)

      const srcType = document.createElement('img')
      srcType.setAttribute('src', `dist/svg/icon-types/${type.name}.svg`)
      iconType.appendChild(srcType)

      const nameType = document.createElement('span')
      nameType.textContent = capitalizeFirstLetter(type.name)
      buttonType.appendChild(nameType)

      const allTypes = document.querySelectorAll('.type-filter')

      allTypes.forEach((btn) => {
        btn.addEventListener('click', filterByTypes)
      })
    }
  })
})

let countPagination = 10

function showMorePokemons() {
  listPokemons(
    `https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPagination}`,
  )

  countPagination = countPagination + 9
}

buttonLoadMore.addEventListener('click', showMorePokemons)

function filterByTypes() {
  const idPok = this.getAttribute('code-type')
  const allTypes = document.querySelectorAll('.type-filter')
  const buttonLoadMore = document.getElementById('js-button-load-more')
  const areaPokemons = document.getElementById('js-list-pokemons')

  areaPokemons.innerHTML = ''
  buttonLoadMore.style.display = 'none'

  const sectionPokemons = document.querySelector('.s-all-info-pokemons')
  const topSection = sectionPokemons.offsetTop

  window.scrollTo({
    top: topSection + 288,
    behavior: 'smooth',
  })

  allTypes.forEach((type) => {
    type.classList.remove('active')
  })

  this.classList.add('active')

  if (idPok) {
    // eslint-disable-next-line no-undef
    axios({
      method: 'GET',
      url: `https://pokeapi.co/api/v2/type/${idPok}`,
    }).then((response) => {
      const { pokemon } = response.data

      countPokemons.textContent = pokemon.length

      pokemon.forEach((pok) => {
        const { url } = pok.pokemon

        // eslint-disable-next-line no-undef
        axios({
          method: 'GET',
          url: `${url}`,
        }).then((response) => {
          const { name, id, sprites, types } = response.data

          const infoCard = {
            namePok: name,
            codePok: id,
            imagePok: sprites.other.dream_world.front_default,
            typePok: types[0].type.name,
          }

          if (infoCard.imagePok) {
            createCardPokemons(
              infoCard.namePok,
              infoCard.codePok,
              infoCard.imagePok,
              infoCard.typePok,
            )
          }

          const cardPokemon = document.querySelectorAll(
            '.js-open-modal-details-pokemon',
          )

          cardPokemon.forEach((card) => {
            card.addEventListener('click', openDetailsPokemon)
          })
        })
      })
    })
  } else {
    areaPokemons.innerHTML = ''

    listPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0')

    buttonLoadMore.style.display = 'block'
  }
}

const buttonSearch = document.getElementById('js-button-search')
const inputSearch = document.getElementById('js-input-search')

buttonSearch.addEventListener('click', searchPokemon)
inputSearch.addEventListener('keyup', (event) => {
  if (event.code === 'Enter') {
    searchPokemon()
  }
})

function searchPokemon() {
  const valueInput = inputSearch.value.toLowerCase()
  const typeFilter = document.querySelectorAll('.type-filter')

  typeFilter.forEach((type) => {
    type.classList.remove('active')
  })

  // eslint-disable-next-line no-undef
  axios({
    method: 'GET',
    url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`,
  })
    .then((response) => {
      areaPokemons.innerHTML = ''
      buttonLoadMore.style.display = 'none'
      countPokemons.textContent = 1

      const { name, id, sprites, types } = response.data

      const infoCard = {
        namePok: name,
        codePok: id,
        imagePok: sprites.other.dream_world.front_default,
        typePok: types[0].type.name,
      }

      createCardPokemons(
        infoCard.namePok,
        infoCard.codePok,
        infoCard.imagePok,
        infoCard.typePok,
      )

      const cardPokemon = document.querySelectorAll(
        '.js-open-modal-details-pokemon',
      )

      cardPokemon.forEach((card) => {
        card.addEventListener('click', openDetailsPokemon)
      })
    })
    .catch((error) => {
      if (error.response) {
        areaPokemons.innerHTML = ''
        buttonLoadMore.style.display = 'none'
        countPokemons.textContent = 0
      }
    })
}
