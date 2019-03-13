'use strict';

const cfActivity = require('@adenin/cf-activity');
const api = require('./common/api');


module.exports = async function (activity) {

  try {
    api.initialize(activity);
    const response = await api('/folders/0');

    if (!cfActivity.isResponseOk(activity, response)) {
      return;
    }

    activity.Response.Data = api.convertResponse(response.body.item_collection.entries);
  } catch (error) {
    cfActivity.handleError(activity, error);
  }
};