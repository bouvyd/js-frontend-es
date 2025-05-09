from . import controllers, models


def post_init_hook(env):
    """
    Post init hook to set up the website to accept uninvited signups.
    """
    website = env["website"].search([], limit=1)
    website.auth_signup_uninvited = "b2c"
