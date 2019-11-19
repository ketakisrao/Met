const artists = ["hokusai", "degas", "klimt", "rodin", "pencz"];
const colors = {"hokusai": "#586BA4", "degas": "#324376", "klimt": "#F5DD90", "rodin": "#F68E5F", "pencz": "#F76C5E"};

function renderTimelines() {
  
  for (let name of artists) {
    doAjaxArtistCall(name, colors[name], false);
  }
  
}

function doAjaxArtistCall(artistName, color, renderTooltip) {

  // !!! Note CORS enabled for localhost
  let address = "https://met-server-nyc.herokuapp.com/timeline?artist=" + artistName;
  let datesAddress = "https://met-server-nyc.herokuapp.com/timeline-dates?artist=" + artistName;

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
      generateTimeline(artistName, dataInput, datesInput, color, renderTooltip);
      
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