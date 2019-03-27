'use strict';
const api = require('./common/api');

module.exports = async function (activity) {
  try {
    var pagination = Activity.pagination();
    let pageSize = parseInt(pagination.pageSize);
    let offset = (parseInt(pagination.page) - 1) * pageSize;

    const response = await api(`/folders/0?limit=${pageSize}&offset=${offset}`);

    if (Activity.isErrorResponse(response)) return;

    activity.Response.Data = api.convertResponse(response.body.item_collection.entries);
  } catch (error) {
    Activity.handleError(error);
  }
};