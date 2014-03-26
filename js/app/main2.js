
function report_aas_for_degenerate_codon() {

    $('#resultdiv').html( "" );

    var dcstring = $('#degcod_input').val();
    if ( dcstring.length !== 3 ) {
	console.log( "Bad length from #degcod_input: '" + dcstring + "' length " + dcstring.length() );
	return;
    }

    var dc = DegenerateCodon();
    var valid = dc.validate_codon_string( dcstring );
    if ( ! valid ) {
	console.log( "Invalid dcstring: " + dcstring );
	return;
    }

    dc.set_from_codon_string( dcstring );
    var library = AALibrary();
    var aas_present = library.aas_for_degenerate_codon( dc );
    var aalist = [];
    var count_aas = 0;
    for ( var i = 0; i < 21; ++i ) {
	if ( aas_present[i] ) {
	    if ( i < 20 ) {
		aalist.push( library.gcmapper.aastring[ i ] );
		++count_aas;
	    } else {
		aalist.push( "X" );
	    }
	}
    }
    var html = [ "<br><b>Amino acids:</b> ", aalist.join("" ), "<br>" ];
    html.push( "<b>Codon size:</b> " );
    html.push( dc.diversity().toString() );
    html.push( "<br>" );
    html.push( "<b>Amino acid size:</b> " );
    html.push( count_aas.toString() );
    html.push( "<br>" );

    $('#resultdiv').html( html.join("\n") );

    console.log( "Success" );
}


$(document).ready(function () {

	//And themable buttons
	$( "input[type=submit], button" ).button();

	$('#dcreport').click( report_aas_for_degenerate_codon );
});

