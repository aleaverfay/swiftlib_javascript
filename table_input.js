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
        $(cell).css("background-color", "pink");
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

function tims_problem() {
    // tim's problem
    var csv_string ="aa/pos ,268,269,270,271,272,276,330,331,332\n" +
        "A,3,8,1,81,4,105,10,2,1\n" +
        "C,0,0,0,0,0,0,0,0,0\n" +
        "D,8,5,0,0,0,0,29,7,9\n" +
        "E,23,7,0,0,0,0,21,23,17\n" +
        "F,0,0,0,0,0,0,0,0,0\n" +
        "G,0,0,0,1,0,59,4,1,5\n" +
        "H,1,0,0,0,0,0,0,1,9\n" +
        "I,10,2,98,0,0,0,0,0,1\n" +
        "K,22,0,0,0,0,0,5,4,9\n" +
        "L,17,8,5,0,0,0,0,14,0\n" +
        "M,13,9,5,0,2,0,3,7,4\n" +
        "N,6,4,0,0,0,0,8,19,15\n" +
        "P,0,0,0,0,0,0,0,0,0\n" +
        "Q,42,2,0,0,1,0,6,29,18\n" +
        "R,35,4,0,0,0,0,27,12,21\n" +
        "S,7,44,8,113,43,36,45,34,29\n" +
        "T,6,58,23,4,30,0,42,46,57\n" +
        "V,7,49,60,1,120,0,0,0,5\n" +
        "W,0,0,0,0,0,0,0,1,0\n" +
        "Y,0,0,0,0,0,0,0,0,0\n" +
        "STOP,0,0,0,0,0,0,0,0,0";
    return csv_string;
}

function load_library_from_table( library ) {
    // turn the user-provided input into a CSV string
    var rows = [];
    var trs = $('#aacounts').find('tr');
    for ( var i=0; i < trs.length; ++i ) {
        var tds = $(trs[i]).find('td');
        var icols = []
        for ( var j=0; j < tds.length; ++j ) {
            var jcontents;
            if ( j == 0 ) { jcontents = $(tds[j]).val(); }
            else {
                jcontents = strip_whitespace( $($(tds[j]).find("input")[0]).val() );
                if ( i !== 0 && jcontents === "" ) { jcontents = "0"; }
            }
            icols.push( jcontents );
        }
        rows.push( icols.join(",")  );
    }
    var csv_string = rows.join( "\n" );
    csv_string = tims_problem();

    console.log( csv_string );
    library.load_library( csv_string );
}

function verify_solution_exists( library ) {
    var nosolution_pos = library.find_positions_wo_viable_solutions();
    if ( nosolution_pos.length === 0 ) return true;
    var trs = $('#aacounts').find( 'tr' );
    for ( var i=0; i < nosolution_pos.length; ++i ) {
        for ( var j=0; j < trs.length; ++j ) {
            var jtd = $(trs[j]).find('td')[ nosolution_pos[i] + 1 ];
            $(jtd).css("background-color", "pink");
        }
    }
    return false;
}

function validate_inputs_and_launch() {
    var trs = $('#aacounts').find('tr');
    var any_errors = false;
    for (var i = 0; i < trs.length; ++i) {
        var tds = $(trs[i]).find('td');
        if (i === 0) {
            for (var j = 1; j < tds.length; ++j) {
                if ( !validate_seqpos_cell( $(tds[j]).find('input')[0])) any_errors = true;
            }
        } else {
            for (var j = 1; j < tds.length; ++j) {
                if ( !validate_aacount_cell( $(tds[j]).find('input')[0])) any_errors = true;
            }
        }
    }
    
    // also validate the stop-codon penalty, and the upper and lower bounds cells.

    if ( any_errors ) {
        alert( "errors in input table" );
        return;
    }


    var library = AALibrary();
    load_library_from_table( library );
    library.compute_smallest_diversity_for_all_errors();
    if ( verify_solution_exists( library )) {
        var diversity_cap = 3.2e8; // tmp
        var best = library.optimize_library( diversity_cap );
        var output_string = print_output_codons( library, best, diversity_cap );
        $('#resultdiv').html( "<p>" + output_string.replace( /\n/g, "<br>" ) + "</p>" );
    } else {
        $('#resultdiv').html( "<p> No solution exists for the given set of required (*) and forbidden (!) amino acids </p>" );
    }
    $('#resultdiv').scrollintoview();
        
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
