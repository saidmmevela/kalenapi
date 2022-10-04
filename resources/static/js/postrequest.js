$(document).ready( () => {
    $("#btnSubmit").click((event) => {
        //stop submit the form, we will post it manually.
        event.preventDefault();
        doAjax();
    });
 
});
 
function doAjax() {
 
    // Get form
    var form = $('#fileUploadForm')[0];
    var data = new FormData(form);
    console.log("dataon: ");
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/api/files/upload",
        data: data,
        processData: false, //prevent jQuery from automatically transforming the data into a query string
        contentType: false,
        cache: false,
        success: (data) => {
            console.log("datain: ",data);
            //$("#listFiles").text(data);
        },
        error: (e) => {
            console.log("error: ",e.responseText);
            //$("#listFiles").text(e.responseText);
        }
    });
}