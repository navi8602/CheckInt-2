import { _ } from 'meteor/underscore';
import { Accounts } from 'meteor/accounts-base';
import { Controller } from "angular-ecmascript/module-helpers";

export default class LoginCtrl extends Controller {
    constructor() {
        super(...arguments);
    }

    login() {
        if (_.isEmpty(this.phone)) return;

        const confirmPopup = this.$ionicPopup.confirm({
            title: 'Авторизация',
            template: '<div>Правильно ли указан номер телефона?</div><div>' + this.phone + '</div>',
            cssClass: 'text-center',
            okText: 'Да',
            okType: 'button-positive button-clear',
            cancelText: 'Исправить',
            cancelType: 'button-dark button-clear'
        });

        confirmPopup.then((res) => {
            if (!res) return;

            this.$ionicLoading.show({ template: 'Отправка кода...' });

            Accounts.requestPhoneVerification(this.phone, (err) => {
                this.$ionicLoading.hide();
                if (err) return this.handleError(err);
                this.$state.go('confirmation', {phone: this.phone});
            });
        });
    }

    handleError(err) {
        this.$log.error('Login error ', err);

        this.$ionicPopup.alert({
            title: err.reason || 'Ошибка в наборе номера',
            template: 'Попробуйте снова',
            okType: 'button-positive button-clear'
        });
    }
}

LoginCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log'];