

test( "hello test", function() {
	ok( 1 == "1", "Passed!" );
    });

test( "LexicographicalIterator standard tests", function() {
	var dims = [ 2, 3, 2 ];
	var lex = LexicographicalIterator( dims );
	var incremented = false;
	ok( lex.size === 3, "Lex size of three" );
	ok( lex.dimsizes[0] === 2, "Lex dimsizes[0] is 2" );
	ok( lex.dimsizes[1] === 3, "Lex dimsizes[1] is 3" );
	ok( lex.dimsizes[2] === 2, "Lex dimsizes[2] is 2" );
	ok( lex.dimprods[0] === 6, "Lex dimprods[0] is dimsizes[2] * dimsizes[1]" );
	ok( lex.dimprods[1] === 2, "Lex dimprods[0] is dimsizes[2]" );
	ok( lex.dimprods[2] === 1, "Lex dimprods[0] is 1" );
	ok( lex.search_space_size === 12, "Lex search space size = 12" );
	ok( ! lex.at_end, "Lex not 'at_end' to start" );
	ok( lex.pos[0] === 0, "At beginning, pos[0] === 0" );
	ok( lex.pos[1] === 0, "At beginning, pos[1] === 0" );
	ok( lex.pos[2] === 0, "At beginning, pos[2] === 0" );
	ok( lex.index() == 0, "Index at beginning is 0" );
	incremented = lex.increment();
	ok( incremented, "Lex should have incremented properly" );
	ok( ! lex.at_end, "Lex still not 'at_end'" );
	ok( lex.pos[0] === 0, "After first increment, updates highest-indexed position, pos[0] === 0" );
	ok( lex.pos[1] === 0, "After first increment, updates highest-indexed position, pos[1] === 0" );
	ok( lex.pos[2] === 1, "After first increment, updates highest-indexed position, pos[2] === 1" );
	ok( lex.index() === 1, "Index after first increment is 1" );
	incremented = lex.increment();
	ok( incremented, "Lex should have incremented properly" );
	ok( ! lex.at_end, "Lex still not 'at_end'");
	ok( lex.pos[0] === 0, "After second increment, updates highest-indexed position, pos[0] === 0" );
	ok( lex.pos[1] === 1, "After second increment, updates highest-indexed position, pos[1] === 1" );
	ok( lex.pos[2] === 0, "After second increment, updates highest-indexed position, pos[2] === 0" );
	ok( lex.index() === 2, "Index after second increment is 2" );
	for ( var i=0; i < 10; ++i ) {
	    ok( ! lex.at_end, "Lex still not 'at_end'" + i );
	    ok( lex.index() === 2 + i, "Lex index" );
	    ok( incremented, "Lex should have incremented properly" );
	    incremented = lex.increment();
	}
	ok( ! incremented, "Final increment should have returned false" );
	ok( lex.at_end, "Lex has arrived at the end" );

	lex.reset();
	ok( ! lex.at_end, "After resetting, Lex is no longer at_end" );
	ok( lex.pos[0] === 0, "After resetting lex.pos[0] == 0" );
	ok( lex.pos[1] === 0, "After resetting lex.pos[1] == 0" );
	ok( lex.pos[2] === 0, "After resetting lex.pos[2] == 0" );

	lex.set_from_index( 9 );
	ok( lex.pos[ 0 ] === 1, "Set from index 9, lex.pos[0] === 1" );
	ok( lex.pos[ 1 ] === 1, "Set from index 9, lex.pos[1] === 1" );
	ok( lex.pos[ 2 ] === 1, "Set from index 9, lex.pos[2] === 1" );

    });

