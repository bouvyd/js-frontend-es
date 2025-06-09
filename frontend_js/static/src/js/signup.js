import publicWidget from "@web/legacy/js/public/public_widget";
import { rpc } from "@web/core/network/rpc";

// This widget controls the whole signup form
publicWidget.registry.SignUpForm.include({
    selector: ".oe_signup_form",

    init() {
        this._super.apply(this, arguments);
        this.countrySelector = null; // Placeholder for the country selector widget
        this.notification = this.bindService("notification");
    },

    start() {
        return this._super.apply(this, arguments).then(() => {
            const countrySelectorDiv = this.el.querySelector("#oe_signup_country_selector");
            this.countrySelectorWidget = new CountrySelector(this);
            countrySelectorDiv.innerHTML = ""; // Clear the div before appending the widget
            this.countrySelectorWidget.appendTo(countrySelectorDiv);
        });
    },

    _onSubmit(event) {
        const countrySelect = this.el.querySelector("select[name='country_id']");
        if (!countrySelect || !countrySelect.value) {
            event.preventDefault();
            this.notification.add("Please select a country.", {
                type: "danger",
            });
            return;
        }
        const countryNeedsVat = this.countrySelectorWidget.vatRequired;
        const vatInput = this.el.querySelector("input[name='vat']");
        if (countryNeedsVat && !vatInput.value) {
            event.preventDefault();
            this.notification.add("Please provide a VAT number for European countries.", {
                type: "danger",
            });
            return;
        }
        this._super.apply(this, arguments);
    }
});

// This widget is only the country selector
const CountrySelector = publicWidget.Widget.extend({
    template: "frontend_js.country_selector",
    events: {
        "change select[name='country_id']": "_onCountryChange",
    },

    init() {
        this._super.apply(this, arguments);
        this.countries = [];
        this.selectedCountryId = null;
        this.vatRequired = false;
    },
    
    async start() {
        return Promise.all([
            this._super.apply(this, arguments),
            this._loadCountries(),
        ]);
    },

    _loadCountries() {
        return rpc('/signup/countries').then(countries => {
            this.countries = countries;
            this.renderElement();
        });
    },

    _onCountryChange(event) {
        const countryId = parseInt(event.target.value);
        const country = this.countries.find(c => c.id === countryId);
        if (!country) {
            console.warn(`Country with ID ${countryId} not found`);
            return;
        }
        this.selectedCountryId = countryId;
        this.vatRequired = country.is_european;
        this.renderElement();
    },
});

