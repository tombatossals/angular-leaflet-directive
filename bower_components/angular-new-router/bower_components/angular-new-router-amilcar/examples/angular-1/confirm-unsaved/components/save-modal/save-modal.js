angular.module('myApp.saveModal', ['btford.modal'])
    .factory('saveModal', ['btfModal', '$q', saveModalFactory]);

function saveModalFactory (btfModal, $q) {
  var modal = btfModal({
    templateUrl: './components/save-modal/save-modal.html',
    controller: ['resolve', 'reject', ModalController],
    controllerAs: 'modal'
  });

  function ModalController(resolve, reject) {
    this.confirm = function () {
      resolve(true);
      modal.deactivate();
    };
    this.cancel = function () {
      reject();
      modal.deactivate();
    };
  }

  return {
    getResponse: function () {
      return $q(function (resolve, reject) {
        modal.activate({
          resolve: resolve,
          reject: reject
        });
      });
    }
  };
}
