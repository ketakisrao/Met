function doAjaxSpiralCall() {

  // !!! Note CORS enabled for localhost
  let address = "https://met-server-nyc.herokuapp.com/counts-by-date";

  var data = $.ajax({
    url: address,
    type: 'GET',
    cache: false
  });

  $.when(data).then(function (dataResp) {
      let dataInput = dataResp.result;
      renderSpiral(dataInput);
      
    }, function (jqXHR, textStatus, errorThrown) {
        var x1 = data;
        if (x1.readyState != 4) {
            x1.abort();
        }
        alert('GET REQUEST FAILED');
  });
}