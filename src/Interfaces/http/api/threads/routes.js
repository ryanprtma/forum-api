const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{id}/comments',
    handler: handler.postThreadCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
