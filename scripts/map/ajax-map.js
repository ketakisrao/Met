// Performs ajax request for country count data
function doAjaxMapCall() {
  let address = "https://met-server-nyc.herokuapp.com/country-counts";

  var data = $.ajax({
    url: address,
    type: 'GET',
    cache: false
  });

  $.when(data).then(function (dataResp) {
      let dataInput = dataResp.results;
      renderMap(dataInput);
      
    }, function (jqXHR, textStatus, errorThrown) {
        var x1 = data;
        if (x1.readyState != 4) {
            x1.abort();
        }
        alert('GET REQUEST FAILED');
  });
}