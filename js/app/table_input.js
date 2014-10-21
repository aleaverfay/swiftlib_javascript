// The MIT License (MIT)
// 
// Copyright (c) 2014 Andrew Leaver-Fay, Tim Jacobs, Hayretin Yumerefendi, Brian Kuhlman.
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
//     in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
    return val_is_integer( cell_val ) && parseInt( cell_val ) > 0;
}

function stop_codon_penalty_valid( cell_val ) {
    return cell_val === "" || cell_val === "!" || val_is_integer( cell_val );
}

function libsize_upper_valid( cell_val ) { return val_is_number( cell_val ); }

//function libsize_lower_valid( libsize_upper, cell_val ) {
//    if ( cell_val === "" ) return true;
//    if ( ! val_is_number( cell_val ) ) return false;
//    var libsize_lower = parseFloat( cell_val );
//    if ( libsize_lower < 0 ) return false;
//    return libsize_lower < libsize_upper;
//}

function nsolutions_valid( cell_val ) {
    return ( cell_val === "" ) || ( val_is_integer( cell_val ) && parseInt( cell_val ) > 0 );
}

function max_primer_count_valid( cell_val ) {
    if ( cell_val === "" ) return !($('#primerboundary_row').is(':visible'));
    return val_is_integer( cell_val );
}

function enable_or_disable_mdcs( allow_mdcs ) {
    //alert( $(allow_mdcs).text() );
    $(('#primerboundary_row')).toggle();
    $(('#maxdcs_row')).toggle();
    $(('#max_primers_total_div')).toggle();
    
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

    update_table_validation_rules();
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

function update_table_validation_rules() {
    $('.aacountcell').blur( function() {validate_cell(this, aacountcell_valid );} );
    $('.seqposcell').blur( function() { validate_cell(this, seqpos_cell_valid );} );
    $('.primercell').blur( function() { validate_cell(this, primer_boundary_valid ); } );
    $('.maxdccell').blur( function() { validate_cell(this, max_dcs_per_pos_valid ); } );
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

function load_library_from_table( library, scp_value, max_primers_total ) {
    // turn the user-provided input into a CSV string
    var rows = [];
    var trs = $('#aacounts tbody').find('tr');
    var allow_mdcs = $('#primerboundary_row').is(':visible');

    library.max_oligos_total = allow_mdcs ? max_primers_total : 0;
    //library.max_oligos_per_stretch = allow_mdcs ? max_primers_total : 0;

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
                    if ( allow_mdcs ) {
                        if ( j === 1 ) {
                            jcontents = "|"; // first position is always a primer boundary
                        } else {
                            jcontents = jval;
                        }
                    } else { jcontents = "-"; }
                } else if ( i === 2 ) {
                    if ( allow_mdcs ) { jcontents = jval; }
                    else { jcontents = "1"; }
                } else {
                    // the amino-acid rows
                    jcontents = jval;
                    if ( i !== 0 && jcontents === "" ) { jcontents = "0"; }
                    if ( i === 23 && scp_value !== "" ) { jcontents = scp_value; }
                }
            }
            icols.push( jcontents );
        }
        rows.push( icols.join(",")  );
    }
    var csv_string = rows.join( "\n" );

    //console.log( csv_string );
    library.load_library( csv_string );
}

function verify_solution_exists( library ) {
    var nosolution_pos = library.find_positions_wo_viable_solutions();
    var all_ok = true;
    for ( var ii = 0; ii < library.n_positions; ++ii ) {
        if ( nosolution_pos[ ii ] ) { 
            all_ok = false;
            break;
        }
    }

    var trs = $('#aacounts').find( 'tr' );
    for ( var i=0; i < library.n_positions; ++i ) {
        for ( var j=0; j < trs.length; ++j ) {
            var jtd = $(trs[j]).find('td')[ i+1 ];
            if ( nosolution_pos[i] ) {
                $(jtd).css("background-color", "pink");
            } else {
                $(jtd).css("background-color", "white");
            }
        }
    }
    return all_ok;

}