test( "LexicographicalIterator uppder-diagonal tests", function() {
	var dims = [ 4, 4, 4 ];
	var lex = LexicographicalIterator( dims );
	lex.upper_diagonal_reset();
	ok( lex.pos[0] === 0, "Lex upper-diagonal pos[0] === 0 after reset" );
	ok( lex.pos[1] === 1, "Lex upper-diagonal pos[1] === 1 after reset" );
	ok( lex.pos[2] === 2, "Lex upper-diagonal pos[2] === 2 after reset" );
	var incremented = false;
	incremented = lex.upper_diagonal_increment();
	ok( incremented, "Lex should have incremented properly" );
	ok( ! lex.at_end, "Lex should not be at the end" );
	ok( lex.pos[0] === 0, "Lex upper-diagonal pos[0] === 0 after upper-diagonal increment" );
	ok( lex.pos[1] === 1, "Lex upper-diagonal pos[1] === 1 after upper-diagonal increment" );
	ok( lex.pos[2] === 3, "Lex upper-diagonal pos[2] === 3 after upper-diagonal increment" );
	incremented = lex.upper_diagonal_increment();
	ok( incremented, "Lex should have incremented properly" );
	ok( ! lex.at_end, "Lex should not be at the end" );
	ok( lex.pos[0] === 0, "Lex upper-diagonal pos[0] === 0 after second upper-diagonal increment" );
	ok( lex.pos[1] === 2, "Lex upper-diagonal pos[0] === 2 after second upper-diagonal increment" );
	ok( lex.pos[2] === 3, "Lex upper-diagonal pos[0] === 3 after second upper-diagonal increment" );
	incremented = lex.upper_diagonal_increment();
	ok( incremented, "Lex should have incremented properly" );
	ok( ! lex.at_end, "Lex should not be at the end" );
	ok( lex.pos[0] === 1, "Lex upper-diagonal pos[0] === 1 after third upper-diagonal increment" );
	ok( lex.pos[1] === 2, "Lex upper-diagonal pos[0] === 2 after third upper-diagonal increment" );
	ok( lex.pos[2] === 3, "Lex upper-diagonal pos[0] === 3 after third upper-diagonal increment" );
	incremented = lex.upper_diagonal_increment();
	ok( ! incremented, "Lex should not have incremented at this point" );
	ok( lex.at_end, "Lex should be at the end" );

	var dims2 = [ 2, 2, 2 ];
	var lex2 = LexicographicalIterator( dims2 );
	lex2.upper_diagonal_reset();
	ok( lex.at_end, "Lex2 can't be upper-diagonally initialized!" );

	var dims3 = [ 8 ];
	var lex3 = LexicographicalIterator( dims3 );
	lex3.upper_diagonal_reset();
	ok( ! lex3.at_end, "lex3 upper-diagonal reset works just fine" );
	var incremented = true;
	for ( var i = 0; i < 8; ++i ) {
	    ok( ! lex3.at_end, "lex3 shouldn't be at end" );
	    ok( incremented, "lex3 increment should have worked" );
	    incremented = lex3.upper_diagonal_increment();
	}
	ok( lex3.at_end, "lex3 should now be at the end" );
	ok( ! incremented, "Final increment should have failed" );

    });

test( "DegenerateCodon tests", function() {
	var dc = DegenerateCodon();
	var lex = LexicographicalIterator( [ 15, 15, 15 ] );
	// HKT codon; H = 1101, K=0011, T=0001
	// 8th bit = T
	// 4th bit = G
	// 2nd bit = C
	// 1st bit = A
	var index = 15*15*( 8*1 + 4*0 + 2*1 + 1*1 - 1 ) + 15*( 8*1+4*1 - 1 ) + (8-1);
	console.log( "HKT index = " + index.toString() );
	lex.set_from_index( index );

	dc.reset();
	ok( dc.diversity() === dc.infinity, "Reset degenerate codon gives infinite diversity" );
	ok( dc.log_diversity() === dc.infinity, "Reset degenerate codon gives infinite log-diversity" );

	dc.set_from_lex( lex );
	ok( dc.codon_string() === "HKT", "Degenerate codon HKT for index 2422" );
	ok( dc.diversity() === 6, "DegenerateCodon diversity of 6" );
	console.log( "Log diversity: " + dc.log_diversity().toString() + " vs " + Math.log(6).toString() );
	ok( Math.abs( dc.log_diversity() - Math.log(6) ) < 1e-6, "Log-diversity of 6" );
	ok( dc.pos[0][0] === true,  "HKT dc.pos[0][A] = true" );
	ok( dc.pos[0][1] === true,  "HKT dc.pos[0][C] = false" );
	ok( dc.pos[0][2] === false, "HKT dc.pos[0][G] = true" );
	ok( dc.pos[0][3] === true,  "HKT dc.pos[0][T] = true" );

	ok( dc.pos[1][0] === false, "HKT dc.pos[1][A] = false" );
	ok( dc.pos[1][1] === false, "HKT dc.pos[1][C] = false" );
	ok( dc.pos[1][2] === true,  "HKT dc.pos[1][G] = true" );
	ok( dc.pos[1][3] === true,  "HKT dc.pos[1][T] = true" );

	ok( dc.pos[2][0] === false, "HKT dc.pos[2][A] = false" );
	ok( dc.pos[2][1] === false, "HKT dc.pos[2][C] = false" );
	ok( dc.pos[2][2] === false, "HKT dc.pos[2][G] = false" );
	ok( dc.pos[2][3] === true,  "HKT dc.pos[2][T] = true" );

	ok( dc.count_pos[0] === 3, "HTK count_pos[0] === 3" );
	ok( dc.count_pos[1] === 2, "HTK count_pos[1] === 2" );
	ok( dc.count_pos[2] === 1, "HTK count_pos[2] === 1" );

	var codon_lex = LexicographicalIterator( dc.count_pos );
	codon_lex.reset();
	var codon_index = dc.index_from_lex( codon_lex );
	console.log( "codon index: " + codon_index.toString() );
	ok( codon_index === 63, "Degenerate codon giving codon indices; TGT = 4*4*3 + 4*2 + 3 for first lex position" );

    });


test( "AALibrary optimize library (multiple-degenerate codons)", function() {

	var csv_contents =
	    "aa/pos ,268,269,270,271\n" +
	    "primer,|,-,-,-\n" +
	    "max dcs,2,2,2,2\n" +
	    "A,3,8,1,81\n" +
	    "C,0,0,0,0\n" +
	    "D,8,5,0,0\n" +
	    "E,23,7,0,0\n" +
	    "F,0,0,0,0\n" +
	    "G,0,0,0,1\n" +
	    "H,1,0,0,0\n" +
	    "I,10,2,98,0\n" +
	    "K,22,0,0,0\n" +
	    "L,17,8,5,0\n" +
	    "M,13,9,5,0\n" +
	    "N,6,4,0,0\n" +
	    "P,0,0,0,0\n" +
	    "Q,42,2,0,0\n" +
	    "R,35,4,0,0\n" +
	    "S,7,44,8,113\n" +
	    "T,6,58,23,4\n" +
	    "V,7,49,60,1\n" +
	    "W,0,0,0,0\n" +
	    "Y,0,0,0,0\n";
	    "STOP,0,0,0,0\n";

	var library = AALibrary();
	console.log( "  library.load_library( csv_contents );" )
	library.load_library( csv_contents );
	ok( library.n_positions === 4, "library.n_positions === 4" );
	ok( library.aa_counts[ 1 ][ 14 ] === 4, "Arginine at position 2 aa_counts === 4" );
	ok( library.required[ 1 ][ 14 ]  === false, "Arginine at position 2 required === false" );
	ok( library.forbidden[ 1 ][ 14 ] === false, "Arginine at position 2 forbidden === false" );
	ok( library.orig_pos[ 1 ] === "269", "Original residue id for position 2 === 330" );
	ok( library.stretch_reps[ 1 ] === 0, "Primer representative for position 2 === position 1" );
	ok( library.max_dcs_for_pos[ 1 ] === 2, "Maximum number of degenerate codons for position 7 === 2" );

	console.log( "  library.enumerate_aas_for_all_degenerate_codons();" );
	library.enumerate_aas_for_all_degenerate_codons();
	ok( library.hasOwnProperty( "aas_for_dc" ), "AALibrary should have aas_for_dc after enumerate_aas_for_all_degenerate_codons" );
	// 2422 is the HKT codon
	// H = ACT, K=TG; ATT:I, CTT:L, TTT:F, AGT:S, RGT:R, TGT:C

	var gcm = GeneticCodeMapper();
	var correct_answer = newFilledArray( 21, false );
	var aas_for_2422 = "CFILRS";
	for ( var i = 0; i < aas_for_2422.length; ++i ) {
	    correct_answer[ gcm.aamap[ aas_for_2422[i] ] ] = true;
	}
	for ( var i = 0; i < 21; ++i ) {
	    ok( library.aas_for_dc[ 2422 ][ i ] === correct_answer[ i ],
		"Ensuring codon 2422 (HKT) has the correct answer; " + gcm.aastr_for_integer(i) + " " + correct_answer[i] );
	}

	console.log( "  library.find_useful_codons();" );
	library.find_useful_codons();

	ok( library.useful_codons[ 0 ].length === 401, "Verifying the gold-standard number of useful codons" );
	ok( library.useful_codons[ 1 ].length === 330, "Verifying the gold-standard number of useful codons" );
	ok( library.useful_codons[ 2 ].length === 58 , "Verifying the gold-standard number of useful codons" );
	ok( library.useful_codons[ 3 ].length === 25 , "Verifying the gold-standard number of useful codons" );

	console.log( "  library.compute_smallest_diversity_for_all_errors();" );
	library.compute_smallest_diversity_for_all_errors();

	console.log( "  library.optimize_library();" );
	library.optimize_library();
	console.log( "  library.traceback( 3.2e4 );" );
	var error_traceback = library.traceback( 3.2e4 );
	console.log( "  report_output_library_data( library, error_traceback );" );
	var old = report_output_library_data( library, error_traceback );
	console.log( "First four residues of Tim's problem, traceback dna diversity MDC " + old.dna_diversity.toString() );
	ok( Math.abs( 31104 - old.dna_diversity ) < 1, "Ensure correct diversity of optimal solution is given" );

	var smallest_div = library.find_smallest_diversity();
	console.log( "   smallest diversity: " + smallest_div.toString() );
	ok( Math.abs( smallest_div - 0 ) < 1, "Smallest diversity should be 0" );

	var errors_and_ndcs_in_range = library.errors_and_ndcs_in_diversity_range( 4e4, 1e4 );
	for ( var i = 0; i < errors_and_ndcs_in_range.length; ++i ) {
	    console.log( "errors_and_ndcs_in_range " + i.toString() + " " + errors_and_ndcs_in_range[i][0].toString() + ", " +
			 errors_and_ndcs_in_range[i][1].toString() );
	}
	ok( errors_and_ndcs_in_range.length === 19 );

	ok( errors_and_ndcs_in_range[0][0] === 1, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[1][0] === 0, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[2][0] === 1, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[3][0] === 0, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[4][0] === 1, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[5][0] === 0, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[6][0] === 1, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[7][0] === 0, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[8][0] === 1, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[9][0] === 0, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[10][0] === 1, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[11][0] === 0, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[12][0] === 1, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[13][0] === 0, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[14][0] === 0, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[15][0] === 0, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[16][0] === 0, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[17][0] === 0, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[18][0] === 0, "gold standard errors/ndcs" );

	ok( errors_and_ndcs_in_range[0][1] === 0, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[1][1] === 1, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[2][1] === 1, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[3][1] === 2, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[4][1] === 2, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[5][1] === 3, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[6][1] === 3, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[7][1] === 4, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[8][1] === 4, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[9][1] === 5, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[10][1] === 5, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[11][1] === 6, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[12][1] === 6, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[13][1] === 7, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[14][1] === 8, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[15][1] === 9, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[16][1] === 10, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[17][1] === 12, "gold standard errors/ndcs" );
	ok( errors_and_ndcs_in_range[18][1] === 14, "gold standard errors/ndcs" );

    });

test( "AALibrary optimize library (classic)", function() {

	var csv_contents =
	    "aa/pos ,268,269,270,271\n" +
	    "primer,|,-,-,-\n" +
	    "max dcs,1,1,1,1\n" +
	    "A,3,8,1,81\n" +
	    "C,0,0,0,0\n" +
	    "D,8,5,0,0\n" +
	    "E,23,7,0,0\n" +
	    "F,0,0,0,0\n" +
	    "G,0,0,0,1\n" +
	    "H,1,0,0,0\n" +
	    "I,10,2,98,0\n" +
	    "K,22,0,0,0\n" +
	    "L,17,8,5,0\n" +
	    "M,13,9,5,0\n" +
	    "N,6,4,0,0\n" +
	    "P,0,0,0,0\n" +
	    "Q,42,2,0,0\n" +
	    "R,35,4,0,0\n" +
	    "S,7,44,8,113\n" +
	    "T,6,58,23,4\n" +
	    "V,7,49,60,1\n" +
	    "W,0,0,0,0\n" +
	    "Y,0,0,0,0\n";
	    "STOP,0,0,0,0\n";

	var library = AALibrary();
	console.log( "  library.load_library( csv_contents );" )
	library.load_library( csv_contents );
	ok( library.n_positions === 4, "library.n_positions === 4" );
	ok( library.aa_counts[ 1 ][ 14 ] === 4, "Arginine at position 2 aa_counts === 4" );
	ok( library.required[ 1 ][ 14 ]  === false, "Arginine at position 2 required === false" );
	ok( library.forbidden[ 1 ][ 14 ] === false, "Arginine at position 2 forbidden === false" );
	ok( library.orig_pos[ 1 ] === "269", "Original residue id for position 2 === 330" );
	ok( library.stretch_reps[ 1 ] === 0, "Primer representative for position 2 === position 1" );

	console.log( "  library.enumerate_aas_for_all_degenerate_codons();" );
	library.enumerate_aas_for_all_degenerate_codons();

	ok( library.hasOwnProperty( "aas_for_dc" ), "AALibrary should have aas_for_dc after enumerate_aas_for_all_degenerate_codons" );
	console.log( "  library.find_useful_codons();" );
	library.find_useful_codons();

	console.log( "  library.compute_smallest_diversity_for_all_errors();" );
	library.compute_smallest_diversity_for_all_errors();

	console.log( "  library.optimize_library();" );
	library.optimize_library();
	console.log( "  library.traceback( 3.2e4 );" );
	var error_traceback = library.traceback( 3.2e4 );
	console.log( "  report_output_library_data( library, error_traceback );" );
	var old = report_output_library_data( library, error_traceback );
	console.log( "First four residues of Tim's problem, traceback dna diversity, one degenerate codon per position, " + old.dna_diversity.toString() );
	ok( Math.abs( 27648 - old.dna_diversity ) < 1, "Ensure correct diversity of optimal solution is given" );
    });

test("AALibrary error handling", function() {
	var one_residue_csv = "aa/pos,332\n" +
	    "primer ,|\n" +
	    "max dcs ,1\n" +
	    "A,1\n" +
	    "C,*\n" +
	    "D,9\n" +
	    "E,17\n" +
	    "F,0\n" +
	    "G,5\n" +
	    "H,9\n" +
	    "I,1\n" +
	    "K,9\n" +
	    "L,0\n" +
	    "M,4\n" +
	    "N,15\n" +
	    "P,0\n" +
	    "Q,18\n" +
	    "R,21\n" +
	    "S,29\n" +
	    "T,57\n" +
	    "V,5\n" +
	    "W,*\n" +
	    "Y,*\n" +
	    "STOP,!\n";

	var library = AALibrary();
	library.load_library( one_residue_csv );
	ok( library.n_positions === 1, "library.n_positions === 1" );
	ok( library.forbidden[0][20] === true,  "STOP codon forbidden at position 1" );
	ok( library.required[0][20]  === false, "STOP codon not required at position 1" );
	ok( library.forbidden[0][1]  === false, "CYS codon not forbidden at position 1" );
	ok( library.required[0][1]   === true,  "CYS codon required at position 1" );
	ok( library.forbidden[0][18] === false, "TRP codon not forbidden at position 1" );
	ok( library.required[0][18]  === true,  "TRP codon required at position 1" );
	ok( library.forbidden[0][19] === false, "TYR codon not forbidden at position 1" );
	ok( library.required[0][19]  === true,  "TYR codon required at position 1" );
	library.enumerate_aas_for_all_degenerate_codons();
	library.find_useful_codons();
	library.compute_smallest_diversity_for_all_errors();

	var no_solutions = library.find_positions_wo_viable_solutions();
	console.log( "no solutions: " + no_solutions.toString() );
	ok( no_solutions[0] === true, "There is no way to require cys, trp, and tyr while forbidding the stop codon" );

	var one_residue_no_problems_csv = "aa/pos,332\n" +
	    "primer ,|\n" +
	    "max dcs ,1\n" +
	    "A,1\n" +
	    "C,*\n" +
	    "D,9\n" +
	    "E,17\n" +
	    "F,0\n" +
	    "G,5\n" +
	    "H,9\n" +
	    "I,1\n" +
	    "K,9\n" +
	    "L,0\n" +
	    "M,4\n" +
	    "N,15\n" +
	    "P,0\n" +
	    "Q,18\n" +
	    "R,21\n" +
	    "S,29\n" +
	    "T,57\n" +
	    "V,5\n" +
	    "W,*\n" +
	    "Y,*\n" +
	    "STOP,0\n";

	var library = AALibrary();
	library.load_library( one_residue_no_problems_csv );
	ok( library.n_positions === 1, "library.n_positions === 1" );
	ok( library.forbidden[0][20] === false,  "STOP codon not forbidden at position 1" );
	ok( library.required[0][20]  === false, "STOP codon not required at position 1" );
	ok( library.forbidden[0][1]  === false, "CYS codon not forbidden at position 1" );
	ok( library.required[0][1]   === true,  "CYS codon required at position 1" );
	ok( library.forbidden[0][18] === false, "TRP codon not forbidden at position 1" );
	ok( library.required[0][18]  === true,  "TRP codon required at position 1" );
	ok( library.forbidden[0][19] === false, "TYR codon not forbidden at position 1" );
	ok( library.required[0][19]  === true,  "TYR codon required at position 1" );
	library.enumerate_aas_for_all_degenerate_codons();
	library.find_useful_codons();
	library.compute_smallest_diversity_for_all_errors();

	var no_solutions = library.find_positions_wo_viable_solutions();
	console.log( "no solutions: " + no_solutions.toString() );
	ok( no_solutions[0] === false, "Allowing the stop codon solves the C/W/Y requirement issue" );

	var two_residue_csv = "aa/pos,332,334\n" +
	    "primer,|,-\n" +
	    "max dcs,2,2\n" +
	    "A,1,1\n" +
	    "C,*,*\n" +
	    "D,9,9\n" +
	    "E,1,17\n" +
	    "F,0,0\n" +
	    "G,5,5\n" +
	    "H,9,9\n" +
	    "I,1,1\n" +
	    "K,9,9\n" +
	    "L,0,0\n" +
	    "M,4,4\n" +
	    "N,1,15\n" +
	    "P,0,0\n" +
	    "Q,1,18\n" +
	    "R,2,21\n" +
	    "S,2,29\n" +
	    "T,5,57\n" +
	    "V,5,5\n" +
	    "W,*,*\n" +
	    "Y,*,*\n" +
	    "STOP,!,!\n";

	var library = AALibrary();
	library.load_library( two_residue_csv );

	ok( library.n_positions === 2, "library.n_positions === 2" );
	ok( library.forbidden[0][20] === true,  "STOP codon forbidden at position 1" );
	ok( library.required[0][20]  === false, "STOP codon not required at position 1" );
	ok( library.forbidden[0][1]  === false, "CYS codon not forbidden at position 1" );
	ok( library.required[0][1]   === true,  "CYS codon required at position 1" );
	ok( library.forbidden[0][18] === false, "TRP codon not forbidden at position 1" );
	ok( library.required[0][18]  === true,  "TRP codon required at position 1" );
	ok( library.forbidden[0][19] === false, "TYR codon not forbidden at position 1" );
	ok( library.required[0][19]  === true,  "TYR codon required at position 1" );

	ok( library.forbidden[1][20] === true,  "STOP codon forbidden at position 2" );
	ok( library.required[1][20]  === false, "STOP codon not required at position 2" );
	ok( library.forbidden[1][1]  === false, "CYS codon not forbidden at position 2" );
	ok( library.required[1][1]   === true,  "CYS codon required at position 2" );
	ok( library.forbidden[1][18] === false, "TRP codon not forbidden at position 2" );
	ok( library.required[1][18]  === true,  "TRP codon required at position 2" );
	ok( library.forbidden[1][19] === false, "TYR codon not forbidden at position 2" );
	ok( library.required[1][19]  === true,  "TYR codon required at position 2" );

	library.enumerate_aas_for_all_degenerate_codons();
	library.find_useful_codons();
	library.compute_smallest_diversity_for_all_errors();

	var no_solutions = library.find_positions_wo_viable_solutions();
	console.log( "no solutions: " + no_solutions.toString() );
	ok( no_solutions[0] === true, "Even allowing two degenerate codons, there are two positions that are part of the same primer that require two degenerate codons, so position 1 and position two have problems" );
	ok( no_solutions[1] === true, "Even allowing two degenerate codons, there are two positions that are part of the same primer that require two degenerate codons, so position 1 and position two have problems" );


    });