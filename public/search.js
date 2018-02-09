var Req = (function () {
  var query = function (adress, method, data) {
    return new Promise(function (res, rej) {
      var xhr = new XMLHttpRequest();
      xhr.open("post", adress, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.addEventListener("load", function (data) {
        var json = JSON.parse(data.target.responseText);
        res(json);
      })
      xhr.send(JSON.stringify({
        key: method
      }));
    })
  };

  function Req(adress) {
    this.adress = adress;
  }

  // Req.prototype.get = function (url) {
  //   return query(url, "GET");
  // }

  // Req.prototype.post = function (url, data) {
  //   return query(url, "POST", data);
  // }

  Req.prototype.ask = function(string){
    return query(this.adress, string);
  }

  return Req;
}());