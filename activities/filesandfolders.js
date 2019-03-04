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

    activity.Response.Data = convertResponse(response);
  } catch (error) {
    cfActivity.handleError(activity, error);
  }
};

//**maps response data*/
function convertResponse(response) {
  let items = [];
  let data = response.body.item_collection.entries;

  for (let i = 0; i < data.length; i++) {
    let raw = data[i];
    let item = { id: raw.id, title: raw.name, description: raw.type, link: `https://app.box.com/${raw.type}/${raw.id}`, raw: raw }
    items.push(item);
  }

  return { items: items };
}