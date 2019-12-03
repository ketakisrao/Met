// Listeners for individual buttons
$(document).on('click', '#degas-timeline-button', function () {
    renderBarTimeline("degas");
    $('.bar-artist-icon').removeClass("active");
    $(this).addClass("active");
});

$(document).on('click', '#klimt-timeline-button', function () {
    renderBarTimeline("klimt");
    $('.bar-artist-icon').removeClass("active");
    $(this).addClass("active");
});

$(document).on('click', '#hokusai-timeline-button', function () {
    renderBarTimeline("hokusai");
    $('.bar-artist-icon').removeClass("active");
    $(this).addClass("active");
});

$(document).on('click', '#rodin-timeline-button', function () {
    renderBarTimeline("rodin");
    $('.bar-artist-icon').removeClass("active");
    $(this).addClass("active");
});

$(document).on('click', '#pencz-timeline-button', function () {
    renderBarTimeline("pencz");
    $('.bar-artist-icon').removeClass("active");
    $(this).addClass("active");
});

// Performs ajax request for artist data
function renderBarTimeline(id) {

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