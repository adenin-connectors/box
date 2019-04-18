'use strict';

const api = require('./common/api');

module.exports = async () => {
  try {
    const pagination = Activity.pagination();
    const pageSize = parseInt(pagination.pageSize, 10);
    const offset = (parseInt(pagination.page, 10) - 1) * pageSize;

    const response = await api(`/folders/0?limit=${pageSize}&offset=${offset}`);

    if (Activity.isErrorResponse(response)) return;

    const entries = response.body.item_collection.entries;
    const promises = [];

    for (let i = 0; i < entries.length; i++) {
      if (entries[i].type === 'folder') {
        promises.push(api(`/folders/${entries[i].id}`));
        continue;
      }

      promises.push(api(`/files/${entries[i].id}`));
    }

    const results = (await Promise.all(promises)).map((result) => result.body);

    Activity.Response.Data = api.convertResponse(results);
  } catch (error) {
    Activity.handleError(error);
  }
};
