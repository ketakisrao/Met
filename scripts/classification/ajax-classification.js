$(document).on('change', '#collection-selector', function () {
    let VALID = [1, 2, 3, 4, 5, 6];
    if (VALID.includes(parseInt($(this).val()))) {
        doAjaxClassification($(this).val());
    } else {
        throw new Error("Non valid collection name.");
    }
});

// Performs ajax request for culture-medium data
function doAjaxClassification(id) {

    let address = "https://met-server-nyc.herokuapp.com/classification?id=" + id;

    var data = $.ajax({
        url: address,
        type: 'GET',
        cache: false
    });

    $.when(data).then(function (dataResp) {
        let dataInput = dataResp.result;
        renderClassification(dataInput);

    }, function (jqXHR, textStatus, errorThrown) {
        var x1 = data;
        if (x1.readyState != 4) {
            x1.abort();
        }
        alert('GET REQUEST FAILED');
    });
}