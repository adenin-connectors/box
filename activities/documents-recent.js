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

    activity.Response.Data = convertRecentDocsResponse(response.body.entries);    
    Activity.Response.Data.title = T('Recent Files');
    Activity.Response.Data.link = 'https://app.box.com/recents';
    Activity.Response.Data.linkLabel = T('Go to Box Recent Files');

    if (response.body.next_stream_position) {
      activity.Response.Data._nextpage = response.body.next_stream_position;
    }
  } catch (error) {
    Activity.handleError(error);
  }
};
//**maps response data*/
function convertRecentDocsResponse(entries) {
  let items = [];

  for (let i = 0; i < entries.length; i++) {
    let raw = entries[i];
    let item = {
      id: raw.event_id,
      title: raw.source.name,
      description: raw.event_type,
      date: new Date(raw.source.content_modified_at),
      link: `https://app.box.com/${raw.source.type}/${raw.source.id}`,
      raw: raw
    };
    items.push(item);
  }

  return { items: items };
}