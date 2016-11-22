import _ from 'lodash';

export default {
  configGCMPushNotification(params = {}) {
    this.NewLibConnection
      .GCMConfig
      .please()
      .update({}, params)
      .then(this.completed)
      .catch(this.failure);
  },

  configAPNSPushNotification(params = {}) {
    const removeCertificates = [];
    let APNSConfigParams = {};

    _.forEach(params.certificateTypes, (type) => {
      const ifCertificateHasName = params[`${type}_certificate_name`];


      if (_.isEmpty(ifCertificateHasName)) {
        const removeParams = _.pickBy(params, (param, paramKey) => _.startsWith(paramKey, type));

        removeParams[`${type}_certificate`] = true;
        removeCertificates.push(
          this.NewLibConnection
            .APNSConfig
            .please()
            .removeCertificate({}, removeParams)
        );
      }

      if (!_.isEmpty(ifCertificateHasName)) {
        const typeParams = _.pickBy(params, (param, paramKey) => (
          _.startsWith(paramKey, type) && _.isObject(params[`${type}_certificate`]))
        );

        APNSConfigParams = { ...APNSConfigParams, ...typeParams };
      }
    });

    this.Promise.all(removeCertificates).then(
      this.NewLibConnection
        .APNSConfig
        .please()
        .update({}, APNSConfigParams)
        .then(this.completed)
        .catch(this.failure)
    );
  },

  getGCMPushNotificationConfig() {
    this.NewLibConnection
      .GCMConfig
      .please()
      .get()
      .then(this.completed)
      .catch(this.failure);
  },

  getAPNSPushNotificationConfig() {
    this.NewLibConnection
      .APNSConfig
      .please()
      .get()
      .then(this.completed)
      .catch(this.failure);
  },

  listGCMMessages() {
    const push = {};

    this.NewLibConnection
      .GCMConfig
      .please()
      .get()
      .then((config) => {
        push.config = config;

        return this.NewLibConnection.GCMDevice.please().list();
      })
      .then((devices) => {
        push.devices = devices;

        return this.NewLibConnection.GCMMessage.please().list().ordering('desc');
      })
      .then((messages) => {
        push.messages = messages;

        this.completed(push);
      })
      .catch(this.failure);
  },

  listAPNSMessages() {
    const push = {};

    this.NewLibConnection
      .APNSConfig
      .please()
      .get()
      .then((config) => {
        push.config = config;

        return this.NewLibConnection.APNSDevice.please().list();
      })
      .then((devices) => {
        push.devices = devices;

        return this.NewLibConnection.APNSMessage.please().list().ordering('desc');
      })
      .then((messages) => {
        push.messages = messages;

        this.completed(push);
      })
      .catch(this.failure);
  }
};
