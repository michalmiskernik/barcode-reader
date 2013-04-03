module.exports = Logger;

function Logger(list) {
  this.list = list;
  this.codes = [];
}

Logger.prototype = {

  log: function(code) {
    if (this.codes.indexOf(code) > -1) {
      return;
    }

    var item = this.createItem(code);

    this.codes.push(code);
    this.list.appendChild(item);
  },

  createItem: function(code) {
    var item = document.createElement('li');
    item.innerText = code;

    return item;
  }

};
