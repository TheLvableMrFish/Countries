import { LitElement, html } from "lit";

class Header extends LitElement{
    createRenderRoot(){
        return this;
    }

    static properties = {
        darkMode: {type: Boolean},
        darkModeColor: {type: String},
        lightModeColor: {type: String},
    }

    constructor(){
        super()
        this.darkMode = localStorage.getItem('darkMode') === 'true'
        this.darkModeColor = 'hsl(0, 0%, 30%)'
        this.lightModeColor = 'hsl(0, 0%, 98%)'
        this.setBackgroundColor()
    }

    connectedCallback(){
        super.connectedCallback()
    }

    setBackgroundColor(){
        document.body.style.backgroundColor = this.darkMode ? this.darkModeColor : this.lightModeColor
        document.documentElement.style.backgroundColor = this.darkMode ? this.darkModeColor : this.lightModeColor
    }

    handleScreenMode(){
        this.darkMode = !this.darkMode
        console.log(this.darkMode)
        document.body.style.backgroundColor = this.darkMode ? this.darkModeColor : this.lightModeColor
        document.documentElement.style.backgroundColor = this.darkMode ? this.darkModeColor : this.lightModeColor
        localStorage.setItem('darkMode', this.darkMode.toString())
        


        this.dispatchEvent(new CustomEvent('dark-mode-toggle',{
            detail: { darkMode: this.darkMode},
            bubbles: true,
            composed: true
        }))
        
    }

    render(){
        return html`
        
            <nav class="navbar navbar-expand-lg nav-container ${this.darkMode ? "dark-mode" :null}">
                <div class="container">
                    <div class="navbar-brand nav-title" href="#">Where in the world?</div>                    
                    <form class="d-flex ">
                        
                        <div class="btn ${this.darkMode ? "dark-mode-btn" : null}"
                            @click=${()=> this.handleScreenMode()}
                        >
                        <i class="fa-regular fa-moon moon-icon "></i> Dark Mode</div>
                    </form>
                    </div>
                </div>
            </nav>

        `
    }
}

customElements.define('page-header', Header)