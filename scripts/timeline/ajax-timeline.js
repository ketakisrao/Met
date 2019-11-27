$(document).on('click','#degas-timeline-button',function(){
    renderBarTimeline("degas");
});

$(document).on('click','#klimt-timeline-button',function(){
  renderBarTimeline("klimt");
});

$(document).on('click','#hokusai-timeline-button',function(){
  renderBarTimeline("hokusai");
});

$(document).on('click','#rodin-timeline-button',function(){
  renderBarTimeline("rodin");
});

$(document).on('click','#pencz-timeline-button',function(){
  renderBarTimeline("pencz");
});

function renderBarTimeline(id) {

  // !!! Note CORS enabled for localhost
  let address = "https://met-server-nyc.herokuapp.com/timeline?artist=" + id;

  var data = $.ajax({
    url: address,
    type: 'GET',
    cache: false
  });

  $.when(data).then(function (dataResp) {
      let dataInput = dataResp.results;
      generateBarTimeline(dataInput);
      
    }, function (jqXHR, textStatus, errorThrown) {
        var x1 = data;
        if (x1.readyState != 4) {
            x1.abort();
        }
        alert('GET REQUESTS FAILED');
  });

}