/// Copyright 2013, Andrew Leaver-Fay

function val_is_integer( val_string ) {
    var val_as_int = parseInt( val_string );
    return val_as_int === val_as_int;
}

function val_is_number( val_string ) {
    var val_as_float = parseFloat( val_string );
    return val_as_float === val_as_float;
}

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

function primer_boundary_valid( cell_val ) {
    return cell_val === "-" || cell_val === "|";
}

function max_dcs_per_pos_valid( cell_val ) {
    return cell_val === "1" || cell_val === "2";
}

function stop_codon_penalty_valid( cell_val ) { return cell_val === "" || val_is_integer( cell_val ); }

function libsize_upper_valid( cell_val ) { return val_is_number( cell_val ); }

function libsize_lower_valid( libsize_upper, cell_val ) {
    if ( cell_val === "" ) return true;
    if ( ! val_is_number( cell_val ) ) return false;
    var libsize_lower = parseFloat( cell_val );
    if ( libsize_lower < 0 ) return false;
    return libsize_lower < libsize_upper;
}

function max_extra_primers_valid( cell_val ) {
    if ( cell_val === "" ) return !($('#primerboundary_row').is(':visible'));
    return val_is_integer( cell_val );
}

function enable_or_disable_mdcs( allow_mdcs ) {
    //alert( $(allow_mdcs).text() );
    $(('#primerboundary_row')).toggle();
    $(('#maxdcs_row')).toggle();
    $(('#max_extra_dcs_input')).toggle();
    
    if ( $(allow_mdcs).text() === "Allow Mult. Deg. Codons" ) {
        $(allow_mdcs).button( "option", "label", "Disable Mult. Deg. Codons" );
    } else {
        $(allow_mdcs).button( "option", "label", "Allow Mult. Deg. Codons" );
    }
}

function add_column_to_aacounts() {
    var header_row = $('#aacounts').find('thead tr');
    $(header_row).append('<th class="accept">Drag</th>');

    var rows = $('#aacounts').find('tbody tr');
    $(rows[0]).append('<td><input type="text" name="test" class=seqposcell size=4></td>');
    $(rows[1]).append('<td><input type="text" name="primer" class=primercell size=4 value="-"></td>');
    $(rows[2]).append('<td><input type="text" name="maxdc" class=maxdccell size=4 value="1"></td>');
    for (var i = 3; i < rows.length; ++i) {
        $(rows[i]).append('<td><input type="text" name="test" class=aacountcell size=4 ></td>');
    }

    $( '#aacounts' ).dragtable('destroy').dragtable({
        dragaccept:'.accept'
    });
}

function delete_column_from_aacounts() {
    var aacounts_table = $('#aacounts');
    aacounts_table.find('tr').each(function () {
            //alert("this.length:" + this.childNodes.length );
            //$(this).removeChild( this.lastChild );
            if ($(this).find('td').length > 1) {
                $(this).find('td:last').remove();
            }
        });
    aacounts_table.find('thead').each(function() {
            $(this).find('tr').each( function() {
                    if ( $(this).find('th').length > 1 ) {
                        $(this).find('th:last').remove();
                    }
                } );
        });
}

