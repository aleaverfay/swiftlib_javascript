
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
	$( document ).tooltip( { position: { my: "left+15 center", at: "right center" } } );

	//And themable buttons
	$( "input[type=submit], button" ).button();

	//Playing around with validation, not working right now
	//$( "#mainForm" ).validate({
	//	errorLabelContainer: '#mainErrors'
	//});

	$( '#aacounts' ).dragtable({
		dragaccept:'.accept'
	});

	// $('#primerboundary_row').hide();
	// $('#maxdcs_row').hide();
	$('#max_primers_total_div').hide();

	$('#allow_mult_dcs').click( function() { enable_or_disable_mdcs( this ); } );
	$('#add').click( add_column_to_aacounts );
	$('#delcol').click( delete_column_from_aacounts );
	$('#reportbutton').click( generate_report );
	$("#table_from_csv").click( populate_score_library_table_from_csv );

	update_table_validation_rules();

	$("#table_from_fasta").click( populate_table_from_fasta );
	$("#table_from_msf").click( populate_table_from_msf );
});

