const api = require('./common/api');

module.exports = async function (activity) {
  try {
    var pagination = Activity.pagination();
    let pageSize = parseInt(pagination.pageSize);
    let offset = (parseInt(pagination.page) - 1) * pageSize;

    var dateRange = cfActivity.dateRange(activity, "today");

    let url = `/search?query=${activity.Request.Query.query}&offset=${offset}&limit=${pageSize}` +
      `&updated_at_range=${dateRange.startDate.split('.')[0]}-00:00,${dateRange.endDate.split('.')[0]}-00:00`;

    const response = await api(url);

    if (Activity.isErrorResponse(response)) return;

    activity.Response.Data = api.convertResponse(response.body.entries);
  } catch (error) {
    Activity.handleError(error);
  }
};