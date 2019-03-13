const api = require('./common/api');
const logger = require('@adenin/cf-logger');
const cfActivity = require('@adenin/cf-activity');

module.exports = async function (activity) {

  try {
    api.initialize(activity);

    var pagination = cfActivity.pagination(activity);

    let pageSize = parseInt(pagination.pageSize);
    let offset = (parseInt(pagination.page) - 1) * pageSize;

    let url = `/search?query=${activity.Request.Query.query}&offset=${offset}&limit=${pageSize}`;

    const response = await api(url);

    if (!cfActivity.isResponseOk(activity, response)) {
      return;
    }

    activity.Response.Data = api.convertResponse(response.body.entries);
  } catch (error) {
    cfActivity.handleError(activity, error);
  }
};