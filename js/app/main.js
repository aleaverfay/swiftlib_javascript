$(document).ready(function () {
	//Setup the tabbed input interface
	$( "#tabs" ).tabs();

	//Roll the instructions into a collapsable layout
	$( "#accordion" ).accordion({
		collapsible: true
	});

	//Add themable tooltips
	$( document ).tooltip();

	$( "button" ).button();

	$('#add').click( add_column_to_aacounts );
	$('#delcol').click( delete_column_from_aacounts );
	$('.aacountcell').blur( function() {validate_aacount_cell(this);} );
	$('.seqposcell').blur( function() { validate_seqpos_cell(this);} );
	$('#launchbutton').click( function() { validate_inputs_and_launch(this); } );
	$("#tab_vs_csv_radio input:radio").click( function() { handle_tab_vs_csv_change(this); } );
	$("#table_from_csv").click( populate_table_from_csv );
});

