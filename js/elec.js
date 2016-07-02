var objs;

$(document).ready(function() {
    $("#data-graphic-link").click(onDataGraphicLinkClicked);
    $("#data-list-link").click(dataListLinkClick);
    $("#delete-bill-bn").click(deleteBillBnClicked);

    $.getJSON("elec.php", function(data) {
        objs = data;
        $("#data-graphic-link").click();
    });
});

function onDataGraphicLinkClicked() {
    var firstRow = true;
    var rowData = generateEmptyDataGraphicRowData();
    var currentYear = 1900;
    var dateparts;
    $("#data-graphic-body").empty();
    objs.forEach(function(i) {
        dateparts = i.bill_date.split("-");
        if (currentYear != dateparts[0]) {
            if (!firstRow) {
                $("#data-graphic-body").append(generateDataGraphicRow(rowData));
                rowData = generateEmptyDataGraphicRowData();
            }
            else {
                firstRow = false;
            }
            currentYear = dateparts[0];
            rowData[0] = currentYear;
        }
        rowData[parseInt(dateparts[1])] = i.price;
    });
    $("#data-graphic-body").append(generateDataGraphicRow(rowData));
}

function generateEmptyDataGraphicRowData() {
    return ["", "", "", "", "", "", "", "", "", "", "", "", ""];
}

function generateDataGraphicRow(data) {
    var row = "<tr>";
    data.forEach(function(i) {
        row += "<td class='number-column'>" + i + "</td>";
    });
    row += "</tr>";
    return row;
}

function dataListLinkClick() {
    var row;
    $("#data-list-body").empty();
    objs.forEach(function(i) {
        row = "<tr>";
        row += "<td class='number-column'>" + i.bill_date + "</td>";
        row += "<td class='number-column'>" + i.peak_time_power + "</td>";
        row += "<td class='number-column'>" + i.valley_time_power + "</td>";
        row += "<td class='number-column'>" + i.peak_time_price + "</td>";
        row += "<td class='number-column'>" + i.valley_time_price + "</td>";
        row += "<td class='number-column'>" + i.price + "</td>";
        row += "<td><a href='#delete-bill-modal' data-toggle='modal' data-id='" + i.id + "' data-date='" + i.bill_date + "'><span class='glyphicon glyphicon-remove' aria-hidden='true' title='删除账单'></span></a></td>";
        row += "</tr>";
        $("#data-list-body").append(row);
    });

    $("#data-list-body tr td a").click(deleteBill);
}

function deleteBill() {
    $("#delete-bill-id").val($(this).attr("data-id"));
    $("#delete-bill-date-text").text($(this).attr("data-date"));
}

function deleteBillBnClicked() {
    var id = $("#delete-bill-id").val();
    $.ajax({
        url: "elec.php?id=" + id,
        type: "DELETE",
        success: function(result) {
            location.reload();
        }
    });
//    alert("anchor " + id + " is clicked");
}
