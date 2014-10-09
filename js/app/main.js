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

	$('#primerboundary_row').hide();
	$('#maxdcs_row').hide();
	$('#max_primers_total_div').hide();

	$('#allow_mult_dcs').click( function() { enable_or_disable_mdcs( this ); } );
	$('#add').click( add_column_to_aacounts );
	$('#delcol').click( delete_column_from_aacounts );
	$('#launchbutton').click( function() { validate_inputs_and_launch(this); } );
	$("#table_from_csv").click( populate_table_from_csv );

	$('#libsize_upper').blur( function() { validate_cell( this, libsize_upper_valid ); } );
	update_table_validation_rules();

	$("#table_from_fasta").click( populate_table_from_fasta );
	$("#table_from_msf").click( populate_table_from_msf );
	$("#table_from_clustal").click( populate_table_from_clustal );
});