function output_tables_from_error_values( library, error_list )  {
    var codon_assignments = [];
    for ( var ii = 0; ii < error_list.length; ++ii ) {
        var error_trace = library.traceback_from_starting_point( error_list[ii][0], error_list[ii][1], error_list[ii][2] );
        codon_assignments.push( codon_assignment_from_error_sequence( library, error_trace ));
    }
    return output_tables_from_codon_assignments( library, codon_assignments );
}


function output_tables_from_codon_assignments( library, codon_assignments ) {
    var output_html = [];
    for ( var i=0; i < codon_assignments.length; ++i ) {
        var table_i = [];
        var i_data = report_output_library_data_from_codon_assignment( library, codon_assignments[i] );
        var i_summary = ["<table class=result_table><tr class=rtheader><td>Result #</td><td>Error</td><td># Oligos Total</td>" +
                         "<td>Theoretical Diversity (DNA)</td><td>Amino-acid diversity</td><td>Percent Desired AAs</td></tr><tr><td>",
                         (i+1).toString(), "</td><td>",
                         i_data.error.toString(), "</td><td>",
                         i_data.n_primers_required.toString(), "</td><td>",
                         i_data.dna_diversity.toExponential(3), "</td><td>",
                         i_data.aa_diversity.toExponential(3), "</td><td>",
                         ( i_data.desired_aa_product * 100 ).toFixed(2), "%</td></tr></table><br>" ];
        var table = [];
        if ( i === 0 ) {
            table.push( "<table id=scrollhere class=result_table>" );
        } else {
            table.push( "<table class=result_table>" );
        }
        table.push( "<tr class=rtheader><td>Pos</td><td>Stretch</td><td>Codon</td><td>Present</td><td>Absent</td><td>Error</td><td># Codons</td><td># AA</td><td>%desired</td></tr>" );
        var count_stretch = 0;
        for ( var j=0; j < library.n_positions; ++j ) {
            if ( library.stretch_reps[j] === j ) ++count_stretch
            var j_pos = i_data.positions[j];
            if ( j % 2 === 0 && count_stretch % 2 === 0 ) {
                table.push( "<tr class=rtee>" );
            } else if ( j % 2 === 0 ) {
                table.push( "<tr class=rteo>" );
            } else if ( count_stretch % 2 === 0 ) {
                table.push( "<tr class=rtoe>" );
            } else {
                table.push( "<tr class=rtoo>" );
            }
            table.push( [ "<td>", j_pos.orig_pos_string, "</td>" ].join("") );
            table.push( [ "<td>", count_stretch.toString(), "</td>" ].join("") );
            table.push( [ "<td>", j_pos.codon_string,"</td>" ].join("") );
            table.push( [ "<td>", j_pos.present_string,"</td>" ].join("") );
            table.push( [ "<td>", j_pos.absent_string,"</td>" ].join("") );
            table.push( [ "<td>", j_pos.error.toString(), "</td>" ].join("") );
            table.push( [ "<td>", Math.round(Math.exp( j_pos.log_dna_diversity )), "</td>" ].join("") );
            table.push( [ "<td>", j_pos.aa_count, "</td>" ].join("") );
            table.push( [ "<td>", ( 100 * j_pos.desired_aa_frac ).toFixed(0), "%</td>" ].join("" ) );
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
            //console.log( "row " + i + " column " + j + " : " + jval );
            row_i.push( jval );
        }
        table_contents.push( row_i.join(",") );
    }
    return table_contents.join("\n");
}

function populate_table_from_csv( target_nrows ) {
    target_nrows = 24;

    var csv_contents = $('#csvaacounts').val().split("\n");
    var csv_data = []
    var nrows = csv_contents.length;
    if ( nrows != target_nrows ) {
        var msg = "<p>Could not update table from CSV contents.  Expected to find " + target_nrows + " rows, but found " + nrows + "</p>";
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
    var seq_length = fasta_contents[0].substr(fasta_contents[0].indexOf('\n')+1).
        trim().replace(/\r?\n|\r| /g,"").split('').length;
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
        var cur_seq = fasta_contents[i].substr(fasta_contents[i].indexOf('\n')+1).trim().replace(/\r?\n|\r| /g,"").split('');
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
                case '-':
                    break;
                default:
                    var msg = "<p>Invalid amino acid code " + cur_seq[j] + " in sequence " + i+1 + " position " + j+1 + "</p>";
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

function populate_table_from_clustal () {
    var clustal_contents = $('#clustal').val();
    clustal_contents = clustal_contents.split('\n');
    var sequences = {};
    for(var i=0; i < clustal_contents.length; ++i) {
        var cur_line = clustal_contents[i].trim().split(/\s+/);
        if( i == 0 ) {
            if(cur_line[0] != "CLUSTALW" && cur_line[0] != "CLUSTAL") {
                $('#clustal_errors').html('<p>Malformed Clustal alignment data - the first line of the file start with "CLUSTAL"</p>').css("color","red").show();
                return;
            }
        }
        else {
            //Skip blank lines
            if(cur_line.length == 1 && cur_line[0] == "") { continue; }

            //Skip alignment lines (only contain whitespace, ':', '*', and '.' characters)
            if(clustal_contents[i].search(/[^\s:\.\*]/) == -1) {
                continue;
            }

            var sequence_name = cur_line[0];
            var sequence = cur_line[1];
            if(sequence.length > 60) {
                $('#clustal_errors').html('<p>Malformed Clustal W alignment data - more than 60 characters found on sequence line '+(i+1)+'</p>').css("color","red").show();
                return;
            }
            if(sequences[sequence_name]) {
                sequences[sequence_name] = sequences[sequence_name] + sequence;
            }
            else {
                sequences[sequence_name] = sequence;
            }
        }
    }
    console.log(sequences);
    populate_table_from_sequences_object(sequences, $('#clustal_errors'));
    return;
}

function populate_table_from_msf () {
    var msf_contents = $('#msf').val().split("//");
    if(msf_contents.length < 2) {
        $('#msf_errors').html('<p>Malformed MSF contents, expected "//" delimiter</p>').css("color","red").show();
        return;
    }
    msf_contents = msf_contents[1].split('\n');
    sequences = {};
    for(var i=0; i < msf_contents.length; ++i) {
        var cur_line = msf_contents[i].trim().split(/\s+/);
        if(!(cur_line.length == 1 && cur_line[0] == "")) {
            if(cur_line.length != 2) {
                console.log(cur_line);
                console.log(cur_line.length);
                $('#msf_errors').html('<p>Malformed MSF contents, each sequence line must have a name and sequence</p>').css("color","red").show();
                return;
            }
            if(sequences[cur_line[0]]) {
                sequences[cur_line[0]] = sequences[cur_line[0]] + cur_line[1];
            }
            else {
                sequences[cur_line[0]] = cur_line[1];
            }
        }
    }
    populate_table_from_sequences_object(sequences, $('#msf_errors'));
    return;
}


function populate_table_from_sequences_object(sequences, error_div) {
    //Get the sequence length
    console.log(error_div);
    var seq_length = 0;
    for( var seq_name in sequences ) {
        if(sequences.hasOwnProperty(seq_name)) {
            var cur_length = sequences[seq_name].length;
            seq_length = cur_length;
            break;
        }
    }

    //initialize table array, set defaults for table positions not definable in the MSF format
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

    for( var seq_name in sequences ) {
        if(sequences.hasOwnProperty(seq_name)) {
            var cur_seq = sequences[seq_name];
            console.log(cur_seq);
            var cur_length = cur_seq.length;
            if(cur_length != seq_length) {
                console.log("seq length: " + seq_length);
                console.log("cur length: " + cur_length);
                var msg = "<p>All sequences must be the same length. Sequence '" + seq_name + "' is not the same size as previous sequences</p>";
                error_div.html(msg).css("color","red").show();
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
                    case '-':
                        break;
                    default:
                        var msg = "<p>Invalid amino acid code " + cur_seq[j] + " in sequence " + i+1 + " position " + j+1 + "</p>";
                        error_div.html(msg).css("color","red").show();
                        return;
                }
            }
        }
    }

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
        error_div.html(msg).css("color","red").show();
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
    error_div.html('<p>Successfully updated the table</p>').css("color","green").show();
}

function handle_tab_vs_csv_change( rad_button ) {
    var new_csv = create_csv_from_table();
    $('#csvaacounts').val( new_csv );
}

function pareto_subset_2D( pairs ) {
    var pareto_front = [];
    pairs.sort( function( a, b ) { return a[0] === b[0] ? a[1] - b[1] : a[0]-b[0]; } );
    pareto_front.push( pairs[0] );
    for ( var ii = 0; ii < pairs.length; /* no increment */ ) {
        var iicurr = ii;
        for ( var jj = ii+1; jj < pairs.length; ++jj ) {
            if ( pairs[jj][1] < pairs[ii][1] ) {
                ii = jj;
                pareto_front.push( pairs[jj] );
                break;
            }
        }
        if ( iicurr == ii ) {
            break;
        }
    }
    return pareto_front;
}

function pareto_optimal_solutions( library, diversity_cap ) {
    var error_libsize_pairs = library.report_error_and_libsizes_beneath_diversity_cap( diversity_cap );
    return pareto_subset_2D( error_libsize_pairs );
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
    var libsize_upper_is_valid = validate_cell( libsize_upper, libsize_upper_valid );
    var libsize_upper_val;
    if ( ! libsize_upper_is_valid ) {
        any_errors = true;
    }
    else {
        libsize_upper_val = parseFloat( $(libsize_upper).val() );
    }

    var nsolutions_div = $('#nsolutions');
    var nsolutions_is_valid = validate_cell( nsolutions_div, nsolutions_valid );
    var nsolutions = $('#nsolutions').val();
    if ( nsolutions === "" ) {
        nsolutions = 1;
    } else {
        nsolutions = parseInt( nsolutions );
    }

    var max_primers_total = $('#max_primers_total');
    if ( ! validate_cell( max_primers_total, max_primer_count_valid ) ){
        any_errors = true;
    }

    if ( any_errors ) {
        alert( "Errors in inputs" );
        return;
    }

    var max_primers_total_val = parseInt( $(max_primers_total).val() );
    if ( max_primers_total_val !== max_primers_total_val ) {
        max_primers_total_val = 0;
    }


    // always consider the stop codon penalty to represent a negative number
    var scp_val = $(scp).val();
    if ( scp_val !== "!" && scp_val !== "" ) {
        var scp_int = -1 * Math.abs( parseInt( $(scp).val() ) );
        scp_val = scp_int.toString();
    }

    //disable inputs while working
    $(launch_button).button("option","disabled", true);
    $(launch_button).button( "option", "label", "Working..." );
    $('#resultdiv').html("");

    // do the actual computation after we've updated the DOM.
    setTimeout( function () {
        var starttime = new Date().getTime();
        var library = AALibrary();
        load_library_from_table( library, scp_val, max_primers_total_val );
        library.compute_smallest_diversity_for_all_errors();
        if ( verify_solution_exists( library )) {
            library.optimize_library( libsize_upper_val, nsolutions );
            if ( nsolutions === 1 ) {
                var error_list = [ library.find_minimal_error_beneath_diversity_cap( libsize_upper_val ) ];
            } else {
                var error_list = library.find_errors_and_ndcs_beneath_diversity_cap( libsize_upper_val, nsolutions );
                console.log( "Error list: ", error_list.join(",") );
            }
            var stoptime = new Date().getTime();

            var output_html;
            if ( error_list.length === 0 || ( error_list.length === 1 && error_list[0][0] === library.infinity ) ) {
                var smallest_diversity = library.find_smallest_diversity();
                output_html = '<p id=scrollhere style="color:red;">No library could be constructed beneath the given size limit; ' +
                    "the smallest library that could be constructed contained a diversity of ";
                if ( smallest_diversity < Math.log( 100 )) {
                    output_html += Math.round( Math.exp( smallest_diversity ) );
                } else {
                    output_html += Math.exp( smallest_diversity ).toExponential(3);
                }
                output_html += ".</p>";
            } else {

                output_html = "Running time: " + (( stoptime - starttime ) / 1000 ) + " seconds<br>" +
                    output_tables_from_error_values( library, error_list /*, libsize_upper_val*/ );
            }
            $('#resultdiv').html( output_html );

        } else {
            $('#resultdiv').html( "<p id=scrollhere > No solution exists for the given set of required (*) and forbidden (!) amino acids </p>" );
        }
        $(launch_button).button("option","disabled", false);
        $(launch_button).button( "option", "label", "Generate Library" );
        $('#scrollhere').scrollIntoView();
        
        // TIM TIM TIM!  This is the code to extract the pareto optimal solutions from the library.
        // This can be called anywhere after either library.find_minimal_error_beneath_diversity_cap or
        // library.find_errors_and_ndcs_beneath_diversity_cap gets called.
        var pareto_optimal_error_logdiversity_pairs = pareto_optimal_solutions( library, libsize_upper_val );
        for ( var ii = 0; ii < pareto_optimal_error_logdiversity_pairs.length; ++ii ) {
            console.log( "solution " + (ii+1).toString() + ": " + pareto_optimal_error_logdiversity_pairs[ii][0].toString() +
                         ", " + pareto_optimal_error_logdiversity_pairs[ii][1].toString() );
        }

    }, 1 );
}

/*
function report_useful_codon_fraction( library ) {
    // library.find_useful_codons must have been called first!
    var dc = DegenerateCodon();
    var lex = LexicographicalIterator( [ 15, 15, 15 ] );
    for ( var i = 0; i < library.n_positions; ++i ) {
        var iuseful = [ "Position ", library.orig_pos[i], " with ", library.useful_codons[i].length ];
        iuseful.push( " useful codons of 3375 ( " + (library.useful_codons[i].length / 3375) + "% )" );
        console.log( iuseful.join(" ") );
        codons = []
            for ( var j=0; j < library.useful_codons[i].length; ++j ) {
                lex.set_from_index( library.useful_codons[i][j] );
                dc.set_from_lex( lex );
                codons.push( dc.codon_string() + "(" + library.useful_codons[i][j] + "," + j + ")" );
            }
        codons.sort();
        console.log( "Useful codons: " +  codons.join(", ") );
    }
};
*/

/*

function go() {

    var library = AALibrary();

    //dc = DegenerateCodon();
    //dclex = LexicographicalIterator( [ 15, 15, 15 ] );
    //dclex.set_from_index( 15*15*3 + 15*4 + 12 );
    //dc.set_from_lex( dclex );
    //dc.log_diversity();
    //
    //return;

    //var dims = [7,7,7];
    //var lex = LexicographicalIterator( dims );
    //lex.upper_diagonal_reset();
    //while ( ! lex.at_end ) {
    //    console.log( "lex: " + lex.pos.join(", " ) );
    //    lex.upper_diagonal_increment();
    //}
    //return;

    var csv_contents = document.getElementById( "aaobs" ).value;
    library.load_library( csv_contents );

    library.enumerate_aas_for_all_degenerate_codons();
    var starttime = new Date().getTime();
    library.find_useful_codons();
    library.report_useful_codon_fraction();
    var stoptime = new Date().getTime();
    console.log( "finding useful codons took " + (( stoptime - starttime ) / 1000 )+ " seconds " );

    console.log( "enumerating sparse degenerate codon pairs" );
    var starttime = new Date().getTime();
    library.compute_smallest_diversity_for_all_errors();
    var stoptime = new Date().getTime();
    console.log( "enumerating sparse degenerate codon pairs took " + (( stoptime - starttime ) / 1000 )+ " seconds " );


    console.log( "running DP considering multiple degenerate codons" );
    var starttime = new Date().getTime();
    library.optimize_library();
    var stoptime = new Date().getTime();
    console.log( "running DP considering multiple degenerate codons took " + (( stoptime - starttime ) / 1000 )+ " seconds " );

    var error_traceback = library.traceback( Math.log( 3.2e8 ) );

    var old = report_output_library_data( library, error_traceback );
    for ( var ii = 0; ii < library.n_positions; ++ii ) {
        var iipos = old.positions[ ii ];
        console.log( "Pos: " + iipos.orig_pos_string + " codons: " + iipos.codon_string + " AAs: " + iipos.present_string + " Absent: " + iipos.absent_string );
    }


    //console.log( "enumerating degenerate codon pairs" );
    //library.compute_smallest_diversity_for_all_errors();
    //var starttime = new Date().getTime();
    //library.compute_smallest_diversity_for_all_errors_given_n_degenerate_codons();
    //var stoptime = new Date().getTime();
    //console.log( "enumerating degenerate codon pairs took " + (( stoptime - starttime ) / 1000 )+ " seconds " );
    //
    //var nbad = 0;
    //for ( var i = 0; i < library.n_positions; ++i ) {
    //    for ( var j = 0; j < library.max_per_position_error; ++j ) {
    //        if ( Math.abs( library.divmin_for_error_for_n_dcs[i][0][j] - library.divmin_for_error[i][j] ) > 1e-6 ) {
    //            nbad += 1;
    //            if ( nbad < 10 ) {
    //                console.log( "Bad #" + nbad + ", pos " + i + " error " + j + " " + library.divmin_for_error_for_n_dcs[i][0][j] + " != " + library.divmin_for_error[i][j] );
    //            }
    //        }
    //    }
    //}
    //console.log( "Nbad comparing library.divmin_for_error_for_n_dcs[i][0] against library.divmin_for_error[i]: " + nbad );
    //
    //var nbad = 0;
    //for ( var i = 0; i < library.n_positions; ++i ) {
    //    for ( var j = 0; j < library.max_dcs_per_pos; ++j ) {
    //        for ( var k = 0; k < library.max_per_position_error; ++k ) {
    //            if ( Math.abs( library.divmin_for_error_for_n_dcs[i][j][k] - library.divmin_for_error_for_n_dcs_sparse[i][j][k] ) > 1e-6 ) {
    //                nbad += 1;
    //                if ( nbad < 10 ) {
    //                    console.log( "Bad #" + nbad + ", pos " + i + " ncodons " + j + " error " + k + " " + library.divmin_for_error_for_n_dcs[i][j][k] + " != " + library.divmin_for_error_for_n_dcs_sparse[i][j][k] );
    //                    var codons = [];
    //                    var dc = DegenerateCodon();
    //                    var lex = LexicographicalIterator( [ 15, 15, 15 ] );
    //                    for ( var l = 0; l < library.codons_for_error_for_n_dcs[i][j][k].length; ++l ) {
    //                        var lexind = library.codons_for_error_for_n_dcs[i][j][k][l];
    //                        lex.set_from_index( lexind );
    //                        dc.set_from_lex( lex );
    //                        codons.push( dc.codon_string() );
    //                    }
    //                    console.log( "Codons: " + codons.join(", ") );
    //                }
    //            }
    //        }
    //    }
    //}
    //console.log( "Nbad comparing library.divmin_for_error_for_n_dcs against library.divmin_for_error_for_n_dcs_sparse: " + nbad );

    //var diversity_cap = 320000000;
    //var best = library.optimize_library( diversity_cap );
    //print_output_codons( library, best, diversity_cap );
}

*/




// Local Variables:
// js-indent-level: 4
// indent-tabs-mode: nil
// End:
