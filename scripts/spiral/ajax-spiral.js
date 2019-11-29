$(document).on('change','#dynasty-selector',function(){
  doAjaxSpiralCall($(this).val());
});

function doAjaxSpiralCall(dynasty) {

  // !!! Note CORS enabled for localhost
  let address = "https://met-server-nyc.herokuapp.com/counts-by-date?dynasty=" + dynasty;
  //let address = "http://127.0.0.1:5000/counts-by-date?dynasty=" + dynasty;

  var data = $.ajax({
    url: address,
    type: 'GET',
    cache: false
  });

  $.when(data).then(function (dataResp) {
      let dataInput = dataResp.result;
      renderSpiral(dynasty, dataInput);
      
    }, function (jqXHR, textStatus, errorThrown) {
        var x1 = data;
        if (x1.readyState != 4) {
            x1.abort();
        }
        alert('GET REQUEST FAILED');
  });
}