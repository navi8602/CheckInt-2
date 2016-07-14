import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class FriendDetail  extends Controller {
    constructor() {
        super(...arguments);
        var self = this;
        this.contactId = this.$stateParams.contactId;
        
        self.math = [];
        
        this.subscribe('interestSomeUserId', function() {

            self.item = Interest.findOne({to_id: self.contactId });

            if(self.item) {

                var phone = Meteor.user().phone.number;

                var someSend = Interest.findOne({to_phone: phone, from_phone: self.item.to_phone});

                if (someSend && someSend.name) {
                    for (var k in someSend.name) {
                        if (self.item.name.indexOf(someSend.name[k])) {
                            self.math.push(someSend.name[k]);
                            break;
                        }
                    }
                }
            }
        });

        this.$scope.data={visible : false};

        this.$scope.historyBack = function () {
            window.history.back();
        };

        
        this.interest = [
            { text: 'Сходить за пивом', checked: self.math.indexOf('Сходить за пивом') > -1 ? true : false },
            { text: 'Пойти в кино', checked: self.math.indexOf('Пойти в кино') > -1 ? true : false},
            { text: 'Ловить лягушек', checked: self.math.indexOf('Ловить лягушек') > -1 ? true : false},
            { text: 'Поехать в Тайланд', checked: self.math.indexOf('Поехать в Тайланд') > -1 ? true : false}
        ];
    }

    showConfirmRemove() {
        
        var self = this;
        
        const confirmPopup = this.$ionicPopup.confirm({
            title: 'Number confirmation',
            template: '<div>' + self.item.to_name + '</div><div>Вы действительно хотите удалить интерес к нему?</div>',
            cssClass: 'text-center',
            okText: 'Yes',
            okType: 'button-positive button-clear',
            cancelText: 'edit',
            cancelType: 'button-dark button-clear'
        });

        confirmPopup.then((res) => {
            if (!res) return;

            this.$ionicLoading.show({
                template: 'Удаление'
            });

            Meteor.call('interest.remove', self.item._id, function(err) {
                self.$ionicLoading.hide();
                if (err) return self.handleError(err);
                self.$state.go('tab.groups');
            })


        });
    }
}

FriendDetail.$inject = [ '$state','$stateParams', '$ionicLoading', '$timeout', '$ionicModal', '$ionicActionSheet', '$ionicScrollDelegate', 'NewChat', '$ionicPopup', '$log'];