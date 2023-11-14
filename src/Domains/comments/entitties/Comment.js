class Comment {
  constructor(payload) {
    this._verifyPayload(payload);
    this.id = payload.id;
    this.username = payload.userName;
    this.content = payload.content;
    this.date = payload.created_at;
    this.is_deleted = payload.is_deleted;
  }

  _verifyPayload(payload) {
    const {
      id, userName, content, created_at, is_deleted,
    } = payload;

    if (!id || !userName || !content || !created_at || is_deleted === undefined) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' || typeof id !== 'string' || typeof content !== 'string' || typeof created_at !== 'string' || typeof is_deleted !== 'boolean') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  entityToCustomFormat() {
    if (this.is_deleted) {
      return {
        id: this.id,
        content: '**komentar telah dihapus**',
        username: this.username,
      };
    }

    return {
      id: this.id,
      content: this.content,
      username: this.username,
    };
  }
}

module.exports = Comment;
