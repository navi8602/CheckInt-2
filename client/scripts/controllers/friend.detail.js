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
            {text: 'Свидание', checked: self.math.indexOf('Свидание') > -1 ? true : false},
            {text: 'Флирт', checked: self.math.indexOf('Флирт') > -1 ? true : false},
            {text: 'Любовь', checked: self.math.indexOf('Любовь') > -1 ? true : false},
            {text: 'Романтика', checked: self.math.indexOf('Романтика') > -1 ? true : false},
            {text: 'Близость', checked: self.math.indexOf('Близость') > -1 ? true : false}
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
                    {text: 'Свидание', checked: self.math.indexOf('Свидание') > -1 ? true : false},
                    {text: 'Флирт', checked: self.math.indexOf('Флирт') > -1 ? true : false},
                    {text: 'Любовь', checked: self.math.indexOf('Любовь') > -1 ? true : false},
                    {text: 'Романтика', checked: self.math.indexOf('Романтика') > -1 ? true : false},
                    {text: 'Близость', checked: self.math.indexOf('Близость') > -1 ? true : false}
                ];

                this.mathFlag = this.math.length > 0 ? true : false;

                if (!this.mathFlag) {

                    this.interest = [
                        {text: 'Дружба', checked: self.item.name.indexOf('Дружба') > -1 ? true : false},
                        {text: 'Свидание', checked: self.item.name.indexOf('Свидание') > -1 ? true : false},
                        {text: 'Флирт', checked: self.item.name.indexOf('Флирт') > -1 ? true : false},
                        {text: 'Любовь', checked: self.item.name.indexOf('Любовь') > -1 ? true : false},
                        {text: 'Романтика', checked: self.item.name.indexOf('Романтика') > -1 ? true : false},
                        {text: 'Близость', checked: self.item.name.indexOf('Близость') > -1 ? true : false}
                    ];

                }
            }
        });

        this.$scope.data = {visible: false};

        this.$scope.historyBack = function () {
            window.history.back();
        };


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