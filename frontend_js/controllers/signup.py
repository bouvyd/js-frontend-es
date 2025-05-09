from odoo import _
from odoo.addons.auth_signup.controllers.main import AuthSignupHome
from odoo.exceptions import ValidationError
from odoo.http import request, route


CUSTOM_SIGNUP_REQUEST_PARAMS = {'country_id', 'vat'}


class TrainingSignupController(AuthSignupHome):
    @route('/signup/countries', type='json', auth='public', website=True, sitemap=False)
    def get_countries(self):
        """
        Return a list of countries to be used in the signup form.
        This can be used to populate the country selection in the signup form.
        Each country will have an 'is_european' field indicating if it is part of the European Union.
        :return: List of countries
        """
        countries = request.env['res.country'].search([])
        europe_country_group = request.env.ref('base.europe')
        def is_european(country):
            return country in europe_country_group.country_ids
        return [{'id': country.id, 'name': country.name, 'is_european': is_european(country)} for country in countries]

    def _prepare_signup_values(self, qcontext):
        """
        Override the method to add custom parameters to the signup values.
        These values are used to create the user.
        """
        values = super()._prepare_signup_values(qcontext)
        for param in CUSTOM_SIGNUP_REQUEST_PARAMS:
            if param in request.params:
                values[param] = request.params[param]
        return values
