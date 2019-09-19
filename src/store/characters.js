const privates = new WeakMap();

class Characters {
  constructor() {
    privates.set(this, {
      chars: []
    });
  }

  get getChars() {
    return privates.get(this).chars;
  }

  addChars(newData) {
    privates.get(this).chars = [...privates.get(this).chars, ...newData];
  }

  setDetail(id, detail) {
    privates.get(this).chars = privates.get(this).chars.map(item => {
      if (item.id === id) {
        item.detail = detail
      }
      return item
    })
  }
}

module.exports = Characters;