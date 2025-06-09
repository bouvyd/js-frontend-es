import publicWidget from "@web/legacy/js/public/public_widget";
import { markup } from "@odoo/owl";
import { user } from "@web/core/user";
import { browser } from "@web/core/browser/browser";

publicWidget.registry.HeaderGeneral.include({
    init() {
        this._super.apply(this, arguments);
        this.notification = this.bindService("notification");
    },

    start() {
        const self = this;
        this._super.apply(this, arguments).then(() => {
            if (user.userId === null && !browser.localStorage.getItem("signup_notification_dismissed")) {
                self._showSignupNotification();
            }
        });
    },

    _dismissNotification() {
        browser.localStorage.setItem("signup_notification_dismissed", "true");
    },

    _showSignupNotification() {
        this.notification.add(
            markup(`
                <div>
                    <strong>Hey there!</strong>
                    <p>Signup to enjoy the full experience of our website.</p>
                </div>
            `),
            {
                type: "info",
                sticky: true,
                onClose: () => {
                    this._dismissNotification();
                },
                buttons: [
                    {
                        name: "Sign Up",
                        onClick: () => {
                            window.location.href = "/web/signup";
                        },
                        primary: true,
                    },
                ],
            },
        );
    },
});
