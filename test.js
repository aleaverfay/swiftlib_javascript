

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
    var dg = {};

    function init( dg ) {
        dg.pos = [ [ false, false, false, false ], [ false, false, false, false ], [ false, false, false, false ]  ] ;
	dg.which = [ [], [], [] ];
        dg.count_pos = [ 0, 0, 0 ];
	dg.degenerate_base_names = {
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
    init( dg );

    dg.set_pos = function ( codon_pos, base ) {
        if ( ! this.pos[ codon_pos ][ base ] ) {
	    this.which[ codon_pos ].push( base );
            this.pos[ codon_pos ][ base ] = true;
            this.count_pos[ codon_pos ] += 1;
	}
    };

    dg.reset = function() {
        for ( var i = 0; i < 3; ++i ) {
            this.which[i].length = 0;
            this.count_pos[i] = 0;
            for ( var j=0; j < 4; ++j ) {
		this.pos[i][j] = false;
	    }
	}
    };

    dg.log_diversity = function () {
        for ( var i=0; i < 3; ++i ) {
	    if ( this.count_pos[i] != 0 ) {
		return -1;
	    }
	}
        var ld = 0.0;
        for ( var i=0; i < 3; ++i ) {
	    ld += Math.log( this.count_pos[i] );
	}
        return ld;
    };

    dg.index_from_lex = function( lex ) {
	// Get the index for a particular codon using a lexicographical iterator
	// that's dimensioned from this.count_pos
	var codon_index = 0;
	for ( var i=0; i < 3; ++i ) {
	    codon_index = codon_index * 4 + this.which[i][lex.pos[i]];
	}
	return codon_index;
    };

    dg.set_from_lex = function ( lex ) {
        // Set the state for this degenerate codon using a lex that's iterating over all 2**4**3 = 4096 codon options.
        // Returns false if this is not a reasonable assignment; i.e. not all codon positions contain at least one base.
        for ( var i=0; i < 3; ++i ) {
            if ( lex.pos[i] == 0 ) {
		return false;
	    }
	}

        this.reset();
	for ( var i=0; i < 3; ++i ) {
	    posi = lex.pos[i];
            sigdig = 8;
            for ( var j=0; j < 4; ++j ) {
                if ( Math.floor( posi / sigdig ) != 0 ) {
                    this.set_pos( i, 3-j ); // so A = 0 and T = 3
		}
                posi = posi % sigdig;
                sigdig = Math.floor( sigdig / 2 );
	    }
	}
        return true;
    }
}


var lex = LexicographicalIterator( [ 2, 3, 3 ] );
var count = 0;
//var lex = { pos : [ 0, 0, 0 ], at_end : false, increment : function() { alert( "w00t") ; } };

function overwrite() {
    if ( count === 0 ) {
	lex.increment();
	//alert( lex.size );
	document.getElementById( "blah" ).innerHTML = [ lex.pos[0], ", ", lex.pos[1], ",", lex.pos[2] ].join("");
	count += 1;
    } else {
	lex.set_from_index( 15 );
	document.getElementById( "blah" ).innerHTML = [ lex.pos[0], ", ", lex.pos[1], ",", lex.pos[2] ].join("");
    }
}

