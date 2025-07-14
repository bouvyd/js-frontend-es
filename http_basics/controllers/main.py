from odoo.http import Controller, request, route


class DemoController(Controller):
    @route('/echo', type='http', auth='public')
    def echo(self, word=None, **kwargs):
        """
        Echoes the request parameters as a text response. Remembers the last word
        in the session and includes it in the response if available. Also checks for
        a custom header and includes it in the response if present.
        """
        response = "Hello there!\n"
        response_headers = {}
        last_word = request.session.get('last_word')
        if word:
            response = f"Hello {word}!\n"
            request.session['last_word'] = word
        if request.httprequest.headers.get('X-Custom-Header'):
            response += f"Custom header received: \"{request.httprequest.headers['X-Custom-Header']}\"\n"
            response_headers['X-Custom-Header'] = request.httprequest.headers['X-Custom-Header']
        if last_word:
            response += f"Last word was: {last_word}\n"
        response += "Goodbye!\n"
        return request.make_response(response, headers=response_headers)

    @route('/echo-json', type='http', auth='public', methods=['POST'], csrf=False)
    def echo_json(self, **kwargs):
        """
        Echoes the request parameters as a JSON response, and include the user name.
        """
        json_data = request.get_json_data()
        user = request.env.user
        if user.is_public:
            username = "public"
        else:
            username = user.name
        response = {
            "message": json_data,
            "user": username,
        }
        return request.make_json_response(response)