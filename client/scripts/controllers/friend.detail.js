import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { Controller } from "angular-ecmascript/module-helpers";

export default class FriendDetail extends Controller {
    constructor() {
        super(...arguments);
        var self = this;
        this.contactId = this.$stateParams.contactId;

        this.math = [];
        this.mathFlag = false;
        this.phone = '';
        this.contactName = '';
        this.interest = [
            {text: 'Дружба', checked: self.math.indexOf('Дружба') > -1 ? true : false},
            {text: 'Бизнес', checked: self.math.indexOf('Бизнес') > -1 ? true : false},
            {text: 'Встреча', checked: self.math.indexOf('Встреча') > -1 ? true : false},
            {text: 'Отношения', checked: self.math.indexOf('Отношения') > -1 ? true : false},
            {text: 'Свадьба', checked: self.math.indexOf('Свадьба') > -1 ? true : false},
            {text: 'Дети', checked: self.math.indexOf('Дети') > -1 ? true : false},
            {text: 'Путешествия', checked: self.math.indexOf('Путешествия') > -1 ? true : false},
            {text: 'Спорт', checked: self.math.indexOf('Спорт') > -1 ? true : false},
            {text: 'Учеба', checked: self.math.indexOf('Учеба') > -1 ? true : false},
            {text: 'Культура', checked: self.math.indexOf('Культура') > -1 ? true : false},
            {text: 'Вещи', checked: self.math.indexOf('Вещи') > -1 ? true : false},
            {text: 'Стиль жизни', checked: self.math.indexOf('Стиль жизни') > -1 ? true : false}
        ];
        this.subscribe('interestSomeUserId', function () {

            this.math = [];
            this.mathFlag = false;

            this.item = Interest.findOne({to_id: self.contactId});
            this.phone = this.item.to_phone;
            this.contactName = this.item.to_name;

            if (this.item) {

                var phone = Meteor.user().phone.number;

                var someSend = Interest.findOne({to_phone: phone, from_phone: this.item.to_phone});

                if (someSend && someSend.name) {
                    for (var k in someSend.name) {
                        if (self.item.name.indexOf(someSend.name[k]) > -1) {
                            self.math.push(someSend.name[k]);
                        }
                    }
                }

                this.interest = [
                    {text: 'Дружба', checked: self.math.indexOf('Дружба') > -1 ? true : false},
                    {text: 'Бизнес', checked: self.math.indexOf('Бизнес') > -1 ? true : false},
                    {text: 'Встреча', checked: self.math.indexOf('Встреча') > -1 ? true : false},
                    {text: 'Отношения', checked: self.math.indexOf('Отношения') > -1 ? true : false},
                    {text: 'Свадьба', checked: self.math.indexOf('Свадьба') > -1 ? true : false},
                    {text: 'Дети', checked: self.math.indexOf('Дети') > -1 ? true : false},
                    {text: 'Путешествия', checked: self.math.indexOf('Путешествия') > -1 ? true : false},
                    {text: 'Спорт', checked: self.math.indexOf('Спорт') > -1 ? true : false},
                    {text: 'Учеба', checked: self.math.indexOf('Учеба') > -1 ? true : false},
                    {text: 'Культура', checked: self.math.indexOf('Культура') > -1 ? true : false},
                    {text: 'Вещи', checked: self.math.indexOf('Вещи') > -1 ? true : false},
                    {text: 'Стиль жизни', checked: self.math.indexOf('Стиль жизни') > -1 ? true : false}
                ];

                this.mathFlag = this.math.length > 0 ? true : false;

                if (!this.mathFlag) {

                    this.interest = [
                        {text: 'Дружба', checked: self.item.name.indexOf('Дружба') > -1 ? true : false},
                        {text: 'Бизнес', checked: self.item.name.indexOf('Бизнес') > -1 ? true : false},
                        {text: 'Встреча', checked: self.item.name.indexOf('Встреча') > -1 ? true : false},
                        {text: 'Отношения', checked: self.item.name.indexOf('Отношения') > -1 ? true : false},
                        {text: 'Свадьба', checked: self.item.name.indexOf('Свадьба') > -1 ? true : false},
                        {text: 'Дети', checked: self.item.name.indexOf('Дети') > -1 ? true : false},
                        {text: 'Путешествия', checked: self.item.name.indexOf('Путешествия') > -1 ? true : false},
                        {text: 'Спорт', checked: self.item.name.indexOf('Спорт') > -1 ? true : false},
                        {text: 'Учеба', checked: self.item.name.indexOf('Учеба') > -1 ? true : false},
                        {text: 'Культура', checked: self.item.name.indexOf('Культура') > -1 ? true : false},
                        {text: 'Вещи', checked: self.item.name.indexOf('Вещи') > -1 ? true : false},
                        {text: 'Стиль жизни', checked: self.item.name.indexOf('Стиль жизни') > -1 ? true : false}
                    ];

                }
            }
        });

        this.$scope.data = {visible: false};

        this.$scope.historyBack = function () {
            window.history.back();
        };


    }

    sendAgainFlag() {
        for(let i in this.interest) {
            if(this.interest[i].checked == true) {
                return false;
            }
        }
        
        return true;
    }

    sendFlag() {

        let flag = true;
        for (let i in this.interest) {
            if (this.interest[i].checked == true) {
                flag = false;
                break;
            }
        }

        if (flag) {
            return true;
        }

        this.phone = false;

        for (let i in this.phones) {
            if (this.phones[i].checked == true && this.phone != false) {
                return true;
            } else if (this.phones[i].checked == true) {
                this.phone = this.phones[i].text;
            }
        }

        return this.phone ? false : true;
    };

    showConfirmRemove() {

        var self = this;

        const confirmPopup = this.$ionicPopup.confirm({
            title: 'Удаление',
            template: '<div>' + self.item.to_name + '</div><div>Вы действительно хотите удалить интерес к нему?</div>',
            cssClass: 'text-center',
            okText: 'Да',
            okType: 'button-positive button-clear',
            cancelText: 'Отмена',
            cancelType: 'button-dark button-clear'
        });

        confirmPopup.then((res) => {
            if (!res) return;

            this.$ionicLoading.show({
                template: 'Удаление'
            });

            Meteor.call('interest.remove', self.item._id, function (err) {
                self.$ionicLoading.hide();
                if (err) return self.handleError(err);
                self.$state.go('tab.groups');
            })


        });
    }

    sendInteretsOneSms() {
        var self = this;
        
        if(this.sendAgainFlag()) {
            return false;
        }

        const confirmPopup = this.$ionicPopup.confirm({
            title: 'Отправка интереса',
            template: '<div>Отправить интерес на номер?</div><div>' + this.phone + '</div>',
            cssClass: 'text-center',
            okText: 'Да',
            okType: 'button-positive button-clear',
            cancelText: 'Нет',
            cancelType: 'button-dark button-clear'
        });

        confirmPopup.then((res) => {
            if (!res) return;

            this.$ionicLoading.show({
                template: 'Отправка интереса...'
            });

            var name = [];

            for (var i in self.interest) {
                var tmp = self.interest[i];
                if (tmp.checked == true) {
                    name.push(tmp.text);
                }
            }

            if (name.length) {
                Meteor.call('interest.add', self.contactId, self.contactName, self.phone, name, function (err) {
                    self.$ionicLoading.hide();
                    if (err) return self.handleError(err);
                    self.$state.go('inter-ok');
                })
            }


        });

    }


}

FriendDetail.$inject = ['$state', '$stateParams', '$ionicPopup', '$ionicLoading'];