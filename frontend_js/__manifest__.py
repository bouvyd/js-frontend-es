{
    'name': 'JS Frontend Tutorial Support Module',
    'author': 'Damien Bouvy',
    'license': 'GPL-3',
    'version': '1.0',
    'depends': ['website', 'auth_signup'],
    'data': [
        'views/signup_templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'frontend_js/static/src/**/*.js',
            'frontend_js/static/src/**/*.xml',
        ],
    },
    'post_init_hook': 'post_init_hook',
}
