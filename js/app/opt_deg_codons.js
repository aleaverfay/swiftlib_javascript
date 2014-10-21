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
        gcm.index_to_base = { 0 : "A", 1 : "C", 2 : "G", 3 : "T" };
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

    // The input parameter "codon" should be an array of size 3 with each element
    // being either 'A', 'C', 'G' or 'T'
    gcm.codon_index = function( codon ) {
        var index = 0;
        for ( var i=0; i < 3; ++i ) {
            index = index*4 + this.base_to_index[ codon[i] ];
        }
        return index;
    };

    // The input parameter "codon" should be an array of size 3 with each element
    // in the range between 0 and 3.
    gcm.codon_index_from_base_inds = function( codon ) {
        var index = 0;
        for ( var ii = 0; ii < 3; ++ii ) {
            index = index*4 + codon[ ii ];
        }
        return index;
    }

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

    lex.upper_diagonal_increment = function () {
        for ( var i = lex.size - 1; i >= 0; --i ) {
            lex.pos[ i ] += 1;
            if ( lex.pos[ i ] === lex.dimsizes[ i ] ) {
                lex.pos[ i ] = 0;
            } else {
                var beyond_end = false;
                for ( var k = i+1; k < lex.size; ++k )  {
                    lex.pos[ k ] = lex.pos[ i ] + k - i;
                    if ( lex.pos[ k ] >= lex.dimsizes[ k ] ) {
                        beyond_end = true;
                        break;
                    }
                }
                if ( beyond_end && i == 0 ) {
                    for ( var k = 0; k < lex.size; ++k ) {
                        lex.pos[ k ] = 0;
                    }
                    lex.at_end = true;
                    return false;
                } else if ( ! beyond_end ) {
                    return true;
                }
            }
        }
        // just in case this is a one-dimensional lexicographical iterator
        // then we need to set lex.at_end having arrived here
        lex.at_end = true;
        return false;
    }


    lex.reset = function() {
        for ( var i=0; i < this.size; ++i ) {
            this.pos[ i ] = 0;
        }
        this.at_end = false;
    };

    // if you want to iterate across only the values of the lex s.t.
    // pos[i] < pos[j] for all j > i, then initialize the lex with
    // this function, and increment it with the increment_upper_diagonal
    // function.
    lex.upper_diagonal_reset = function() {
        var beyond_end = false;
        for ( var i=0; i < this.size; ++i ) {
            this.pos[ i ] = i;
            if ( i >= this.dimsizes[ i ] ) { beyond_end = true; }
        }
        if ( beyond_end ) {
            for ( var i=0; i < this.size; ++i ) { this.pos[i] = 0; }
            this.at_end = true;
        } else {
            this.at_end = false;
        }
    }

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
            "1010" : "R",
            "0101" : "Y",
            "0111" : "B",
            "1011" : "D",
            "1101" : "H",
            "1110" : "V",
            "1111" : "N"
        };
        dc.names_to_bases = {};
        for ( var bases in dc.degenerate_base_names ) {
            dc.names_to_bases[ dc.degenerate_base_names[bases] ] = bases;
        }
    }
    init( dc );

    dc.codon_string = function() {
        var output_codon_string = "";
        for ( var i=0; i < 3; ++i ) {
            var idcpos = this.pos[i];
            var base_tuple = []
            for ( var j=0; j < 4; ++j ) {
                base_tuple[j] = binBoolString( idcpos[j] );
            }
            output_codon_string += this.degenerate_base_names[ base_tuple.join("") ];
        }
        return output_codon_string;
    };


    dc.validate_codon_string = function( codon_string ) {
        if ( codon_string.length != 3 ) return false;
        for ( var i = 0; i < 3; ++i ) {
            if ( ! this.names_to_bases.hasOwnProperty( codon_string[i] ) ) return false;
        }
        return true;
    }

    dc.set_from_codon_string = function( codon_string ) {
        this.reset();
        for ( var i = 0; i < 3; ++i ) {
            var ibases = this.names_to_bases[ codon_string[i] ];
            for ( var j = 0; j < 4; ++j ) {
                if ( ibases[j] === "1" ) {
                    this.set_pos( i, j );
                }
            }
        }
    }

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

    dc.diversity = function () {
        for ( var i=0; i < 3; ++i ) {
            if ( this.count_pos[i] === 0 ) {
                return this.infinity;
            }
        }
        var div = 1;
        for ( var i=0; i < 3; ++i ) {
            div *= this.count_pos[i];
        }
        return div;
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
        // Get the index for a particular *codon* using a lexicographical iterator
        // that's dimensioned from this.count_pos; this is useful when looking
        // at all the individual codons perscribed by a degenerate codon.
        // E.g., the index for a codon ACG, would be 0*16+1*4+2 = 6, and this
        // codon would one of the many perscribed by the degenerate codon ACN.
        var codon_index = 0;
        for ( var i=0; i < 3; ++i ) {
            codon_index = codon_index * 4 + this.which[i][lex.pos[i]];
        }
        return codon_index;
    };

    dc.set_from_lex = function ( lex ) {
        // Set the state for this degenerate codon using a lex that's iterating over all (2**4-1)**3 = 3375 codon options.
        // This is not interchangable with the above function index_from_lex.
        // To go from a degenerate-codon assignment to an index, use the function
        // degenerate_codon_index below
        this.reset();
        for ( var i=0; i < 3; ++i ) {
            var posi = lex.pos[i]+1; // take "14" to mean "all 4 degenerate nucleotides" and "0" to mean "only A"
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
    }

    dc.degenerate_codon_index = function() {
        // Compute the the degenerate codon index in the range [0..3375] from
        // the currently assigned set of bases.
        var index = 0;
        for ( var ii = 0; ii < 3; ++ii ) {
            var ii_val = this.pos[ii][3]*8 + this.pos[ii][2]*4 + this.pos[ii][1]*2 + this.pos[ii][0] - 1; // range from 0 to 15
            index = index*15 + ii_val;
        }
        return index;
    }

    return dc;

}


function AALibrary() {
    var library = {};

    function init( library ) {
        library.infinity = -1.0;
        library.gcmapper = GeneticCodeMapper();
        library.max_dcs_per_pos = 1;
        library.max_oligos_per_stretch = 0;
        library.max_oligos_total = 0;
        library.n_stretches = 0;
        library.dclex = LexicographicalIterator( [ 15, 15, 15 ] );
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

    library.enumerate_aas_for_all_degenerate_codons = function() {
        if ( this.hasOwnProperty( "aas_for_dc" ) ) {
            // initialize this only once
            return;
        }

        this.aas_for_dc = [];
        this.diversities_for_dc = [];
        var dc = DegenerateCodon();
        this.dclex.reset();
        while ( ! this.dclex.at_end ) {
            dc.set_from_lex( this.dclex );
            var lexind = this.dclex.index();
            this.aas_for_dc[ lexind ] = this.aas_for_degenerate_codon( dc );
            this.diversities_for_dc[ lexind ] = dc.diversity();
            this.dclex.increment();
        }
    }

    //format should be a table with N columns and 23 rows
    // row 1 is a header, which just gives the sequence positions
    // row 2 defines stretch boundaries
    // row 3 gives the maximum number of DCs for each position
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
        this.stretch_reps = newFilledArray( this.n_positions, 0 );
        this.max_dcs_for_pos = newFilledArray( this.n_positions, 1 );
        for ( var i=0; i < this.n_positions; ++i ) {
            this.aa_counts[ i ] = newFilledArray( 21, 0 );
            this.required[ i ]  = newFilledArray( 21, false );
            this.forbidden[ i ] = newFilledArray( 21, false );
        }
        this.orig_pos = [];
        for ( var i=1; i < row1.length; ++i ) {
            this.orig_pos[i-1] = strip_whitespace( row1[i] )
        }

        // Read out the stretch-boundary data from the CSV input, marking stretch
        // representatives for each position (the first position in a stretch
        // being its own representative) and counting the number of stretches.
        var row2 = lines[1];
        var row2cols = row2.split(",").slice(1);
        var last_rep = 0;

        // the first position is always considered to be the start of a stretch
        this.n_stretches = 1;
        this.stretch_reps[0] = 0;
        for ( var i=1; i < this.n_positions; ++i ) {
            if ( row2cols[i] === "|" ) {
                last_rep = i;
                ++this.n_stretches;
            }
            this.stretch_reps[i] = last_rep;
        }

        // increase the maximum number of oligos total if it is less than the
        // total number of stretches, otherwise there wouldn't be enough oligos
        // to cover all the stretches and the optimization would be nonsensical.
        if ( this.max_oligos_total < this.n_stretches ) {
            this.max_oligos_total = this.n_stretches;
        }

        // read out the per-position counts of the number of degenerate codons
        // allowed at each position from the CSV input text
        var row3 = lines[2];
        var row3cols = row3.split(",").slice(1);
        this.max_dcs_per_pos = 1;
        for ( var i=0; i < this.n_positions; ++i ) {
            this.max_dcs_for_pos[i] = parseInt( row3cols[i] );
            if ( this.max_dcs_for_pos[i] > this.max_dcs_per_pos ) {
                this.max_dcs_per_pos = this.max_dcs_for_pos[i];
            }
        }

        // increase the maximum number of oligos per stretch to give space for
        // at least one position in a stretch to have as many degenerate codons
        // as has been allowed at that position, otherwise there is no point in
        // entertaining that many degenerate codons at all.
        if ( this.max_oligos_per_stretch === 0 ) {
            this.max_oligos_per_stretch = this.max_oligos_total - this.n_stretches + 1;
        } else if ( this.max_oligos_per_stretch < this.max_dcs_per_pos ) {
            console.log( "Increasing max_oligos_per_stretch to " + this.max_oligos_per_stretch );
            this.max_oligos_per_stretch = this.max_dcs_per_pos;
        }

        // increase the maximum number of oligos total to give space for the maximum number
        // of oligos in a single stretch - 1 + the total number of stretches
        // otherwise, there is no point in looking at multiple degenerate codons at a single
        // position or multiple oligos to cover a single stretch.
        if ( this.max_oligos_total < this.n_stretches + this.max_oligos_per_stretch - 1 ) {
            console.log( "Increasing max_oligos_total to " + this.max_oligos_total + " ( " + this.n_stretches + " + " + this.max_oligos_per_stretch + " - 1)");
            this.max_oligos_total = this.n_stretches + this.max_oligos_per_stretch - 1;
        }

        this.max_per_position_error = 0;
        var obs_count = newFilledArray( this.n_positions, 0 );
        for ( var i=0; i < 21; ++i ) {
            var line = lines[ i + 3 ];
            var vals = line.split(",").slice(1);
            //console.log( "vals " + i.toString() + " " + vals.toString() );
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
            //console.log( vals.join(", ") );
        }
        for ( var i=0; i < this.n_positions; ++i ) {
            if ( obs_count[i] > this.max_per_position_error ) {
                this.max_per_position_error = obs_count[i];
            }
        }

    };

    // Returns the error for a given set of amino acids assigned
    // to a particular position. Returns this.infinity if one of
    // the required amino acids is missing or if a forbidden
    // amino acid is present
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

    // Returns the error for a given set of amino acids. Returns an error even
    // if then given set of aas does not include all of the required aas, but
    // returns infinity if it includes one of the forbidden amino acids
    library.error_given_aas_for_pos_ignore_req = function( pos, aas ) {
        var error = 0;
        for ( var i=0; i < 21; ++i ) {
            var icount = this.aa_counts[ pos ][ i ];
            if ( ! aas[ i ] ) {
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

    library.find_useful_codons = function() {
        var that = this;

        // compute an integer from a set of amino acids (indicated by the boolean array "aas")
        // where the "useful" aas are those which are either required or whose absence would
        // contribute to the error.  This integer is used to quickly represent AA sets as an
        // index in an array.
        function useful_aaind_for_pos( aas, pos ) {
            var aaind = 0;
            for ( var i = 0; i < 21; ++i ) {
                var iuseful = that.aa_counts[pos][i] !== 0 || that.required[pos][i];
                aaind = 2 * aaind + ( aas[i] && iuseful ? 1 : 0 );
            }
            return aaind;
        }

        // the array of useful degenerate codons for each position; used in the dynamic
        // programming algorithm later
        this.useful_codons = [];

        // the diversities for the degenerate codons; this is a three-dimensional array
        // index 0: which position
        // index 1: what error
        // index 2: either 0 (for the codon's diveristy) or 1 (for the codon's index)
        var div_for_codons = []

        for ( var i = 0; i < this.n_positions; ++i ) {
            this.useful_codons[i] = [];
            div_for_codons[i] = []
        }
        for ( var i = 0; i < 3375; ++i ) {
            var iaas = this.aas_for_dc[ i ];
            var idiv = this.diversities_for_dc[ i ];
            for ( var j = 0; j < this.n_positions; ++j ) {
                var ijerror = this.error_given_aas_for_pos_ignore_req( j, iaas );
                if ( ijerror === this.infinity ) continue;
                var ij_aaind = useful_aaind_for_pos( iaas, j );

                // keep this codon if it's the first codon producing ijerror
                // OR it's the first codon with the given aa index producing ijerror
                // OR the diversity for this codon is smaller than the smallest-seen
                // diversity of any codon producing ijerror with the given aa index.
                if ( ! div_for_codons[j].hasOwnProperty( ijerror ) ||
                     ! div_for_codons[j][ijerror ].hasOwnProperty( ij_aaind ) ||
                     div_for_codons[j][ijerror][ij_aaind][0] > idiv ) {

                    if ( ! div_for_codons[j].hasOwnProperty( ijerror ) ) {
                        div_for_codons[j][ ijerror ] = [];
                    }
                    div_for_codons[j][ ijerror ][ ij_aaind ] = [ idiv, i ];
                }
            }
        }
        for ( var i = 0; i < this.n_positions; ++i ) {
            for ( var j in div_for_codons[i] ) {
                if ( ! div_for_codons[i].hasOwnProperty( j ) ) continue;
                var jaainds = div_for_codons[i][j];
                for ( var k in jaainds ) {
                    if ( ! jaainds.hasOwnProperty( k ) ) continue;
                    this.useful_codons[i].push( jaainds[k][1] );
                }
            }
        }
    };


    library.compute_smallest_diversity_for_all_errors = function() {
        var that = this;
        function codon_inds_from_useful_codon_lex( position, useful_codon_lex  ) {
            var inds = [];
            for ( var i=0; i < useful_codon_lex.pos.length; ++i ) {
                inds[i] = that.useful_codons[position][ useful_codon_lex.pos[i] ];
            }
            return inds;
        }

        this.enumerate_aas_for_all_degenerate_codons();
        this.find_useful_codons();

        this.divmin_for_error_for_n_dcs = [];
        this.codons_for_error_for_n_dcs = [];
        this.errors_for_n_dcs_for_position = [];
        for ( var i=0; i < this.n_positions; ++i ) {
            this.divmin_for_error_for_n_dcs[i] = [];
            this.codons_for_error_for_n_dcs[i] = [];
            this.errors_for_n_dcs_for_position[i] = [];
            for ( var j=1; j <= this.max_dcs_for_pos[i]; ++j ) {
                this.divmin_for_error_for_n_dcs[i][j] = newFilledArray( this.max_per_position_error+1, this.infinity );
                this.codons_for_error_for_n_dcs[i][j] = newFilledArray( this.max_per_position_error+1, this.infinity );
                this.errors_for_n_dcs_for_position[i][j] = [];
            }
        }
        var aas_for_combo = newFilledArray( 21, false );
        for ( var i=0; i < this.n_positions; ++i ) {
            // j iterates over the number of degenerate codons to consider at position i
            for ( var j=1; j <= this.max_dcs_for_pos[i]; ++j ) {
                var dims = [];

                for ( var k=0; k < j; ++k ) {
                    dims[k] = this.useful_codons[i].length;
                }
                var jlex = LexicographicalIterator( dims );
                jlex.upper_diagonal_reset();

                // now iterate over all combinations of degenerate codons
                while ( ! jlex.at_end ) {

                    // assemble the codons; compute their diversity
                    for ( var k=0; k < 21; ++k ) aas_for_combo[k] = false;
                    var diversity = 0;
                    for ( var k=0; k < j; ++k ) {
                        var kcodon = this.useful_codons[i][ jlex.pos[k] ];
                        diversity += this.diversities_for_dc[ kcodon ];
                        var kaas = this.aas_for_dc[ kcodon ];
                        for ( var l=0; l < 21; ++l ) {
                            aas_for_combo[l] = aas_for_combo[l] || kaas[l];
                        }
                    }
                    var log_diversity = Math.log( diversity );

                    var error = this.error_given_aas_for_pos( i, aas_for_combo );
                    if ( error !== this.infinity ) {
                        //console.log( "Position " + i + " ndeg: " + j + " codon inds: " + jlex.pos + " error: " + error );
                        // combinations of useful codons can still return infinity if the
                        // set of required amino acids is not covered
                        var prev_diversity = this.divmin_for_error_for_n_dcs[i][j][error];
                        if ( prev_diversity === this.infinity ) { this.errors_for_n_dcs_for_position[i][j].push( error ); }
                        if ( prev_diversity === this.infinity || prev_diversity > log_diversity ) {
                            this.divmin_for_error_for_n_dcs[ i ][ j ][ error ] = log_diversity;
                            this.codons_for_error_for_n_dcs[ i ][ j ][ error ] = codon_inds_from_useful_codon_lex( i, jlex );
                        }
                    }
                    jlex.upper_diagonal_increment();
                }
                this.errors_for_n_dcs_for_position[i][j].sort( function(a,b){return a-b} );
                //console.log( "errors for " + i + " " + j + " " + this.errors_for_n_dcs_for_position[i][j] );
            }
        }
    }

    library.find_position_w_no_available_codons = function() {
        var no_viable_solution_for_pos = newFilledArray( this.n_positions, false );
        var all_ok_solo = true;
        var ok_solo = [];
        for ( var ii=0; ii < this.n_positions; ++ii ) {
            if ( this.errors_for_n_dcs_for_position[ii][1].length === 0 ) {
                ok_solo[ii] = false;
                all_ok_solo = false;
            } else {
                ok_solo[ii] = true;
            }
        }
    }

    library.find_positions_wo_viable_solutions = function() {
        var no_viable_solution_for_pos = newFilledArray( this.n_positions, false );

        var all_ok_solo = true;
        var ok_solo = [];
        for ( var ii=0; ii < this.n_positions; ++ii ) {
            if ( this.errors_for_n_dcs_for_position[ii][1].length === 0 ) {
                ok_solo[ii] = false;
                all_ok_solo = false;
            } else {
                ok_solo[ii] = true;
            }
        }

        // we can exit early and indicate that no positions have any problems
        // if all positions meet the forbidden/required amino acids when considering
        // only a single degenerate codon at that position; clearly these positions
        // will also be ok when considering multiple degenerate codons.
        if ( all_ok_solo ) return no_viable_solution_for_pos;

        // otherwise, we have to make sure that
        // 1. all positions have a solution even if they require more than 1 DC
        // 2. no two positions that are on the same stretch require more than 1 DC

        var pos_has_some_solution = [];
        for ( var ii=0; ii < this.n_positions; ++ii ) {
            var ok = false;
            var jjcap = this.max_dcs_for_pos[ii];
            for ( var jj=1; jj <= jjcap; ++jj ) {
                if ( this.errors_for_n_dcs_for_position[ii][jj].length !== 0 ) {
                    ok = true;
                    break;
                }
            }
            if ( ! ok ) {
                no_viable_solution_for_pos[ ii ] = true;
                pos_has_some_solution[ ii ] = false;
            } else {
                pos_has_some_solution[ ii ] = true;
            }
        }

        // now look at all the positions that are part of the
        // same stretch and make sure that, if they have some solution
        // that at most one of them is not ok without multiple
        // degenerate codons.

        var visited = newFilledArray( this.n_positions, false );
        for ( var ii = 0; ii < this.n_positions; ++ii ) {
            if ( ok_solo[ ii ] || ! pos_has_some_solution[ ii ] ) continue;
            var ii_stretch_rep = this.stretch_reps[ii];
            if ( visited[ ii_stretch_rep ] ) continue;
            visited[ ii_stretch_rep ] = true;
            var ii_bad = false;
            for ( var jj = ii+1; jj < this.n_positions; ++jj) {
                var jj_stretch_rep = this.stretch_reps[jj];
                if ( jj_stretch_rep !== ii_stretch_rep ) break;
                if ( ! pos_has_some_solution[ jj ] ) continue;
                if ( ! ok_solo[ jj ] ) {
                    if ( ! ii_bad ) {
                        no_viable_solution_for_pos[ ii ] = true;
                        ii_bad = true;
                    }
                    no_viable_solution_for_pos[ jj ] = true;
                }
            }
        }

        return no_viable_solution_for_pos;
    }


    library.optimize_library = function( diversity_limit, n_solutions_requested ) {
        var log_diversity_limit = Math.log( diversity_limit );

        this.error_span = this.max_per_position_error * this.n_positions;

        // start by allocating the appropriate amount of space for the dynamic
        // programing diversity-minimum (divmin) and traceback tables.
        this.dp_divmin = [];
        this.dp_traceback = [];
        var count_stretch = 0;
        // ii indexes over the positions
        for ( var ii=0; ii < this.n_positions; ++ii ) {
            this.dp_divmin[ii]    = [];
            this.dp_traceback[ii] = [];
            if ( this.stretch_reps[ii] === ii ) {
                ++count_stretch;
            }
            // jj indexes over the number of oligos used total for everything up to the current
            // position ii
            for ( var jj=count_stretch; jj <= count_stretch*this.max_oligos_per_stretch; ++jj ) {
                this.dp_divmin[ii][jj]    = [];
                this.dp_traceback[ii][jj] = [];

                // kk indexes over the number of oligos used in the current stretch
                for ( var kk=1; kk <= this.max_oligos_per_stretch; ++kk ) {
                    this.dp_divmin[ii][jj][kk]    = [];
                    this.dp_traceback[ii][jj][kk] = [];
                }
            }
        }

        // Position 0: copy this.divmin_for_error_for_n_dcs[0] into this.dp_divmin
        var pos0jjlimit = Math.min( this.max_oligos_per_stretch, this.max_dcs_for_pos[0] );
        for ( var jj=1; jj <= pos0jjlimit; ++jj ) {
            for ( var ll=0; ll <= this.max_per_position_error; ++ll ) {
                if ( this.divmin_for_error_for_n_dcs[0][jj][ll] !== this.infinity ) {
                    this.dp_divmin[0][jj][jj][ll]    = this.divmin_for_error_for_n_dcs[0][jj][ll];
                    this.dp_traceback[0][jj][jj][ll] = [ ll, jj, 0 ];
                }
            }
        }

        // iterate over all errors (stopping once an error beneath the diversity limit has been
        // reached) and solving for the smallest library size that can be achieved with at most
        // hh error.  It's very likely that the desired library could be constructed without
        // having to explore all of error space, and since the error space is the largest space
        // to be explored, this approach could reducing running time dramatically.
        var found_minimum_error_solution = false;
        var n_viable_solutions_found = 0;
        for ( var hh=0; hh <= this.error_span; ++hh ) {

            // position 0 is by definition the first residue in a stretch
            // so start counting the stretches from 1.
            var count_stretch = 1;

            // iterate over all positions ii, solving the dynamic programming
            // problem for residues 0..ii for a given error hh
            for ( var ii=1; ii < this.n_positions; ++ii ) {
                var iilastpos = ii === this.n_positions - 1;

                // increment count_stretch reguardless of what happens with the max_per_position_error check below
                if ( ii === this.stretch_reps[ ii ] ) {
                    ++count_stretch;
                }

                // check that it would be possible to achieve an error of hh at position ii
                if ( this.max_per_position_error * (ii+1) < hh ) continue;

                var iidpdivmin    = this.dp_divmin[ ii ];
                var iidptraceback = this.dp_traceback[ ii ];

                var iim1dpdivmin    = this.dp_divmin[ ii-1 ];

                // one of two different recursions based on whether this is the
                // first residue in a stretch
                if ( ii === this.stretch_reps[ ii ] ) {

                    // iterate across the total number of oligos committed to up to position ii
                    // this can be at most count_stretch * this.max_oligos_per_stretch;
                    var jjlimit = Math.min( this.max_oligos_total, count_stretch * this.max_oligos_per_stretch );

                    for ( var jj = count_stretch; jj <= jjlimit; ++jj ) {
                        var jjdpdivmin    = iidpdivmin[ jj ];
                        var jjdptraceback = iidptraceback[ jj ];

                        // iterate over the number of degenerate codons to be used at position ii
                        // this is at most jj-1 since we are adding kk to the number of oligos
                        // used up to position ii-1 and this second number cannot be 0.
                        var kklimit = Math.min( this.max_dcs_for_pos[ii], jj-1 );
                        for ( var kk = 1; kk <= kklimit; ++kk ) {
                            // not all jj/kk combos are achievable
                            if ( jj-kk > (count_stretch-1)*this.max_oligos_per_stretch ) continue;
                            if ( jj-kk < count_stretch-1 ) continue;

                            var kkdpdivmin    = jjdpdivmin[ kk ];
                            var kkdptraceback = jjdptraceback[ kk ];
                            var kkerrors      = this.errors_for_n_dcs_for_position[ii][kk];
                            var kkdiversities = this.divmin_for_error_for_n_dcs[ii][kk];
                            var iim1_jjmkk_dpdivmin    = iim1dpdivmin[ jj-kk ];

                            var hhdivmin          = this.infinity;
                            var hhdivmin_iierror  = this.infinity;
                            var hhdivmin_iindcs   = this.infinity;
                            var hhdivmin_iim1ndcs = this.infinity;

                            // now look at all the errors possible from position ii when using kk degenerate codons
                            var mmlimit = kkerrors.length;
                            for ( var mm = 0; mm <= mmlimit; ++mm ) {
                                var mmerror = kkerrors[mm];
                                if ( mmerror > hh ) break; // error is always positive
                                var mmdiversity = kkdiversities[mmerror];
                                var hh_minus_mmerr = hh - mmerror;
                                // and look at all the number of primers used in the stretch that position ii-1 is part of
                                var nnlimit = this.max_oligos_per_stretch;
                                for ( var nn = 1; nn <= nnlimit; ++nn ) {
                                    if ( iim1_jjmkk_dpdivmin[ nn ].hasOwnProperty( hh_minus_mmerr ) ) {
                                        var nndiv = iim1_jjmkk_dpdivmin[nn][ hh_minus_mmerr ] + mmdiversity;
                                        if ( hhdivmin === this.infinity || nndiv < hhdivmin ) {
                                            hhdivmin          = nndiv;
                                            hhdivmin_iierror  = mmerror;
                                            hhdivmin_iindcs   = kk;
                                            hhdivmin_iim1ndcs = nn;
                                        }
                                    }
                                } // for nn
                            } // for mm
                            if ( hhdivmin !== this.infinity ) {
                                //if ( hh < 40 ) console.log( "  divmin[" + ii + ","+jj+","+kk+","+hh + "] = " + hhdivmin );
                                // record diveristy-minimum and traceback info
                                kkdpdivmin   [ hh ] = hhdivmin;
                                kkdptraceback[ hh ] = [ hhdivmin_iierror, hhdivmin_iindcs, hhdivmin_iim1ndcs ];
                                if ( iilastpos && hhdivmin < log_diversity_limit ) {
                                    found_minimum_error_solution = true;
                                    ++n_viable_solutions_found;
                                }
                            }
                        } // for kk
                    } // for jj
                } else {

                    // iterate across the total number of oligos commited to up to position ii
                    // this can be at most count_stretch * this.max_oligos_per_stretch;
                    var jjlimit = Math.min( this.max_oligos_total, count_stretch * this.max_oligos_per_stretch );
                    for ( var jj = count_stretch; jj <= jjlimit; ++jj ) {
                        var jjdpdivmin    = iidpdivmin[ jj ];
                        var jjdptraceback = iidptraceback[ jj ];

                        // Iterate over the number of oligos committed to by all of the residues
                        // from the current stretch; this will place certain restrictions on the
                        // number of degenerate codons that can be used at position ii.
                        // This is at most jj (instead of jj-1 in the if block above) since we
                        // might be using only a single oligo for the positions in this stretch.
                        var kklimit = Math.min( this.max_oligos_per_stretch, jj );
                        for ( var kk = 1; kk <= kklimit; ++kk ) {

                            var kkdpdivmin    = jjdpdivmin[ kk ];
                            var kkdptraceback = jjdptraceback[ kk ];

                            var hhdivmin          = this.infinity;
                            var hhdivmin_iierror  = this.infinity;
                            var hhdivmin_iindcs   = this.infinity;
                            var hhdivmin_iim1ndcs = this.infinity;

                            // how can we achieve this error level?

                            // now consider all possible numbers of degenerate codons that
                            // could be used at position ii; this is at most kk, but I feel like
                            // there is a tighter bound I can put on this.  At least I can check that
                            // jjprime is greater than or equal to count_stretch.
                            var mmlimit = Math.min( this.max_dcs_for_pos[ii], kk );
                            for ( var mm = 1; mm <= mmlimit; ++mm ) {
                                if ( kk % mm !== 0 ) continue; // e.g. if kk = 5, mm cannot be 2
                                var mmprime = kk / mm; // this is an integer, right?
                                var jjprime = jj - (mm-1)*mmprime; // the total number of oligos used up to position ii-1
                                // we couldn't use fewer than count_stretch oligos to cover up to
                                // this stretch
                                if ( jjprime < count_stretch ) continue;

                                var mmerrors      = this.errors_for_n_dcs_for_position[ii][mm];
                                var mmdiversities = this.divmin_for_error_for_n_dcs[ii][mm];

                                var iim1_mm_dpdivmin = iim1dpdivmin[ jjprime ][ mmprime ];

                                // and look at all the errors possible from position ii when using mm degenerate codons
                                var nnlimit = mmerrors.length;
                                for ( var nn = 0; nn <= nnlimit; ++nn ) {
                                    var nnerror = mmerrors[ nn ];
                                    if ( nnerror > hh ) continue;
                                    var hh_minus_nnerror = hh - nnerror;
                                    if ( iim1_mm_dpdivmin.hasOwnProperty( hh_minus_nnerror ) ) {
                                        var nndiv = mmdiversities[ nnerror ] + iim1_mm_dpdivmin[ hh_minus_nnerror ];
                                        if ( hhdivmin === this.infinity || nndiv < hhdivmin ) {
                                            hhdivmin          = nndiv;
                                            hhdivmin_iierror  = nnerror;
                                            hhdivmin_iindcs   = mm;
                                            hhdivmin_iim1ndcs = mmprime;
                                        }
                                    }
                                } // for nn
                            }// for mm
                            if ( hhdivmin !== this.infinity ) {
                                //if ( hh < 40 ) console.log( "  divmin[" + ii + ","+jj+","+kk+","+hh + "] = " + hhdivmin );
                                kkdpdivmin[    hh ] = hhdivmin;
                                kkdptraceback[ hh ] = [ hhdivmin_iierror, hhdivmin_iindcs, hhdivmin_iim1ndcs ];
                                if ( iilastpos && hhdivmin < log_diversity_limit ) {
                                    found_minimum_error_solution = true;
                                    ++n_viable_solutions_found;
                                }
                            }

                        } // for kk
                    } // for jj
                } // else
            } // for ii

            if ( found_minimum_error_solution && n_viable_solutions_found >= n_solutions_requested ) break;

        } // for hh

    };

    library.traceback = function( diversity_cap ) {
        var best = this.find_minimal_error_beneath_diversity_cap( diversity_cap );
        return this.traceback_from_starting_point( best[0], best[1], best[2] );
    };

    library.find_minimal_error_beneath_diversity_cap = function ( diversity_cap ) {
        var log_diversity_cap        =  Math.log( diversity_cap );
        console.log( "log diversity cap: " + log_diversity_cap );
        var best_error               = this.infinity;
        var best_noligos_total       = this.infinity;
        var best_noligos_for_stretch = this.infinity;

        for ( var jj=1; jj <= this.max_oligos_total; ++jj ) {
            if ( ! this.dp_divmin[ this.n_positions-1].hasOwnProperty( jj ) ) continue;

            var jj_dp_divmin = this.dp_divmin[ this.n_positions-1 ][ jj ];

            for ( var kk = 1; kk <= this.max_oligos_per_stretch; ++kk ) {
                if ( ! jj_dp_divmin.hasOwnProperty(kk) ) continue;
                var kk_dp_divmin = jj_dp_divmin[ kk ];
                for ( var ll = 0; ll <= this.error_span; ++ll ) {
                    if ( ! kk_dp_divmin.hasOwnProperty(ll) ) continue;
                    //console.log( " diversity given error level: " + jj + " " + kk + " " + ll + " " + kk_dp_divmin[ll] );
                    var lldiversity = kk_dp_divmin[ll];
                    if ( lldiversity > log_diversity_cap ) continue;
                    if ( best_error === this.infinity || ll < best_error ) {
                        best_error = ll;
                        best_noligos_total = jj;
                        best_noligos_for_stretch = kk;
                    }
                    break; // all other errors are going to be higher for this jj/kk combination
                }
            }
        }

        console.log( "Smallest error of " + best_error + " requires " + best_noligos_total + " oligos total" );
        return [ best_noligos_total, best_noligos_for_stretch, best_error ];
    };

    // Returns the list of errors and library sizes that are above the diversity cap and the other
    // data that is needed in order to perform a dynamic programming backtrace to recover these
    // other solutions.
    library.report_error_and_libsizes_above_diversity_cap = function( diversity_upper_bound ) {
        var log_diversity_cap = Math.log( diversity_upper_bound );
        var error_libsize_pairs = []
        for ( var jj = 1; jj <= this.max_oligos_total; ++jj ) {
            if ( ! this.dp_divmin[ this.n_positions-1 ].hasOwnProperty( jj ) ) continue;
            var jj_dp_divmin = this.dp_divmin[ this.n_positions-1 ][ jj ];
            for ( var kk = 1; kk <= this.max_oligos_per_stretch; ++kk ) {
                if ( ! jj_dp_divmin.hasOwnProperty(kk) ) continue;
                var kk_dp_divmin = jj_dp_divmin[ kk ];
                for ( var ll = 0; ll <= this.error_span; ++ll ) {
                    if ( ! kk_dp_divmin.hasOwnProperty(ll) ) continue;
                    var lldiversity = kk_dp_divmin[ll];
                    error_libsize_pairs.push( [ ll, lldiversity, jj, kk ] );
                    if ( lldiversity < log_diversity_cap ) break; // take the smallest library beneath the cap and then stop
                }
            }
        }
        return error_libsize_pairs;
    };

    library.find_errors_and_ndcs_beneath_diversity_cap = function( diversity_upper_bound, nsolutions ) {
        var errors_and_ndcs_in_range = [];
        var log_div_bound = Math.log( diversity_upper_bound );

        var count_solutions = 0;
        for ( var ii = 1; ii <= this.max_oligos_total; ++ii ) {
            if ( ! this.dp_divmin[this.n_positions-1].hasOwnProperty(ii) ) continue;
            var ii_divmins = this.dp_divmin[this.n_positions-1][ii];
            for ( var jj = 1; jj <= this.max_oligos_per_stretch; ++jj ) {
                var jj_divmins = ii_divmins[jj];
                for ( var kk = 0; kk <= this.error_span; ++kk ) {
                    if ( ! jj_divmins.hasOwnProperty(kk) ) continue;
                    var kkdiv = jj_divmins[kk];
                    if ( kkdiv <= log_div_bound ) {
                        // actually pushes back a pair / array, with the first element being
                        // the number of extra oligos used and second being the error level
                        errors_and_ndcs_in_range.push( [ii,jj,kk] );
                        ++count_solutions;
                        if ( count_solutions === nsolutions ) break;
                    }
                }
            }
            if ( count_solutions === nsolutions ) break;
        }
        errors_and_ndcs_in_range.sort( function(a,b){return a[2]-b[2];} );
        return errors_and_ndcs_in_range;
    }

    library.find_smallest_diversity = function () {
        var smallest_diversity = this.infinity;
        for ( var ii = 1; ii <= this.max_oligos_total; ++ii ) {
            var ii_dp_divmin = this.dp_divmin[ this.n_positions-1 ][ ii ];
            for ( var jj = 0; jj <= this.error_span; ++jj ) {
                if ( ! ii_dp_divmin.hasOwnProperty( jj ) ) continue;
                var jjdiv = ii_dp_divmin[jj];
                if ( smallest_diversity === this.infinity || smallest_diversity > jjdiv ) {
                    smallest_diversity = jjdiv;
                }
            }
        }
        return smallest_diversity;
    };

    library.traceback_from_starting_point = function( noligos_total, noligos_for_stretch, error_level ) {
        // the error traceback will report for each position:
        // 0: the number of degenerate codons used
        // 1: the error produced at this position.
        var error_traceback = [];
        for ( var i=0; i < this.n_positions; ++i ) { error_traceback[i] = [ this.infinity, this.infinity ]; }

        //var position_error = [];
        //for ( var i=0; i < this.n_positions; ++i ) { position_error[i] = 0; }

        var ii_ntotal = noligos_total;
        var ii_nstretch = noligos_for_stretch;
        var ii_error = error_level;

        for ( var ii=this.n_positions-1; ii >= 0; --ii ) {
            console.log( "Traceback: " + ii + " " + ii_ntotal + " " + ii_nstretch + " " + ii_error );
            console.log( "  divmin: " + this.dp_divmin[ ii ][ ii_ntotal ][ ii_nstretch ][ ii_error ] );
            var tb = this.dp_traceback[ ii ][ ii_ntotal ][ ii_nstretch ][ ii_error ];
            console.log( "Traceback data for " + ii + " " + tb );
            error_traceback[ii][ 0 ] = tb[ 1 ];
            error_traceback[ii][ 1 ] = tb[ 0 ];
            ii_ntotal      = this.stretch_reps[ii] === ii ? ii_ntotal - tb[ 1 ] : ii_ntotal - (tb[1]-1)*tb[2];
            ii_nstretch    = tb[ 2 ];
            ii_error       = ii_error - tb[ 0 ];
            //position_error[ii] = tb[0];
        }
        for ( var i=0; i < this.n_positions; ++i ) {
            console.log( "Position " + i + " with error level " + error_traceback[i][1] + " contributing " + error_traceback[i][0] + " degenerate codons " );
        }
        return error_traceback;
    };

    return library;
}

function desired_aa_count_for_position( library, position, dc ) {
    var count_desired = 0;
    var lex = LexicographicalIterator( dc.count_pos );
    var codon_base_inds = [ 0, 0, 0 ];
    while ( ! lex.at_end ) {
        for ( var ii = 0; ii < 3; ++ii ) {
            codon_base_inds[ ii ] = dc.which[ ii ][ lex.pos[ ii ] ];
        }
        var codon_index = library.gcmapper.codon_index_from_base_inds( codon_base_inds );
        var aaind = library.gcmapper.mapper[ codon_index ];
        if ( library.aa_counts[ position ][ aaind ] > 0 || library.required[ position ][ aaind ] ) {
            ++count_desired;
        }
        lex.increment();
    }

    return count_desired;        
}

function record_codon_data( position, codon_inds, library ) {
    // four things we need:
    // 1: the codon
    // 2: the amino acids that are represented
    // 2b: the counts from the original set of observations for each of the represented aas
    // 3: the amino acids and their counts in the original set of observations that are not represented
    // 4: the fraction of the desired amino acids among the set of chosen codons; this weights AA's
    //    according to how many times they are coded for.

    var codon_data = {}

    var dc = DegenerateCodon();
    var aas_present  = newFilledArray( 21, false ); //library.aas_for_degenerate_codon( degenerate_codon );
    var orig_obs = library.aa_counts[ position ];
    var codon_diversity = 0;
    var desired_aas = 0;

    codon_data.orig_pos_string = library.orig_pos[ position ];

    var codons = [];
    for ( var ii=0; ii < codon_inds.length; ++ii ) {
        library.dclex.set_from_index( codon_inds[ii] );
        dc.set_from_lex( library.dclex );
        codon_diversity += dc.diversity();
        desired_aas += desired_aa_count_for_position( library, position, dc );
        codons.push( dc.codon_string() );
        var iiaas = library.aas_for_dc[ codon_inds[ii] ];
        for ( var jj=0; jj < 21; ++jj ) {
            aas_present[jj] = aas_present[jj] || iiaas[jj];
        }
    }
    codons.sort();
    codon_data.codon_string = codons.join( ", " );

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
        if ( orig_obs[i] > 0 && ! aas_present[i] ) {
            codon_data.absent_string += " " + library.gcmapper.aastr_for_integer( i ) + "(" + orig_obs[i] + ")";
            codon_data.error += orig_obs[i];
        }
    }

    codon_data.dna_diversity = codon_diversity;
    codon_data.log_dna_diversity = Math.log( codon_diversity );
    codon_data.aa_count = aa_count;
    codon_data.log_aa_diversity = Math.log( aa_count );
    codon_data.desired_aa_frac = desired_aas / codon_diversity;
    console.log( "desired_aas " + desired_aas.toString() + " codon_diversity " + codon_diversity.toString() );

    return codon_data;
}

function report_output_library_data_from_codon_assignment( library, codon_assignment )
{
    var output_library_data = {};
    var desired_aa_product = 1;
    var dna_diversity_sum = 0;
    var aa_diversity_sum = 0;
    var n_primer_count = 0;
    var curr_stretch_n_primer_count = 1;
    var error_sum = 0;
    output_library_data.positions = [];
    output_library_data.error = 0;
    for ( var ii=0; ii < library.n_positions; ++ii ) {
        var codon_data =  record_codon_data( ii, codon_assignment[ii], library );
        error_sum += codon_data.error;
        dna_diversity_sum += codon_data.log_dna_diversity;
        aa_diversity_sum +=  codon_data.log_aa_diversity;
        desired_aa_product *= codon_data.desired_aa_frac;
        output_library_data.positions.push( codon_data );
        output_library_data.error += output_library_data.positions[ ii ].error;
        if ( ii !== 0 && library.stretch_reps[ii] === ii ) {
            // we've begun a new stretch
            n_primer_count += curr_stretch_n_primer_count;
            curr_stretch_n_primer_count = codon_assignment[ii].length;
        } else {
            curr_stretch_n_primer_count *= codon_assignment[ii].length;
        }
    }
    n_primer_count += curr_stretch_n_primer_count;

    output_library_data.dna_diversity = Math.exp( dna_diversity_sum );
    output_library_data.aa_diversity = Math.exp( aa_diversity_sum );
    output_library_data.desired_aa_product = desired_aa_product;
    output_library_data.n_primers_required = n_primer_count;
    output_library_data.error = error_sum;
    return output_library_data;
}

function codon_assignment_from_error_sequence( library, error_sequence )
{
    var codon_assignment = [];
    for ( var ii=0; ii < library.n_positions; ++ii ) {
        var ii_n_dcs = error_sequence[ ii ][ 0 ];
        var ii_error = error_sequence[ ii ][ 1 ];
        codon_assignment.push( library.codons_for_error_for_n_dcs[ ii ][ ii_n_dcs ][ ii_error ] );
    }
    return codon_assignment;
}

function report_output_library_data( library, error_sequence ) {
    var codon_assignmetn = codon_assignment_from_error_sequence( library, error_sequence );
    return report_output_library_data_from_codon_assignment( library, codon_assignment );
}


// Local Variables:
// js-indent-level: 4
// indent-tabs-mode: nil
// End:
