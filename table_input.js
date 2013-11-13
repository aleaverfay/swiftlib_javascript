function aacountcell_valid(cell_val) {
    var cell_empty = cell_val === "";
    var cell_int = parseInt(cell_val, 10);
    var cell_notint = (cell_int !== cell_int);
    var cell_bang = cell_val === "!";
    var cell_star = cell_val === "*";
    var cell_ok = cell_empty || !cell_notint || cell_bang || cell_star;
    return cell_ok;
}

function add_column_to_aacounts() {
    var rows = $('#aacounts').find('tr');
    $(rows[0]).append('<td><input type="text" name="test" class=seqposcell size=4></td>');
    for (var i = 1; i < rows.length; ++i) {
        $(rows[i]).append('<td><input type="text" name="test" class=aacountcell size=4 ></td>');
    }
}

function delete_column_from_aacounts() {
    $('#aacounts').find('tr').each(function () {
            //alert("this.length:" + this.childNodes.length );
            //$(this).removeChild( this.lastChild );
            if ($(this).find('td').length > 1) {
                $(this).find('td:last').remove();
            }
        })
}

function validate_aacount_cell( cell ) {
    if (!aacountcell_valid($(cell).val())) {
        $(cell).css("background-color", "yellow");
        return false;
    } else {
        $(cell).css("background-color", "white");
        return true;
    }
}

function validate_seqpos_cell( cell ) {
    if ($(cell).val() === "") {
        $(cell).css("background-color", "pink");
        return false;
    } else {
        $(cell).css("background-color", "white");
        return true;
    }
}

function validate_inputs_and_launch() {
    var trs = $('#aacounts').find('tr');
    var any_errors = false;
    for (var i = 0; i < trs.length; ++i) {
        var tds = $(trs[i]).find('td');
        if (i === 0) {
            for (var j = 1; j < tds.length; ++j) {
                if (!validate_seqpos_cell( $(tds[j]).find('input')[0])) any_errors = true;
            }
        } else {
            for (var j = 1; j < tds.length; ++j) {
                if (!validate_aacount_cell( $(tds[j]).find('input')[0])) any_errors = true;
            }
        }
    }
    if ( any_errors ) alert( "errors in input table" );
}

$(document).ready(function () {
        $('#add').click( add_column_to_aacounts );
        $('#delcol').click( delete_column_from_aacounts );
        $('.aacountcell').blur( function() {validate_aacount_cell(this)} );
        $('.seqposcell').blur( function() { validate_seqpos_cell(this)} );
        $('#launchbutton').click( validate_inputs_and_launch );
    })

// Local Variables:
// js-indent-level: 4
// indent-tabs-mode: nil
// End:
