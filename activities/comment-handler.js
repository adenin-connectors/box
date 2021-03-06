'use strict';
const api = require('./common/api');

module.exports = async (activity) => {
  try {
    //
    // THIS ACTIVITY IS NOT FINISHED: I deleted it's '.yaml' definition so it can't be used
    //

    // validate X-Gitlab-Token header
    if (!activity.Context.connector.custom1 || (activity.Context.connector.custom1 != activity.Request.Headers["x-apikey"])) {
      activity.Response.ErrorCode = 403;
      activity.Response.Data = {
        ErrorText: "invalid X-Gitlab-Token"
      }
      return;
    }

    var request = activity.Request.Data;
    var entity = {};
    var collections = [];

    switch (request.object_kind) {

      case "issue":

        let date = new Date(request.object_attributes.updated_at).toJSON();
        entity = {
          _type: "issue",
          id: "" + request.object_attributes.id,
          title: request.object_attributes.title,
          description: request.object_attributes.description,
          date: date,
          link: request.object_attributes.url
        };

        if (request.object_attributes.state == "opened") {
          api.initialize(activity);

          let promises = [];
          for (let i = 0; i < request.object_attributes.assignee_ids.length; i++) {
            promises.push(api(`/users/${request.object_attributes.assignee_ids[i]}`));
          }
          // also get owner's info
          promises.push(api(`/users/${request.object_attributes.author_id}`));

          const responses = await Promise.all(promises);
          for (let i = 0; i < responses.length; i++) {
            if ($.isErrorResponse(activity, responses[i])) return;
          }

          let userMails = [];
          for (let i = 0; i < responses.length-1; i++) {
            if (responses[i].body.public_email != ""){
             userMails.push(responses[i].body.public_email);
            }
          }

          collections.push({ name: "my", users: userMails, date: date });

          // push owner mail
          let ownerMail = responses[promises.length-1].body.public_email;
          if(ownerMail!="" && !userMails.includes(ownerMail)){
            userMails.push(ownerMail);
          }

          collections.push({ name: "open", users: userMails, date: date });
        }
        break;

      default:
        // ignore unknown object_kinds
        break;

    }
    activity.Response.Data = { entity: entity, collections: collections };
  } catch (error) {
    $.handleError(activity, error);
  }
};
