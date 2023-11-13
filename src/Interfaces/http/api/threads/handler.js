const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddedComment = require('../../../../Domains/comments/entitties/AddedComment');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(userId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postThreadCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id } = request.params;

    const useCasePayload = {
      created_at: new Date().toISOString(),
      ...request.payload,
    };

    const addedCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addedCommentUseCase.execute(userId, id, useCasePayload);

    const addedCommentResp = new AddedComment(addedComment).entityToResponse();

    const response = h.response({
      status: 'success',
      data: {
        addedComment: addedCommentResp,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
