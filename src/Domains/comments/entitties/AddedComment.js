class AddedComment {
  constructor(payload) {
    this._verifyPayload(payload);
    this.id = payload.id;
    this.owner = payload.owner;
    this.thread_id = payload.thread_id;
    this.content = payload.content;
    this.created_at = payload.created_at;
    this.is_deleted = payload.is_deleted;
  }

  _verifyPayload(payload) {
    const {
      id, owner, thread_id, content, created_at, is_deleted,
    } = payload;

    if (!id || !owner || !thread_id || !content || !created_at || is_deleted === undefined) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' || typeof id !== 'string' || typeof thread_id !== 'string' || typeof content !== 'string' || typeof created_at !== 'string' || typeof is_deleted !== 'boolean') {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  entityToCustomFormat() {
    return {
      id: this.id,
      content: this.content,
      owner: this.owner,
    };
  }
}

module.exports = AddedComment;
