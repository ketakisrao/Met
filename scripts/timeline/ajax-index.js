const artists = ["hokusai", "degas", "klimt", "rodin", "pencz"];
const colors = {"hokusai": "blue", "degas": "blue", "klimt": "blue", "rodin": "blue", "pencz": "blue"};

function renderTimelines() {
  
  for (let name of artists) {
    doAjaxCall(name, "#00cccc");
  }
  
}

function doAjaxCall(artistName, color) {

  // !!! Note CORS enabled for localhost
  let address = "http://127.0.0.1:5000/timeline?artist=" + artistName;
  let datesAddress = "http://127.0.0.1:5000/timeline-dates?artist=" + artistName;

  var data = $.ajax({
    url: address,
    type: 'GET',
    cache: false
  });

  var datesData = $.ajax({
    url: datesAddress,
    type: 'GET',
    cache: false
  });

  $.when(data, datesData).then(function (dataResp, datesResp) {
      let dataInput = dataResp[0].results;
      let datesInput = datesResp[0]["Date Count"];
      generateTimeline(artistName, dataInput, datesInput, color, false);
      
    }, function (jqXHR, textStatus, errorThrown) {
        var x1 = data;
        var x2 = datesData;
        if (x1.readyState != 4) {
            x1.abort();
        }
        if (x2.readyState != 4) {
            x2.abort();
        }
        alert('GET REQUESTS FAILED');
  });
}