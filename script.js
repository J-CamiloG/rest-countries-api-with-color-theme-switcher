"use strict";
const menu = document.querySelector(".menu");
const lightMode = document.querySelector(".light-mode");
const darkMode = document.querySelector(".dark-mode");
const menuTitle = document.querySelector(".menu-title");
class NavMenu {
  constructor() {
    menu.addEventListener("click", this._ligthMode.bind(this));
  }
  _ligthMode() {
    lightMode.classList.toggle("hidden");
    darkMode.classList.toggle("hidden");

    const isDarkMode = darkMode.classList.contains("hidden");
    document.querySelector("body").classList.toggle("light-mode", !isDarkMode);
    menuTitle.textContent = !isDarkMode ? "Dark Mode" : "Light Mode";
    localStorage.setItem(
      "modePreference",
      !isDarkMode ? "light-mode" : "dark-mode"
    );
  }
}

const countrydata = document.querySelector(".country-data");
const inputSearch = document.getElementById("input-search");
const inputSection = document.querySelector(".input-section");
const region = document.getElementById("region");
const selectedCountry = document.querySelector(".selected-country");
class MainMenu {
  #newData;
  #originalData;
  constructor() {
    this._fetchData();
    this._applyModePreference();
    region.addEventListener("change", this._regionFilter.bind(this));
    inputSearch.addEventListener("input", this._countryFilter.bind(this));
    countrydata.addEventListener("click", this._countrySelect.bind(this));
  }

  _fetchData() {
    fetch("./data.json")
      .then((res) => res.json())
      .then((data) => {
        this.#originalData = data;
        this.#newData = this.#originalData;
        this._renderCountry(this.#newData);
      })
      .catch((error) => console.log(error));
  }

  _selectBorder(e) {
    const el = e.target.closest("button");
    if (!el) return;

    const findSelectedCountry = this.#originalData.find(
      (data) => data.name.toLowerCase() === el.textContent.trim().toLowerCase()
    );
    this._renderSelectedCountry(findSelectedCountry);
  }

  _countrySelect(e) {
    e.preventDefault();
    const el = e.target.closest(".country-box");
    if (!el) return;

    const indexes = +el.dataset.index;
    const selectedCountry = this.#newData[indexes];
    this._renderSelectedCountry(selectedCountry, indexes);
  }

  _countryFilter(e) {
    const inputVal = e.target.value.toLowerCase();
    const regionVal = region.value;

    !inputVal
      ? (this.#newData = this.#originalData.filter(
          (data) =>
            data.region === regionVal ||
            regionVal === "All" ||
            regionVal === "filterRegion"
        ))
      : (this.#newData = this.#originalData.filter(
          (data) =>
            data.name.toLowerCase().includes(inputVal) &&
            (data.region === regionVal ||
              regionVal === "All" ||
              regionVal === "filterRegion")
        ));

    this._renderCountry(this.#newData);
  }
  _regionFilter() {
    const regionVal = region.value;
    regionVal === "All" || regionVal === "filterRegion"
      ? (this.#newData = this.#originalData)
      : (this.#newData = this.#originalData.filter(
          (data) => data.region === regionVal
        ));

    this._renderCountry(this.#newData);
  }

  _renderCountry(data) {
    countrydata.innerHTML = "";

    data.forEach((el, i) => {
      const { png } = el.flags;

      const html = `
      <article class="country-box box flex flex-col" data-index = '${i}'>
        <div class="img-flag">
        <img src="${png}" alt="" />
        </div>
        <div class="country-info">
        <h2 class="country-name">${el.name}</h2>
        <p class="population">Population:${el.population.toLocaleString()}</p>
        <p class="region">Region:${el.region}</p>
        <p class="capital">Capital:${el.capital ?? "No Capital"}</p>
        </div>
      </article> 
      `;
      countrydata.insertAdjacentHTML("beforeend", html);
    });
  }

  _renderSelectedCountry(data, i) {
    selectedCountry.innerHTML = "";
    const { png } = data.flags;
    const [domain] = data.topLevelDomain;
    const language = data.languages.map((data) => data.name).join(", ");

    const filterBorder = this.#originalData.filter((datas) => {
      if (!data.borders) return false;
      return data.borders.includes(datas.alpha3Code);
    });

    const borderCountryName =
      filterBorder.length > 0
        ? filterBorder
            .map((border) => `<button> ${border.name} </button>`)
            .join("")
        : " No border Countries";
    const html = `
      <button class = 'btn-back'>
      Go back</button>
      <div class = 'flex flex-col'>
        <div class = 'img-selected'>
        <img src ='${png}' alt= ''>
        </div>
        <div class = 'selected-info'>
        <h1> ${data.name}
        </h1>
        <div class = 'flex flex-col'>
          <div>
          <p> Native Name: <span>${data.nativeName}
          </span></p>
          <p> Population: <span>${data.population.toLocaleString()}
          </span></p>
          <p> Region: <span>${data.region}
          </span></p>
          <p> Sub Region:<span> ${data.subregion}
          </span></p>
          <p> Capital: <span>${data.capital ?? "No Capital"}
          </span></p>
          </div>
          <div>
          <p>Top Level Domain:<span> ${domain}
          </span></p>
          <p>Currencies: <span> ${
            data.currencies ? data.currencies[0].name : "No currency"
          }
          </span></p>
          <p>Languages:<span> ${language}
          </span></p>
          </div>
        </div>
        <p class = 'btn-border flex flex-col'>
        <span>
        Border Countries: 
        </span>
          <span class ='flex'> ${borderCountryName}</span>
         </p>
        </div>
  
      </div>
    `;
    selectedCountry.insertAdjacentHTML("beforeend", html);

    countrydata.classList.add("hide-country");
    inputSection.classList.add("hide-country");
    selectedCountry.classList.add("show-selected");

    document
      .querySelector(".btn-back")
      .addEventListener("click", this.buttonBack);

    document
      .querySelector(".btn-border")
      .addEventListener("click", this._selectBorder.bind(this));
  }
  buttonBack() {
    countrydata.classList.remove("hide-country");
    inputSection.classList.remove("hide-country");
    selectedCountry.classList.remove("show-selected");
  }
  _applyModePreference() {
    const modePreference = localStorage.getItem("modePreference");
    const isDarkMode = modePreference === "dark-mode";
    document.querySelector("body").classList.toggle("light-mode", !isDarkMode);
    lightMode.classList.toggle("hidden", !isDarkMode);
    darkMode.classList.toggle("hidden", isDarkMode);
    menuTitle.textContent = !isDarkMode ? "Dark Mode" : "Light Mode";
  }
}

const mainMenu = new MainMenu();
const nav = new NavMenu();
