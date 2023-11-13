class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.owner = payload.userId;
    this.title = payload.title;
    this.body = payload.body;
  }

  _verifyPayload(payload) {
    const {
      id, userId, title, body,
    } = payload;

    if (!id || !userId || !title || !body) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof userId !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Thread;
