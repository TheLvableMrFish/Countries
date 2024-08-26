import { LitElement, html } from "lit";

import axios from 'axios'

class Countries extends LitElement{
    
    static properties = {
        countries: {type: Array},
        filterText: {type: Array},
        selectedCountryName: {type: String},
        selectedCountry: {type: Object},
        selectedRegion: {type: String},
        darkMode: {type: Boolean}
    }

    constructor(){
        super()
        this.countries = []
        this.filterText = ''
        this.selectedCountryName = null
        this.selectedCountry = null
        this.selectedRegion = ''
        this.darkMode = localStorage.getItem('darkMode') === 'true' 
    }

    createRenderRoot(){
        return this;
    }

    connectedCallback(){
        super.connectedCallback()
        this.fetchCountries()

        window.addEventListener('dark-mode-toggle', this.handleDarkModeToggle.bind(this))
    }

    disconnectedCallback(){
        super.disconnectedCallback()
        window.removeEventListener('dark-mode-toggle', this.handleDarkModeToggle.bind(this))
    }

    async fetchCountries(){
        try{
            const response = await axios.get('https://restcountries.com/v3.1/all')
            this.countries = response.data
        } catch(error){
            console.log('Error fetching countries: ', error)
        }
    }

    handleDarkModeToggle(){
        this.darkMode = !this.darkMode
        this.requestUpdate()
    }

    handleInputChange(e){
        this.filterText = e.target.value
    }

    handleRegionChange(e){
        this.selectedRegion = e.target.value
        this.requestUpdate()
    }

    handleCountryClick(countryName){
        this.selectedCountryName = countryName
        this.selectedCountry = this.getSelectedCountryInfo()
        this.requestUpdate()
    }

    getCountryNameByCode(code){
        const country = this.countries.find(country => country.cca3 === code)
        return country ? country.name.common : code
    }

    

    getSelectedCountryInfo(){
        const country = this.countries.find(country => country.name.common.toLowerCase() === this.selectedCountryName.toLowerCase())
        
        if(!country){
            return null
        }

        
        const nativeNameObj = country.name.nativeName
        const firstNativeName = nativeNameObj ? Object.values(nativeNameObj) : null
        const nativeName = firstNativeName ? firstNativeName[0].official : 'N/A'

        const borderCountries = country.borders ? country.borders.map(code => this.getCountryNameByCode(code)): false
        

        return {   
            countryName: country.name.common,
            nativeName: nativeName,
            population: country.population,
            region: country.region,
            subRegion: country.subregion,
            capital: country.capital[0],
            topLevelDomain: country.tld,
            currencies: Object.values(country.currencies).map(c => `${c.name}`).join(', '),
            languages: Object.values(country.languages).join(', '),
            flagUrl: country.flags.png,
            borders: borderCountries
        } 
        
    }

    render(){

        
        // Filter countries based on filter text
        const filteredCountries = this.countries.filter((country)=>{
                return country.name.common
                    .toLowerCase()
                    .includes(this.filterText.toLowerCase()) && (this.selectedRegion === '' || country.region.toLowerCase() === this.selectedRegion.toLowerCase())
            }
        )

        // Get selected country info
        // const selectedCountry = this.getSelectedCountryInfo()
        const selectedCountry = this.selectedCountry

        return html`
            <div class="container mt-3 ${this.darkMode ? "dark-mode-background" :null}">

            ${!selectedCountry ? html`

                <div class="row mb-3 ">
                    <div class="search-bar-box col-md-7 col-xl-3 mb-4">
                        <div class="search-bar">
                            <input 
                                class="form-control me-2 ${this.darkMode ? "dark-mode-form" :null}" 
                                type="text" 
                                placeholder="Search for a country..." 
                                aria-label="Search" 
                                @input=${this.handleInputChange}>
                        </div>
                        <i class="fas fa-search search-bar-icon"></i>
                    
                    </div>
                    <div class="col-md-5 col-xl-9 d-flex justify-content-end">
                        <div class="search-bar col-2 region-dropdown mb-4">
                            <select 
                                class="form-select dropdown-form ${this.darkMode ? "dark-mode-form" :null}" 
                                aria-label="Default select example" 
                                @change=${this.handleRegionChange}
                                >
                                <option value="" disabled selected hidden>Filter by Region</option>
                                <option value="africa">Africa</option>
                                <option value="americas">America</option>
                                <option value="asia">Asia</option>
                                <option value="europe">Europe</option>
                                <option value="oceania">Oceania</option>
                            </select>
                        </div>
                    </div>
                </div>

                
                <div class="row">
                    ${filteredCountries.map(
                        country => html`
                            <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 box-container ">
                                <div class="box ${this.darkMode ? "dark-mode-form" :null}"
                                    @click=${()=> this.handleCountryClick(country.name.common)}
                                >
                                    <img class="img-fluid img-sizing " src=${country["flags"]["png"]} />
                                    <div class="text-box ">
                                    
                                        <h4 class="bold-title">${country.name.common}</h4>
                                        <p class="text"><span class="bold">Population:</span> ${country.population}</p>
                                        <p class="text"><span class="bold">Region:</span> ${country.region}</p>
                                        <p class="text"><span class="bold">Capital:</span> ${country.capital}</p>
                                    
                                    </div>
                                </div>
                                
                            </div>
                        `
                    )}
                </div>`
            :null}
                


                ${selectedCountry ? html`
                <div class="row">
                    <div class="back-btn ${this.darkMode ? "dark-mode-form" :null}"
                        @click=${()=> this.handleCountryClick('')}
                    >
                        <- Back
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6 col-xl-6 mt-3">
                        <div class="img">
                        
                            <img class="single-flag-img" src=${selectedCountry.flagUrl} />
                        
                        </div>
                    </div>

                    <div class="col-12 col-md-6 col-xl-6 mt-3">
                        <div class="row">
                        
                            <h4 class="mb-3 mt-5">${selectedCountry.countryName}</h4>

                            <div class="col-xl-6 mb-3">
                                <p><b>Native Name:</b> ${selectedCountry.nativeName}</p>
                                <p><b>Population:</b> ${selectedCountry.population}</p>
                                <p><b>Region:</b> ${selectedCountry.region}</p>
                                <p><b>Subregion:</b> ${selectedCountry.subRegion}</p>
                                <p><b>Capital:</b> ${selectedCountry.capital}</p>
                            </div>

                            <div class="col-xl-6 mb-3">
                                <p><b>Top level Domain:</b> ${selectedCountry.topLevelDomain}</p>
                                <p><b>Currencies:</b> ${selectedCountry.currencies}</p>
                                <p><b>Languages:</b> ${selectedCountry.languages}</p>
                            </div>

                            <div class="borders mb-3 col-xl-12">
                                <div class="border-box mb-3"><b>Border Countries:</b> ${selectedCountry.borders ? selectedCountry.borders.map(border => html`
                                    <div class="country-border ${this.darkMode ? "dark-mode-form" :null}"
                                        @click=${()=> this.handleCountryClick(border)}
                                    >
                                        ${border}
                                    </div>
                                `) : "None"
                                } </div>
                            </div>

                        </div>

                    </div>

                </div>`
                : null}

                

              
            </div>
     
        `
    }
}

customElements.define('countries-page', Countries)