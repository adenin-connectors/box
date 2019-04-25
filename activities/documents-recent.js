'use strict';

const api = require('./common/api');

module.exports = async (activity) => {
  try {
    const pagination = $.pagination(activity);

    let offset = 0;

    if (pagination.nextpage) offset += pagination.nextpage;

    api.initialize(activity);

    const response = await api(`/events?limit=${pagination.pageSize}&stream_position=${offset}`);

    if ($.isErrorResponse(activity, response)) return;

    activity.Response.Data = convertRecentDocsResponse(response.body.entries);
    activity.Response.Data.title = T(activity, 'Recent Files');
    activity.Response.Data.link = 'https://app.box.com/recents';
    activity.Response.Data.linkLabel = T(activity, 'Go to Box Recent Files');

    if (response.body.next_stream_position) activity.Response.Data._nextpage = response.body.next_stream_position;
  } catch (error) {
    $.handleError(activity, error);
  }
};

//**maps response data*/
function convertRecentDocsResponse(entries) {
  const items = [];

  for (let i = 0; i < entries.length; i++) {
    const raw = entries[i];

    const item = {
      id: raw.event_id,
      title: raw.source.name,
      description: raw.event_type,
      date: new Date(raw.source.content_modified_at),
      link: `https://app.box.com/${raw.source.type}/${raw.source.id}`,
      raw: raw
    };

    items.push(item);
  }

  return {
    items: items
  };
}