function validate_cell( cell, cell_valid ) {
    var val=$(cell).val();
    if ( cell_valid( $(cell).val() )) {
        $(cell).css( "background-color", "white" );
        return true;
    } else {
        $(cell).css( "background-color", "pink" );
        return false;
    }
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

function seqpos_cell_valid( cell_val ) {
    return cell_val !== "";
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

function load_library_from_table( library, scp_int, max_dcs ) {
    // turn the user-provided input into a CSV string
    var rows = [];
    var trs = $('#aacounts tbody').find('tr');
    var allow_mdcs = $('#primerboundary_row').is(':visible');

    library.max_extra_primers = allow_mdcs ? max_dcs : 0;

    for ( var i=0; i < trs.length; ++i ) {
        var tds = $(trs[i]).find('td');
        var icols = []
        for ( var j=0; j < tds.length; ++j ) {
            var jcontents;
            if ( j === 0 ) {
                jcontents = $(tds[j]).val();
            } else {
                var jval = strip_whitespace( $($(tds[j]).find("input")[0]).val() );
                if ( i === 1 ) {
                    if ( allow_mdcs ) { jcontents = jval; }
                    else { jcontents = "-"; }
                } else if ( i === 2 ) {
                    if ( allow_mdcs ) { jcontents = jval; }
                    else { jcontents = "1"; }
                } else {
                    // the amino-acid rows
                    jcontents = jval;
                    if ( i !== 0 && jcontents === "" ) { jcontents = "0"; }
                    if ( i === 23 && scp_int !== 0 ) { jcontents = scp_int.toString(); }
                }
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
        var error_trace = library.traceback_mdcs_from_nextra_and_error( error_list[i][0], error_list[i][1] );
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
    var trs = $('#aacounts tbody').find('tr');
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
    if ( nrows != 24 ) {
        var msg = "<p>Could not update table from CSV contents.  Expected to find 24 rows, but found " + nrows + "</p>";
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
    var trs = $('#aacounts tbody').find('tr');
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

function populate_table_from_fasta () {
    var fasta_contents = $('#fasta').val().split(">");
    fasta_contents.shift();//remove anything before the first '>'

    var nsequences = fasta_contents.length;
    console.log(nsequences);
    if ( nsequences <= 1 ) {
        var msg = "<p>You must specify at least 2 FASTA files to update the table.</p>";
        $('#update_result').html(msg).css("color","red").show();
        return;
    }

    //initialize table array, set defaults for table positions not definable in the FASTA format
    var seq_length = fasta_contents[0].substr(fasta_contents[0].indexOf('\n')+1).trim().split('').length;
    var table_contents = [];
    for( var i=0; i < 24; ++i) {
        table_contents[i] = [];
    }
    for( var j=0; j < seq_length; ++j) {
        table_contents[0][j] = j+1;
        table_contents[1][j] = '-';
        table_contents[2][j] = 1;
        for( var k=3; k<=23; ++k ) {
            table_contents[k][j] = 0;
        }
    }

    for( var i=0; i < nsequences; ++i ) {
        var cur_seq = fasta_contents[i].substr(fasta_contents[i].indexOf('\n')+1).trim().split('');
        console.log(cur_seq);
        var cur_length = cur_seq.length;
        if(cur_length != seq_length) {
            var msg = "<p>All FASTA sequences must be the same length. Sequence " + i+1 + " is not the same size as previous sequences</p>";
            $('#fasta_errors').html(msg).css("color","red").show();
            return;
        }

        for( var j=0; j < seq_length; ++j ) {
            switch(cur_seq[j].toUpperCase()) {
                case 'A':
                    table_contents[3][j]++;
                    break;
                case 'C':
                    table_contents[4][j]++;
                    break;
                case 'D':
                    table_contents[5][j]++;
                    break;
                case 'E':
                    table_contents[6][j]++;
                    break;
                case 'F':
                    table_contents[7][j]++;
                    break;
                case 'G':
                    table_contents[8][j]++;
                    break;
                case 'H':
                    table_contents[9][j]++;
                    break;
                case 'I':
                    table_contents[10][j]++;
                    break;
                case 'K':
                    table_contents[11][j]++;
                    break;
                case 'L':
                    table_contents[12][j]++;
                    break;
                case 'M':
                    table_contents[13][j]++;
                    break;
                case 'N':
                    table_contents[14][j]++;
                    break;
                case 'P':
                    table_contents[15][j]++;
                    break;
                case 'Q':
                    table_contents[16][j]++;
                    break;
                case 'R':
                    table_contents[17][j]++;
                    break;
                case 'S':
                    table_contents[18][j]++;
                    break;
                case 'T':
                    table_contents[19][j]++;
                    break;
                case 'V':
                    table_contents[20][j]++;
                    break;
                case 'W':
                    table_contents[21][j]++;
                    break;
                case 'Y':
                    table_contents[22][j]++;
                    break;
                default:
                    var msg = "<p>Invalid amino acid code in sequence " + i+1 + " position " + j+1 + "</p>";
                    $('#fasta_errors').html(msg).css("color","red").show();
                    return;
            }
        }
    }

    //Table dump, debugging
    //for( var i=0; i < table_contents.length; ++i ) {
    //    var line='';
    //    for( var j=0; j < table_contents[i].length; ++j ) {
    //        line += table_contents[i][j] + ",";
    //    }
    //}

    //remove non-variable positions
	var nvariable_positions = 0;
	var nremoved_positions = 0;
    for( var i=0; i < seq_length - nremoved_positions; ++i ) {
        var num_aas=0;
        for( var j=3; j < 23; ++j ) {
            if( table_contents[j][i] > 0 ) {
                ++num_aas;
            }
        }
        if(num_aas <= 1) {
            for( var j=0; j < 24; ++j ) {
                table_contents[j].splice(i, 1);
            }
			--i;
			++nremoved_positions;
    	}
		else {
			nvariable_positions++
		}
    }

	if( nvariable_positions <= 0 ) {
		var msg = "<p>You must have variability in at least one positions in the set of sequences</p>";
		$('#fasta_errors').html(msg).css("color","red").show();
    	return;
	}

    //resize the table
    var trs = $('#aacounts tbody').find('tr');
    var ncolumns_curr = $(trs[0]).find('td').length - 1;
    if ( ncolumns_curr < nvariable_positions ) {
        for ( var i=ncolumns_curr; i < nvariable_positions; ++i ) {
            add_column_to_aacounts();
        }
    } else {
        for ( var i=ncolumns_curr; i > nvariable_positions; --i ) {
            delete_column_from_aacounts();
        }
    }

    //populate the table
    var trs = $('#aacounts tbody').find('tr');
    for ( var i=0; i < trs.length; ++i ) {
        var tds = $(trs[i]).find("td");
        var row_i = table_contents[i];
        for ( var j=0; j < row_i.length; ++j ) {
            $($(tds[j+1]).find("input")[0]).val( row_i[j] );
        }
    }
    $('#fasta_errors').html('<p>Successfully updated the table</p>').css("color","green").show();
    return;
}

function handle_tab_vs_csv_change( rad_button ) {
    var new_csv = create_csv_from_table();
    $('#csvaacounts').val( new_csv );
}


function validate_inputs_and_launch( launch_button ) {

    var trs = $('#aacounts tbody').find('tr');
    var any_errors = false;
    for (var i = 0; i < trs.length; ++i) {
        var tds = $(trs[i]).find('td');
        for (var j = 1; j < tds.length; ++j) {
            var ij_input = $(tds[j]).find('input')[0];
            if (i === 0) {
                if ( ! validate_cell( ij_input, seqpos_cell_valid     ) ) any_errors = true;
            } else if ( i === 1 ) {
                //if ( ! validate_cell( ij_input, primer_boundary_valid  ) ) any_errors = true;
            } else if ( i === 2 ) {
                //if ( ! validate_cell( ij_input, max_dcs_per_pos_valid ) ) any_errors = true;
            } else {
                //if ( ! validate_cell( ij_input, aacountcell_valid     ) ) any_errors = true;
            }
        }
    }

    // also validate the stop-codon penalty, and the upper and lower bounds cells.
    var scp = $('#stop_codon_penalty');
    var scp_valid = validate_cell( scp, stop_codon_penalty_valid );
    if ( ! scp_valid ) { any_errors = true; }

    var libsize_upper = $('#libsize_upper');
    var libsize_lower = $('#libsize_lower');
    var libsize_upper_is_valid = validate_cell( libsize_upper, libsize_upper_valid );
    var libsize_upper_val;
    var libsize_lower_val;
    if ( ! libsize_upper_is_valid ) {
        any_errors = true;
    }
    else {
        libsize_upper_val = parseFloat( $(libsize_upper).val() );
        var lisize_lower_is_valid = validate_cell( libsize_lower, function( the_arg ) { return libsize_lower_valid( libsize_upper_val, the_arg ); } );
        if ( ! libsize_lower_valid ) {
            any_erors =  true;
        } else {
            libsize_lower_val = parseFloat( $(libsize_lower).val() );
        }
    }

    var max_extra_primers = $('#max_extra_primers');
    if ( ! validate_cell( max_extra_primers, max_extra_primers_valid ) ){
        any_errors = true;
    }

    if ( any_errors ) {
        alert( "Errors in inputs" );
        return;
    }

    var max_extra_primers_val = parseInt( $(max_extra_primers).val() );
    if ( max_extra_primers_val !== max_extra_primers_val ) {
        max_extra_primers_val = 0;
    }

    // always consider the stop codon penalty to represent a negative number
    var scp_int = -1 * Math.abs( parseInt( $(scp).val() ) );
    if ( scp_int !== scp_int ) {
        scp_int = 0;
    }


    //disable inputs while working
    $(launch_button).button("option","disabled", true);
    $(launch_button).button( "option", "label", "Working..." );

    // do the actual computation after we've updated the DOM.
    setTimeout( function () {
        var starttime = new Date().getTime();
        var library = AALibrary();
        load_library_from_table( library, scp_int, max_extra_primers_val );
        library.compute_smallest_diversity_for_all_errors_given_n_deg_codons_sparse();
        if ( verify_solution_exists( library )) {
            library.optimize_library_multiple_dcs();
            if ( libsize_lower_val != libsize_lower_val ) {
                var error_list = [ library.find_minimal_error_beneath_diversity_cap_mdcs( libsize_upper_val ) ];
            } else {
                var error_list = library.errors_in_diversity_range( libsize_upper_val, libsize_lower_val );
                console.log( "Error list: ", error_list.join(",") );
            }
            var stoptime = new Date().getTime();
            var output_html = "Running time: " + (( stoptime - starttime ) / 1000 )+ " seconds<br>" + output_tables_from_error_values( library, error_list, libsize_upper_val );

            $('#resultdiv').html( output_html );

        } else {
            $('#resultdiv').html( "<p id=scrollhere > No solution exists for the given set of required (*) and forbidden (!) amino acids </p>" );
        }
        $(launch_button).button("option","disabled", false);
        $(launch_button).button( "option", "label", "Generate Library" );
        $('#scrollhere').scrollIntoView();
    }, 1 );
}

// Local Variables:
// js-indent-level: 4
// indent-tabs-mode: nil
// End:
