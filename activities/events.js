'use strict';
const api = require('./common/api');

module.exports = async function (activity) {
  try {
    var pagination = Activity.pagination();
    let offset = 0;
    if (pagination.nextpage) {
      offset += pagination.nextpage;
    }

    const response = await api(`/events?limit=${pagination.pageSize}&stream_position=${offset}`);
    if (Activity.isErrorResponse(response)) return;

    activity.Response.Data = convertEventsResponse(response.body.entries);

    if (response.body.next_stream_position) {
      activity.Response.Data._nextpage = response.body.next_stream_position;
    }
  } catch (error) {
    Activity.handleError(error);
  }
};
//**maps response data*/
function convertEventsResponse(entries) {
  let items = [];

  for (let i = 0; i < entries.length; i++) {
    let raw = entries[i];
    let item = {
      id: raw.event_id,
      title: raw.source.name,
      description: raw.event_type,
      link: `https://app.box.com/${raw.source.type}/${raw.source.id}`,
      raw: raw
    };
    items.push(item);
  }

  return { items: items };
};