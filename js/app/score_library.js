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

function load_library_and_codon_assignment_from_table( library, dcs ) {
    // turn the user-provided input into a CSV string
    var rows = [];
    var trs = $('#aacounts tbody').find('tr');
    var allow_mdcs = $('#primerboundary_row').is(':visible');

    for ( var i=0; i < 24; ++i ) {
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
                }
            }
            icols.push( jcontents );
        }
        rows.push( icols.join(",")  );
    }
    var csv_string = rows.join( "\n" );

    //console.log( csv_string );
    library.load_library( csv_string );

    var row25 = $(trs[24]).find('td');
    for ( var j = 1; j < row25.length; ++j ) {
        var jval = $($(row25[j]).find("input")[0]).val();
        var jvals = jval.split("&");
        dcs[ j-1 ] = jvals;
    }

}

function populate_score_library_table_from_csv() {
    populate_table_from_csv( 25 );
}

function generate_report() {

    var trs = $('#aacounts tbody').find('tr');
    var any_errors = false;
    for (var i = 0; i < trs.length-1; ++i) {
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

    if ( any_errors ) {
        alert( "Errors in inputs" );
        return;
    }

    var library = AALibrary();
    library.enumerate_aas_for_all_degenerate_codons();

    var dcs = [];
    load_library_and_codon_assignment_from_table( library, dcs );

    // validate the input DCs
    var dc_inds = newFilledArray( dcs.length, 0 );

    var all_codons_ok = true;
    var dc = DegenerateCodon();
    for ( var ii = 0; ii < dcs.length; ++ii ) {
        dc_inds[ii] = newFilledArray( dcs[ii].length, 0 );
        for ( var jj = 0; jj < dcs[ii].length; ++jj ) {
            var jj_codon = dcs[ii][jj].trim()
            var jj_codon_ok = dc.validate_codon_string( jj_codon );
            if ( ! jj_codon_ok ) {
                all_codons_ok = false;
            } else {
                dc.set_from_codon_string( jj_codon );
                dc_inds[ ii ][ jj ] = dc.degenerate_codon_index();
            }
        }
    }

    if ( ! all_codons_ok ) {
        alert( "Problems with degenerate codons" );
        return;
    }

    var output_html = output_tables_from_codon_assignments( library, [ dc_inds ] );

    /*    var output_html = [ "<table table id=scrollhere class=result_table><tr class rthreader><td>Pos</td><td>Stretch</td><td>Codon</td><td>Present</td><td>Absent</td><td>Error</td><td># Codons</td><td># AA</td><td>Percent Desired AAs</td></tr>" ];
    var dc = DegenerateCodon();
    var count_stretch = 0;
    var log_total_na_size = 0;
    var log_total_aa_size = 0;
    var total_error = 0;
    var desired_aa_product = 1;
    
    for ( var i = 0; i < library.n_positions; ++i ) {
        if ( library.stretch_reps[i] === i ) ++count_stretch;
        var ihtml = [];
        var aas = newFilledArray( 21, false );
        var isize = 0;
        var i_count_desired = 0;
        for ( var j = 0; j < dcs[i].length; ++j ) {
            var j_dc_string = dcs[i][j];
            dc.set_from_codon_string( j_dc_string );
            isize += dc.diversity();
            jaas = library.aas_for_degenerate_codon( dc );
            for ( var k = 0; k < 21; ++k ) {
                aas[ k ] = aas[ k ] || jaas[ k ];
            }
            i_count_desired += desired_aa_count_for_position( library, i, dc );
        }
        log_total_na_size += Math.log( isize );
        var i_desired_aa_fraction = i_count_desired / isize;
        desired_aa_product *= i_desired_aa_fraction;

        var aas_present = [];
        var inaapresent = 0;
        for ( var j = 0; j < 21; ++j ) {
            if ( aas[j] ) {
                ++inaapresent;
                aas_present.push( library.gcmapper.aastr_for_integer( j ) );
            }
        }
        log_total_aa_size += Math.log( inaapresent );


        var ierror = library.error_given_aas_for_pos( i, aas );
        total_error += ierror;
        ihtml.push( "<tr>" );
        ihtml.push( [ "<td>", library.orig_pos[i], "</td>" ].join("") );
        ihtml.push( [ "<td>", count_stretch.toString(), "</td>" ].join("") );
        ihtml.push( [ "<td>", dcs[i].join(","), "</td>" ].join("") );
        ihtml.push( [ "<td>", aas_present.join(","), "</td>" ].join("") );
        ihtml.push( [ "<td>", "", "</td>" ].join("") );
        ihtml.push( [ "<td>", ierror.toString(), "</td>" ].join("") );
        ihtml.push( [ "<td>", isize.toString(), "</td>" ].join("") );
        ihtml.push( [ "<td>", inaapresent.toString(), "</td>" ].join("") );
        ihtml.push( [ "<td>", ( i_count_desired / isize * 100 ).toFixed(2), "%</td>" ].join("") );
        ihtml.push( "</tr>" );

        output_html.push( ihtml.join("\n") );
    }
    output_html.push("</table>");
    output_html.push( "<br>Total NA size: " + Math.round( Math.exp( log_total_na_size )).toExponential() );
    output_html.push( "<br>Total AA size: " + Math.round( Math.exp( log_total_aa_size )).toExponential() );
    output_html.push( "<br>Total error: " + total_error );
    output_html.push( "<br>% Desired: " + ( desired_aa_product * 100 ).toFixed(2) );*/

    $('#resultdiv').html( output_html );
    $('#scrollhere').scrollIntoView();

}


// Local Variables:
// js-indent-level: 4
// indent-tabs-mode: nil
// End:
