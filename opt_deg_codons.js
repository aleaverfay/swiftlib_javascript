/// Copyright 2013, Andrew Leaver-Fay

function strip_whitespace( str ) {
    return str.replace(/^\s+|\s+$/g,'');
}

function newFilledArray( len, val ) {
    var newarray = [];
    for ( var i=0; i < len; ++i ) {
        newarray[i] = val;
    }
    return newarray;
}
        
function binBoolString( val ) {
    if ( val ) { return "1"; }
    return "0";
}


// A = 0, C = 1, G = 2, T = 3
// codon = TCG --> 3*16 + 1*4 + 2 = 54
function GeneticCodeMapper() {
    var gcm = {};

    function init( gcm ) {
        gcm.base_to_index = { "A" : 0, "C" : 1, "G" : 2, "T" : 3 };
        gcm.aastring = "ACDEFGHIKLMNPQRSTVWY";
        gcm.aamap = {} // map from the 1 letter code or the "STOP" string to an index
        for ( var i=0; i < gcm.aastring.length; ++i ) {
            gcm.aamap[ gcm.aastring.charAt(i) ] = i;
        }
        gcm.aamap[ "STOP" ] = 20;
        gcm.codons = {
            "TTT" : "F",
            "TTC" : "F",
            "TTA" : "L",
            "TTG" : "L",
            "CTT" : "L",
            "CTC" : "L",
            "CTA" : "L",
            "CTG" : "L",
            "ATT" : "I",
            "ATC" : "I",
            "ATA" : "I",
            "ATG" : "M",
            "GTT" : "V",
            "GTC" : "V",
            "GTA" : "V",
            "GTG" : "V",
            "TCT" : "S",
            "TCC" : "S",
            "TCA" : "S",
            "TCG" : "S",
            "CCT" : "P",
            "CCC" : "P",
            "CCA" : "P",
            "CCG" : "P",
            "ACT" : "T",
            "ACC" : "T",
            "ACA" : "T",
            "ACG" : "T",
            "GCT" : "A",
            "GCC" : "A",
            "GCA" : "A",
            "GCG" : "A",
            "TAT" : "Y",
            "TAC" : "Y",
            "TAA" : "STOP",
            "TAG" : "STOP",
            "CAT" : "H",
            "CAC" : "H",
            "CAA" : "Q",
            "CAG" : "Q",
            "AAT" : "N",
            "AAC" : "N",
            "AAA" : "K",
            "AAG" : "K",
            "GAT" : "D",
            "GAC" : "D",
            "GAA" : "E",
            "GAG" : "E",
            "TGT" : "C",
            "TGC" : "C",
            "TGA" : "STOP",
            "TGG" : "W",
            "CGT" : "R",
            "CGC" : "R",
            "CGA" : "R",
            "CGG" : "R",
            "AGT" : "S",
            "AGC" : "S",
            "AGA" : "R",
            "AGG" : "R",
            "GGT" : "G",
            "GGC" : "G",
            "GGA" : "G",
            "GGG" : "G" };

        gcm.mapper = [];
        for ( var codon in gcm.codons ) {
            if ( gcm.codons.hasOwnProperty(codon) ) {
                var aastr = gcm.codons[ codon ];
                var ci = gcm.codon_index( codon );
                var aaind =  gcm.aamap[ aastr ];
                gcm.mapper[ ci ] = aaind;
            }
        }
    }

    gcm.codon_index = function( codon ) {
        var index = 0;
        for ( var i=0; i < 3; ++i ) {
            index = index*4 + this.base_to_index[ codon[i] ];
        }
        return index;
    };

    gcm.aastr_for_integer = function ( aaindex ) {
        if ( aaindex >= 0 && aaindex < 20 ) {
            return this.aastring.charAt( aaindex );
        } else {
            if ( aaindex != 20 ) {
                alert( "Error in aastr_for_integer: given integer index of " + aaindex + " which is out of range!" );
            }
            return "STOP";
        }
    };


    init( gcm );
    return gcm;
}

function LexicographicalIterator( dims ) {
    var lex = {}
    function initialize ( lex ) {
        lex.size = dims.length;
        lex.dimsizes = dims.slice(0);
        lex.dimprods = [];
        lex.dimprods[lex.size-1] = 1;
        for ( var i = lex.size - 1; i >= 0; --i ) {
            lex.dimprods[i-1] = lex.dimprods[i]*lex.dimsizes[i];
        }
        lex.search_space_size = lex.dimprods[0]*lex.dimsizes[0];
        lex.pos = [];
        //alert( lex.size );
        for ( var i = 0; i < lex.size; ++i ) { lex.pos[i] = 0 }
        lex.at_end = false;
    };

    initialize( lex );

    lex.increment = function () {
        var i = this.size;
        while ( i > 0 ) {
            i = i-1;
            this.pos[ i ] = this.pos[ i ] + 1;
            if ( this.pos[ i ] === this.dimsizes[ i ] ) {
                this.pos[ i ] = 0;
            } else {
                return true;
            }
        }
        this.at_end = true
        return false
    };

    lex.reset = function() {
        for ( var i=0; i < this.size; ++i ) {
            this.pos[ i ] = 0;
        }
        this.at_end = false;
    };

    lex.index = function() {
        // return the integer index representing the state of the lex
        var ind = 0;
        for ( var i=0; i < this.size; ++i ) {
            ind += this.pos[ i ] * this.dimprods[ i ];
        }
        return ind;
    };

    lex.set_from_index = function ( ind ) {
        // set the state of the lex given a previously computed index
        for ( var i=0; i < this.size; ++i ) {
            this.pos[ i ] = Math.floor( ind / this.dimprods[i] );
            ind = ind % this.dimprods[ i ];
        }
        this.at_end = false;
    };

    return lex;
}

function DegenerateCodon()  {
    var dc = {};

    function init( dc ) {
        dc.infinity = -1; // for log diversity
        dc.pos = [ [ false, false, false, false ], [ false, false, false, false ], [ false, false, false, false ]  ] ;
        dc.which = [ [], [], [] ];
        dc.count_pos = [ 0, 0, 0 ];
        dc.degenerate_base_names = {
            "1000" : "A",
            "0100" : "C",
            "0010" : "G",
            "0001" : "T",
            "1001" : "W",
            "0110" : "S",
            "1100" : "M",
            "0011" : "K",
            "1010" : "P",
            "0101" : "Y",
            "0111" : "B",
            "1011" : "D",
            "1101" : "H",
            "1110" : "V",
            "1111" : "N"
        };
    }
    init( dc );

    dc.set_pos = function ( codon_pos, base ) {
        if ( ! this.pos[ codon_pos ][ base ] ) {
            this.which[ codon_pos ].push( base );
            this.pos[ codon_pos ][ base ] = true;
            this.count_pos[ codon_pos ] += 1;
            //console.log( "set_pos: " + codon_pos + " " + base + " which: " + this.which.join(",") + " pos " + this.pos.join(",") + " count_pos " + this.count_pos.join(",") );
        }
    };

    dc.reset = function() {
        for ( var i = 0; i < 3; ++i ) {
            this.which[i].length = 0;
            this.count_pos[i] = 0;
            for ( var j=0; j < 4; ++j ) {
                this.pos[i][j] = false;
            }
        }
    };

    dc.log_diversity = function () {
        for ( var i=0; i < 3; ++i ) {
            if ( this.count_pos[i] === 0 ) {
                return this.infinity;
            }
        }
        var ld = 0.0;
        for ( var i=0; i < 3; ++i ) {
            ld += Math.log( this.count_pos[i] );
            //console.log( i + " ld: " + ld );
        }
        return ld;
    };

    dc.index_from_lex = function( lex ) {
        // Get the index for a particular codon using a lexicographical iterator
        // that's dimensioned from this.count_pos
        var codon_index = 0;
        for ( var i=0; i < 3; ++i ) {
            codon_index = codon_index * 4 + this.which[i][lex.pos[i]];
        }
        return codon_index;
    };

    dc.set_from_lex = function ( lex ) {
        // Set the state for this degenerate codon using a lex that's iterating over all 2**4**3 = 4096 codon options.
        // Returns false if this is not a reasonable assignment; i.e. not all codon positions contain at least one base.
        for ( var i=0; i < 3; ++i ) {
            if ( lex.pos[i] === 0 ) {
                return false;
            }
        }

        this.reset();
        for ( var i=0; i < 3; ++i ) {
            var posi = lex.pos[i];
            var sigdig = 8;
            for ( var j=0; j < 4; ++j ) {
                if ( Math.floor( posi / sigdig ) != 0 ) {
                    this.set_pos( i, 3-j ); // so A = 0 and T = 3
                }
                posi = posi % sigdig;
                sigdig = Math.floor( sigdig / 2 );
            }
            //console.log( "set from lex: " + this.pos.join(",") + " and count_pos: " + this.count_pos.join(",") )
        }
        return true;
    }
    return dc;
}


function AALibrary() {
    var library = {};
    
    function init( library ) {
        library.infinity = -1.0;
        library.gcmapper = GeneticCodeMapper();
    }
    init( library );

    // in python, it's efficient to return an array of booleans; it's probably less
    // efficient to do so in javascript
    library.aas_for_degenerate_codon = function( degenerate_codon ) {
        aas = newFilledArray( 21, false );
        lex = LexicographicalIterator( degenerate_codon.count_pos )
        while ( ! lex.at_end ) {
            codon_index = degenerate_codon.index_from_lex( lex );
            aas[ this.gcmapper.mapper[ codon_index ] ] = true;
            lex.increment();
        }
        return aas;
    };

    //format should be a table with N columns and 21 rows
    // row 1 is a header, which just gives the sequence positions
    // column 1 gives the amino acid names
    // row1/column1 gives nothing
    // all other row/column combinations should be integers
    library.load_library = function( csv_contents ) {        
        var lines = csv_contents.split("\n");
        row1 = lines[0].split(",");
        this.n_positions = row1.length-1;
        this.aa_counts = [];
        this.required = [];
        this.forbidden = [];
        for ( var i=0; i < this.n_positions; ++i ) {
            this.aa_counts[ i ] = newFilledArray( 21, 0 );
            this.required[ i ]  = newFilledArray( 21, false );
            this.forbidden[ i ] = newFilledArray( 21, false );
        }
        this.orig_pos = [];
        for ( var i=1; i < row1.length; ++i ) {
            this.orig_pos[i-1] = strip_whitespace( row1[i] )
        }

        this.max_per_position_error = 0;
        var obs_count = newFilledArray( this.n_positions, 0 );
        for ( var i=0; i < 21; ++i ) {
            var line = lines[ i + 1 ];
            var vals = line.split(",").slice(1);
            var iiobs = 0;
            for ( var j=0; j < vals.length; ++j ) {
                var ijval = vals[j];
                if ( ijval === "*" ) {
                    //required!
                    this.required[j][i] = true;
                } else if ( ijval === "!" ) {
                    // forbidden
                    this.forbidden[j][i] = true;
                } else {
                    var ij_int = parseInt(ijval);
                    this.aa_counts[j][i] = ij_int;
                    obs_count[j] += Math.abs( ij_int );
                }
            }
            console.log( vals.join(", ") );
        }
        for ( var i=0; i < this.n_positions; ++i ) { 
            if ( obs_count[i] > this.max_per_position_error ) {
                this.max_per_position_error = obs_count[i];
            }
        }

    };

    // Returns the error for a given set of amino acids.
    // Returns this.infinity if one of the required amino
    // acids is missing or if a forbidden amino acid is present
    library.error_given_aas_for_pos = function( pos, aas ) {
        var error = 0;
        for ( var i=0; i < 21; ++i ) {
            var icount = this.aa_counts[ pos ][ i ];
            if ( ! aas[ i ] ) {
                if ( this.required[ pos ][ i ] ) {
                    return this.infinity;
                }
                if ( icount > 0 ) {
                    error += icount;
                }
            } else {
                if ( this.forbidden[ pos ][ i ] ) {
                    return this.infinity;
                }
                if ( icount < 0 ) {
                    error -= icount;
                }
            }
        }
        return error;
    };

    library.compute_smallest_diversity_for_all_errors = function () {
        this.divmin_for_error = [];
        for ( var i=0; i < this.n_positions; ++i ) {
            this.divmin_for_error[i] = []
            for ( var j=0; j <= this.max_per_position_error; ++j ) {
                this.divmin_for_error[i][j] = [ this.infinity, 0 ];
            }
        }
        var dims = [ 16, 16, 16 ]; //this really could be 15^3 instead, since 0 doesn't represent a valid degenerate base index
        this.dclex = LexicographicalIterator( dims );
        var dc = DegenerateCodon();
        for ( var i=0; i < this.n_positions; ++i ) {
            this.dclex.reset();
            while ( ! this.dclex.at_end ) {
                if ( dc.set_from_lex( this.dclex ) ) {
                    var aas = this.aas_for_degenerate_codon( dc );
                    var error = this.error_given_aas_for_pos( i, aas );
                    if ( error !== this.infinity ) {
                        var log_diversity = dc.log_diversity();
                        var prev_diversity = this.divmin_for_error[ i ][ error ][0];
                        //console.log( "position " + i + " error " + error + " diversity: " + log_diversity );
                        if ( log_diversity !== dc.infinity && ( prev_diversity === this.infinity || log_diversity < prev_diversity )) {
                            // store the diversity and information on the degenerate codon that
                            // produced this level of error
                            this.divmin_for_error[i][ error ][ 0 ] = log_diversity;
                            this.divmin_for_error[i][ error ][ 1 ] = this.dclex.index();
                        }
                    }
                }
                this.dclex.increment();
            }
        }
    }

    library.find_positions_wo_viable_solutions = function() {
        var pos_w_no_viable_solutions = []
        for ( var i=0; i < this.n_positions; ++i ) {
            var ok = false;
            for ( var j=0; j < this.max_per_position_error; ++j ) {
                if ( this.divmin_for_error[i][j][0] !== this.infinity ) {
                    ok = true;
                    break;
                }
            }
            if ( ! ok ) {
                pos_w_no_viable_solutions.push( i );
            }
        }
        return pos_w_no_viable_solutions;   
    }

                
    library.optimize_library = function() {
        //Run a dynamic programming algorithm to determine the minimum diversity for
        //every error level, and return an array of error levels for each position
        //that describes the library that fits under the diversity cap with the smallest
        //error.  This array can be used with the previously-computed divmin_for_error
        //array to figure out which codons should be used at every position.

        this.error_span = this.max_per_position_error * this.n_positions; // edit this to include a stop-codon penalty

        //assert( hasattr( self, 'divmin_for_error' ) )
        this.dp_divmin_for_error = []
        // dp_traceback is an array of tuples:
        //  pos0 = which error level ( from this.divmin_for_error ) for this position
        //  pos1 = which error total ( from this.dp_divmin_for_error ) for the previous position
        this.dp_traceback = []
        for ( var i=0; i < this.n_positions; ++i ) {
            this.dp_divmin_for_error[i] = [];
            this.dp_traceback[i] = [];
            for ( var j=0; j <= this.error_span; ++j ) {
                this.dp_divmin_for_error[i][j] = this.infinity;
                this.dp_traceback[i][j] = [ this.infinity, this.infinity  ];
            }
        }

        // take care of position 0: copy this.divmin_for_error[0] into this.dp_divmin_for_eror
        for ( var i=0; i<= this.max_per_position_error; ++i ) {
            this.dp_divmin_for_error[0][i] = this.divmin_for_error[0][i][0];
            this.dp_traceback[0][i][0] = i;
            this.dp_traceback[0][i][1] = 0;
        }

        for ( var i=1; i < this.n_positions; ++i ) {
            // solve the dynamic programming problem for residues 0..i
            for ( var j=0; j <= this.error_span; ++j ) {
                var j_divmin = this.infinity;
                var j_traceback = [ this.infinity, this.infinity ];
                var klimit = Math.min( j, this.max_per_position_error );
                for ( var k=0; k <= klimit; ++k ) {
                    if ( this.dp_divmin_for_error[i-1][j-k] === this.infinity ) { continue; }
                    if ( this.divmin_for_error[i][k][0] === this.infinity ) { continue; }
                    var divsum = this.divmin_for_error[i][k][0] + this.dp_divmin_for_error[i-1][j-k];
                    if ( j_divmin === this.infinity || divsum < j_divmin ) {
                        j_divmin = divsum;
                        j_traceback[0] = k;
                        j_traceback[1] = j-k;
                    }
                }
                if ( j_divmin !== this.infinity ) {
                    this.dp_divmin_for_error[i][j] = j_divmin;
                    this.dp_traceback[i][j] = j_traceback;
                }
            }
        }
    }

    library.errors_in_diversity_range = function ( diversity_upper_bound, diversity_lower_bound ) {
        var errors_in_range = [];
        var log_ub = Math.log( diversity_upper_bound );
        var log_lb = Math.log( diversity_lower_bound );
        var last_row = this.dp_divmin_for_error[ this.n_positions - 1 ];
        for ( var i=0; i < this.error_span; ++i ) {
            if ( last_row[ i ] < log_ub && last_row[ i ] > log_lb ) {
                errors_in_range.push( i );
            }
        }
        return errors_in_range;
    }

    library.find_minimal_error_beneath_diversity_cap = function( diversity_cap ) {
        var log_diversity_cap =  Math.log( diversity_cap );

        //for i in xrange( this.error_span ) :
        //    if this.dp_divmin_for_error[-1][i] != this.infinity :
        //        print "Error of",i,"requires diversity of %5.3f" % this.dp_divmin_for_error[-1][i]

        for ( var i=0; i <= this.error_span; ++i ) {
            if ( this.dp_divmin_for_error[ this.n_positions-1 ][i] != this.infinity && this.dp_divmin_for_error[ this.n_positions-1 ][i] < log_diversity_cap ) {
                return i;
            }
        }
    };

    library.traceback = function( diversity_cap ) {
        // now the traceback
        var least_error = this.find_minimal_error_beneath_diversity_cap( diversity_cap );
        return this.traceback_from_error_level( least_error );
    };

    library.traceback_from_error_level = function( error_level ) {
        var error_traceback = [];
        for ( var i=0; i < this.n_positions; ++i ) { error_traceback[i] = 0; }

        var position_error = []
        for ( var i=0; i < this.n_positions; ++i ) { position_error[i] = 0; }
        for ( var i=this.n_positions-1; i >= 0; --i ) {
            var tb = this.dp_traceback[ i ][ error_level ];
            error_traceback[ i ] = tb[0];
            error_level = tb[1];
            position_error[i] = tb[0];
        }
        //for i in xrange( this.n_positions ) {
        //    print "Traceback position", i, "minimum error=", position_error[i]

        return error_traceback;
    };
    return library;
}

function record_codon_data( position, degenerate_codon, library ) {
    // three things we need:
    // 1: the codon
    // 2: the amino acids that are represented
    // 2b: the counts from the original set of observations for each of the represented aas
    // 3: the amino acids and their counts in the original set of observations that are not represented
    codon_data = {}

    var aas_present  = library.aas_for_degenerate_codon( degenerate_codon );
    var orig_obs = library.aa_counts[ position ];

    codon_data.orig_pos_string = library.orig_pos[ position ];

    codon_data.codon_string = "";
    for ( var i=0; i < 3; ++i ) {
        var idcpos = degenerate_codon.pos[i];
        var base_tuple = []
        for ( var j=0; j < 4; ++j ) {
            base_tuple[j] = binBoolString( idcpos[j] );
        }
        codon_data.codon_string += degenerate_codon.degenerate_base_names[ base_tuple.join("") ];
    }

    codon_data.present_string = "";
    codon_data.error = 0;
    var aa_count = 0;
    for ( var i=0; i < aas_present.length; ++i ) {
        if ( aas_present[i] ) {
            ++aa_count;
            codon_data.present_string += " " + library.gcmapper.aastr_for_integer( i );
            if ( library.required[position][i] ) {
                codon_data.present_string += "(*)";
            } else {
                codon_data.present_string += "(" + orig_obs[i] + ")";
            }
            if ( orig_obs[i] < 0 ) {
                codon_data.error -= orig_obs[i];
            }
        }
    }

    codon_data.absent_string = "";
    for ( var i=0; i < aas_present.length; ++i ) {
        if ( orig_obs[i] !== 0 && ! aas_present[i] ) {
            codon_data.absent_string += " " + library.gcmapper.aastr_for_integer( i ) + "(" + orig_obs[i] + ")";
            codon_data.error += orig_obs[i];
        }
    }

    codon_data.log_dna_diversity = degenerate_codon.log_diversity();
    codon_data.aa_count = aa_count;
    codon_data.log_aa_diversity = Math.log( aa_count );

    return codon_data;
}    

function report_output_library_data( library, error_sequence, diversity_cap ) {
    var dc = DegenerateCodon();
    var dna_diversity_sum = 0;
    var aa_diversity_sum = 0;
    var output_library_data = {};
    output_library_data.positions = [];
    output_library_data.error = 0;
    for ( var i=0; i < library.n_positions; ++i ) {
        var lexind = library.divmin_for_error[ i ][ error_sequence[ i ] ][ 1 ];
        library.dclex.set_from_index(lexind);
        dc.set_from_lex( library.dclex );
        var codon_data =  record_codon_data( i, dc, library );
        dna_diversity_sum += codon_data.log_dna_diversity;
        aa_diversity_sum +=  codon_data.log_aa_diversity;
        output_library_data.positions.push( codon_data );
        output_library_data.error += output_library_data.positions[ i ].error;
    }
    output_library_data.dna_diversity = Math.exp( dna_diversity_sum );
    output_library_data.aa_diversity = Math.exp( aa_diversity_sum );
    return output_library_data;
}

var library = AALibrary();

function go() {

//    dc = DegenerateCodon();
//    dclex = LexicographicalIterator( [ 16, 16, 16 ] );
//    dclex.set_from_index( 16*16*3 + 16*4 + 12 );
//    dc.set_from_lex( dclex );
//    dc.log_diversity();
//
//    return;

    var csv_contents = document.getElementById( "aaobs" ).value;
    library.load_library( csv_contents );
    library.compute_smallest_diversity_for_all_errors();
    var diversity_cap = 320000000;
    var best = library.optimize_library( diversity_cap );
    print_output_codons( library, best, diversity_cap );
}

// Local Variables:
// js-indent-level: 4
// indent-tabs-mode: nil
// End:
