$(document).ready(function () {
	//Setup the tabbed input interface
	$( "#tabs" ).tabs({
		beforeActivate: function( event, ui ) {
			if(ui.newPanel.attr('id') == 'csv_tab'){
				handle_tab_vs_csv_change(this);
			}
		}
	});

	//Roll the instructions into a collapsable layout
	$( "#accordion" ).accordion({
		collapsible: true
	});

	//Add themable tooltips
	$( document ).tooltip();

	//And themable buttons
	$( "input[type=submit], button" ).button();

	//Playing around with validation, not working right now
	//$( "#mainForm" ).validate({
	//	errorLabelContainer: '#mainErrors'
	//});

	$( '#aacounts' ).dragtable({
		dragaccept:'.accept'
	});

	$('#primerboundary_row').hide();
	$('#maxdcs_row').hide();
	$('#max_extra_dcs_input').hide();

	$('#allow_mult_dcs').click( function() { enable_or_disable_mdcs( this ); } );
	$('#add').click( add_column_to_aacounts );
	$('#delcol').click( delete_column_from_aacounts );
	$('.aacountcell').blur( function() {validate_aacount_cell(this);} );
	$('.seqposcell').blur( function() { validate_seqpos_cell(this);} );
	$('#launchbutton').click( function() { validate_inputs_and_launch(this); } );
	$("#table_from_csv").click( populate_table_from_csv );
});

