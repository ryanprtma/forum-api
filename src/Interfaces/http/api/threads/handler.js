const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const GetThreadWithDetailUseCase = require('../../../../Applications/use_case/GetThreadWithDetailUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddedComment = require('../../../../Domains/comments/entitties/AddedComment');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.getThreadWithDetailHandler = this.getThreadWithDetailHandler.bind(this);
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
  }

  async getThreadWithDetailHandler(request, h) {
    const { id } = request.params;
    const getThreadWithDetailUseCase = this._container.getInstance(GetThreadWithDetailUseCase.name);
    const getThreadWithDetail = await getThreadWithDetailUseCase.execute(id);

    const response = h.response({
      status: 'success',
      data: {
        thread: getThreadWithDetail,
      },
    });
    return response;
  }

  async postThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials;

    const useCasePayload = {
      createdAt: new Date().toISOString(),
      ...request.payload,
    };

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(userId, useCasePayload);

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

  async deleteThreadCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id, commentId } = request.params;

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(commentId, userId, id);

    const response = h.response({
      status: 'success',
    });

    return response;
  }
}

module.exports = ThreadsHandler;
