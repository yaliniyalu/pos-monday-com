import {Notify, Dialog, Loading} from 'quasar'

class AudioManager {
  play(type) {
    let file_map = {
      input_error: 'system-fault',
      item_added: 'notification',
      item_deleted: 'notification',
      confirm: 'bleep',
      alert: 'alert',
      success: 'success',
      error: 'error'
    };

    let file = file_map[type];

    let audio = new Audio(require('./assets/audio/' + file + '.mp3'));
    return audio.play();
  }

  playBlocking() {
    return this.play('error');
  }

  playError() {
    return this.play('error');
  }

  playSuccess() {
    return this.play('success');
  }

  playAlert() {
    return this.play('alert');
  }
}

export default {
  audio: new AudioManager(),
  notify(message) {
    Notify.create(message)
  },

  notifyUnexpectedError() {
    Notify.create({
      color: 'red-4',
      icon: 'fas fa-exclamation-triangle',
      message: 'Sorry, Unexpected Error Occurred.'
    });
  },

  notifyError(message) {
    this.audio.playError();
    Notify.create({
      color: 'red-4',
      icon: 'fas fa-exclamation-triangle',
      message: message
    });
  },

  notifySuccess(message) {
    this.audio.playSuccess();
    Notify.create({
      color: 'green-4',
      icon: 'fas fa-check-circle',
      message: message
    });
  },

  confirm(message, title = '') {
    let obj = {
      message: message,
      ok: { label: 'yes', flat: true, unelevated: true},
      cancel: { label: 'no', flat: true, unelevated: true}
    };

    if (title) obj.title = title;

    return new Promise(((resolve, reject) => {
      this.audio.play('alert');
      Dialog.create(obj)
        .onOk(() => resolve())
        .onCancel(() => reject())
        .onDismiss(() => reject())
    }));
  },

  askYesNo(message, title = '', onOk = null) {
    let obj = {
      title: title,
      message: message,
      ok: { label: 'yes', flat: true, unelevated: true },
      cancel: { label: 'no', flat: true, unelevated: true }
    };

    return new Promise(((resolve, reject) => {
      this.audio.play('alert');
      Dialog.create(obj)
        .onOk(() => resolve())
        .onCancel(() => reject())
        .onDismiss(() => reject())
    }));
  },

  showLoader(message) {
    Loading.show({
      message: message
    })
  },

  hideLoader() {
    Loading.hide();
  }
}

