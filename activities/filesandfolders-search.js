'use strict';

const api = require('./common/api');

module.exports = async (activity) => {
  try {
    const pagination = $.pagination(activity);
    const pageSize = parseInt(pagination.pageSize, 10);
    const offset = (parseInt(pagination.page, 10) - 1) * pageSize;
    const dateRange = $.dateRange(activity);

    dateRange.startDate = new Date(0).toISOString();

    const url = `/search?query=${activity.Request.Query.query}&offset=${offset}&limit=${pageSize}` +
      `&updated_at_range=${dateRange.startDate.split('.')[0]}-00:00,${dateRange.endDate.split('.')[0]}-00:00`;

    api.initialize(activity);

    const response = await api(url);

    if ($.isErrorResponse(activity, response)) return;

    activity.Response.Data = api.convertResponse(response.body.entries);
  } catch (error) {
    $.handleError(activity, error);
  }
};
