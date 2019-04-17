'use strict';

const api = require('./common/api');

module.exports = async () => {
  try {
    const pagination = Activity.pagination();
    const pageSize = parseInt(pagination.pageSize, 10);
    const offset = (parseInt(pagination.page, 10) - 1) * pageSize;

    const dateRange = Activity.dateRange('today');

    const url = `/search?query=${Activity.Request.Query.query}&offset=${offset}&limit=${pageSize}` +
      `&updated_at_range=${dateRange.startDate.split('.')[0]}-00:00,${dateRange.endDate.split('.')[0]}-00:00`;

    const response = await api(url);

    if (Activity.isErrorResponse(response)) return;

    Activity.Response.Data = api.convertResponse(response.body.entries);
  } catch (error) {
    Activity.handleError(error);
  }
};
