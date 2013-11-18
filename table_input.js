/// Copyright 2013, Andrew Leaver-Fay

function aacountcell_valid(cell_val) {
    if ( cell_val === "" ) return true;
    if ( cell_val === "!" ) return true;
    if ( cell_val === "*" ) return true;
    var cell_int = parseInt(cell_val, 10);
    var cell_notint = (cell_int !== cell_int);
    if ( cell_notint ) return false;
    var cell_float = parseFloat( cell_val );
    if ( cell_int != cell_float ) return false; // don't accept floating point input
    return true;
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

function load_library_from_table( library, scp_int ) {
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
                if ( i == 21 && scp_int !== 0 ) { jcontents = scp_int.toString(); }
            }
            icols.push( jcontents );
        }
        rows.push( icols.join(",")  );
    }
    var csv_string = rows.join( "\n" );

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

function output_tables_from_error_values( library, error_list, diversity_cap )  {
    var output_html = []
    for ( var i=0; i < error_list.length; ++i ) {
        var table_i = [];
        var error_trace = library.traceback_from_error_level( error_list[i] );
        var i_data = report_output_library_data( library, error_trace, diversity_cap );
        var i_summary = ["<table class=result_table><tr class=rtheader><td>Result #</td><td>Error</td>" +
                         "<td>Theoretical Diversity (DNA)</td><td>Amino-acid diversity</td></tr><tr><td>",
                         (i+1).toString(), "</td><td>",
                         error_list[i].toString(), "</td><td>",
                         i_data.dna_diversity.toExponential(3), "</td><td>",
                         i_data.aa_diversity.toExponential(3), "</td></tr></table><br>" ];
        var table = [];
        if ( i === 0 ) {
            table.push( "<table id=scrollhere class=result_table>" );
        } else {
            table.push( "<table class=result_table>" );
        }
        table.push( "<tr class=rtheader><td>Pos</td><td>Codon</td><td>Present</td><td>Absent</td><td>Error</td><td># Codons</td><td># AA</td></tr>" );
        for ( var j=0; j < library.n_positions; ++j ) {
            var j_pos = i_data.positions[j];
            if ( j % 2 === 0 ) {
                table.push( "<tr class=rteven>" );
            } else {
                table.push( "<tr class=rtodd>" );
            }
            table.push( [ "<td>", j_pos.orig_pos_string, "</td>" ].join("") );
            table.push( [ "<td>", j_pos.codon_string,"</td>" ].join("") );
            table.push( [ "<td>", j_pos.present_string,"</td>" ].join("") );
            table.push( [ "<td>", j_pos.absent_string,"</td>" ].join("") );
            table.push( [ "<td>", j_pos.error.toString(), "</td>" ].join("") );
            table.push( [ "<td>", Math.round(Math.exp( j_pos.log_dna_diversity )), "</td>" ].join("") );
            table.push( [ "<td>", j_pos.aa_count, "</td>" ].join("") );
            table.push( "</tr>" );
        }
        table.push( "</table>" );
        output_html.push( i_summary.join("") );
        output_html.push( table.join("\n") );
        output_html.push( "<br><br>" );
    }
    return output_html.join("\n");
}

function create_csv_from_table() {
    var table_contents = [];
    var trs = $('#aacounts').find('tr');
    for ( var i = 0; i < trs.length; ++i ) {
        var row_i = [];
        var tds = $(trs[i]).find('td');
        for ( var j = 1; j < tds.length; ++j ) {
            var jval = $($(tds[j]).find("input")[0]).val();
            console.log( "row " + i + " column " + j + " : " + jval );
            row_i.push( jval );
        }
        table_contents.push( row_i.join(",") );
    }
    return table_contents.join("\n");
}

