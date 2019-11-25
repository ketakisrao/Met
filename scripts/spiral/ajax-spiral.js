$(document).on('change','#dynasty-selector',function(){
  let VALID = ["edo", "classical", "qing"];
  if (VALID.includes($(this).val())){
    doAjaxSpiralCall($(this).val());
  } else {
    throw new Error ("Non valid dynasty name.");
  }
});

function doAjaxSpiralCall(dynasty) {

  // !!! Note CORS enabled for localhost
  let address = "https://met-server-nyc.herokuapp.com/counts-by-date?dynasty=" + dynasty;

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