function populate_table_from_csv() {
    var csv_contents = $('#csvaacounts').val().split("\n");
    var csv_data = []
    var nrows = csv_contents.length;
    if ( nrows != 22 ) {
        var msg = "<p>Could not update table from CSV contents.  Expected to find 22 rows, but found " + nrows + "</p>";
        $('#update_result').html(msg).css("color","red").show();
        return;
    }
    csv_data[0] = csv_contents[0].split(",");
    var ncols_row0 = csv_data[0].length;
    var badrows = [];
    for ( var i = 1; i < nrows; ++i ) {
        csv_data[i] = csv_contents[i].split(",");
        if ( csv_data[i].length != ncols_row0 ) {
            badrows.push( i+1 );
        }
    }
    if ( badrows.length != 0 ) {
        var msg;
        if ( badrows.length == 1 ) {
            msg = "<p>Could not update table from CSV contents.  Expected all rows to have " + ncols_row0 +
                   " columns, the same number as the first row, but found " + badrows.length + " that does not." +
                   " Row " + badrows.join(", ") + " has a different number of columns</p>";
        } else {
            msg = "<p>Could not update table from CSV contents.  Expected all rows to have " + ncols_row0 +
                   " columns, the same number as the first row, but found " + badrows.length + " that do not." +
                   " Rows " + badrows.join(", ") + " have a different number of columns</p>";
        }
        $('#update_result').html(msg).css("color","red").show();
        return;
    }

    // resize the table
    var trs = $('#aacounts').find('tr');
    var ncolumns_curr = $(trs[0]).find('td').length - 1;
    if ( ncolumns_curr < ncols_row0 ) {
        for ( var i=ncolumns_curr; i < ncols_row0; ++i ) {
            add_column_to_aacounts();
        }
    } else {
        for ( var i=ncolumns_curr; i > ncols_row0; --i ) {
            delete_column_from_aacounts();
        }
    }

    // now populate the table from the csv contents 
    for ( var i=0; i < trs.length; ++i ) {
        var tds = $(trs[i]).find("td");
        var row_i = csv_data[i];
        for ( var j=0; j < row_i.length; ++j ) {
            $($(tds[j+1]).find("input")[0]).val( row_i[j] );
        }
    }
    $('#update_result').html('<p>Successfully updated the table</p>').css("color","green").show();
}

function handle_tab_vs_csv_change( rad_button ) {
    //var rad_button = $("input[name='tab_vs_csv']")
    //alert( "made it!" + $(rad_button).val() );
    if ( $(rad_button).val() == 'csv' ) {
        var new_csv = create_csv_from_table();
        $('#csvaacounts').val( new_csv );
        $('#text_aacounts').show();
        $('#update_result').hide();
        $('#table_aacounts').hide();
    } else {
        $('#table_aacounts').show();
        $('#text_aacounts').hide();
    }
}


function validate_inputs_and_launch( launch_button ) {
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
    var scp_str = $("#stop_codon_penalty").val();
    var scp_int = -1 * Math.abs( parseInt( scp_str ) );
    if ( scp_str != "" && ( scp_int != scp_int ) ) {
        $("#stop_codon_penalty").css("background-color","pink");
        any_errors = true;
    } else {
        $("#stop_codon_penalty").css("background-color","white");
        if ( scp_int != scp_int ) {
            scp_int = 0;
        }
    }

    var ub_str = $('#libsize_upper').val();
    var ub_float = parseFloat( ub_str );
    if ( ub_float != ub_float || ub_float < 0 ) {
        $('#libsize_upper').css("background-color","pink");
        any_errors = true;
    } else {
        $('#libsize_upper').css("background-color","white");
    }

    var lb_str = $('#libsize_lower').val();
    var lb_float = parseFloat( lb_str );
    if ( lb_str != "" && ( lb_float != lb_float || lb_float < 0 || lb_float > ub_float )) {
        $('#libsize_lower').css("background-color","pink");
        any_errors = true;
    } else {
        $('#libsize_lower').css("background-color","white");
    }
        
    if ( any_errors ) {
        alert( "Errors in inputs" );
        return;
    }

    $(launch_button).html("Working");

    // do the actual computation after we've updated the DOM.
    setTimeout( function () {
        var starttime = new Date().getTime();
        var library = AALibrary();
        load_library_from_table( library, scp_int );
        library.compute_smallest_diversity_for_all_errors();
        if ( verify_solution_exists( library )) {
            library.optimize_library();
            if ( lb_float != lb_float ) {
                var error_list = [ library.find_minimal_error_beneath_diversity_cap( ub_float ) ];
            } else {
                var error_list = library.errors_in_diversity_range( ub_float, lb_float );
                console.log( "Error list: ", error_list.join(",") );
            }
            var stoptime = new Date().getTime();
            var output_html = "Running time: " + (( stoptime - starttime ) / 1000 )+ " seconds<br>" + output_tables_from_error_values( library, error_list, ub_float );
    
            $('#resultdiv').html( output_html );
    
        } else {
            $('#resultdiv').html( "<p id=scrollhere > No solution exists for the given set of required (*) and forbidden (!) amino acids </p>" );
        }
        $(launch_button).text("Go!");
        $('#scrollhere').scrollIntoView();
    }, 1 );
        
}

$(document).ready(function () {
        $('#add').click( add_column_to_aacounts );
        $('#delcol').click( delete_column_from_aacounts );
        $('.aacountcell').blur( function() {validate_aacount_cell(this);} );
        $('.seqposcell').blur( function() { validate_seqpos_cell(this);} );
        $('#launchbutton').click( function() { validate_inputs_and_launch(this); } );
        $("#tab_vs_csv_radio input:radio").click( function() { handle_tab_vs_csv_change(this); } );
        $("#table_from_csv").click( populate_table_from_csv );
})

// Local Variables:
// js-indent-level: 4
// indent-tabs-mode: nil
// End:
