var fs = require("fs");
eval(fs.readFileSync('js/app/table_input.js', 'utf8'));
eval(fs.readFileSync('js/app/opt_deg_codons.js', 'utf8'));

//First argument is CSV of desired codons
var csv_string = fs.readFileSync(process.argv[2], 'utf8');

//remove trailing newline
csv_string = csv_string.substring(0, csv_string.lastIndexOf("\n"));

//the second command line argument is a 'mode':
//1 sets swiftlib max diversity to an order magnitude less than AA diversity
//2 sets swiftlib max diversity equal to AA diversity
//3 sets swiftlib max diversity to an order magnitude more than AA diversity

//get the last line from the CSV string, it is the total AA diversity
var aa_diversity = parseInt(csv_string.substring(csv_string.lastIndexOf("\n")));
var mode = process.argv[3];
var libsize_upper_val = 0;
if(mode == 1){
    libsize_upper_val = parseInt(aa_diversity / 10);
} else if(mode == 2){
    libsize_upper_val = aa_diversity;
}
else if(mode == 3){
    libsize_upper_val = aa_diversity * 10;
}
else {
    console.log("Invalid mode flag "+mode);
    process.exit(1);
}


//remove the last line from the CSV string
csv_string = csv_string.substring(0, csv_string.lastIndexOf("\n"));

//var libsize_upper_val = 1e8;
var starttime = new Date().getTime();
var library = AALibrary();

//3rd arugment is max oligos
library.max_oligos_total = process.argv[4];
library.load_library( csv_string );
library.compute_smallest_diversity_for_all_errors();
library.find_positions_wo_viable_solutions();
var starttime2 = new Date().getTime();
library.optimize_library( libsize_upper_val, 1 );
var error_list = [ library.find_minimal_error_beneath_diversity_cap( libsize_upper_val ) ];
var stoptime = new Date().getTime();
//console.log(library.n_positions);
//console.log(error_list)
console.log(process.argv[2]+" "+library.n_positions+" "+libsize_upper_val+" "+error_list[0][2]+" "+( stoptime - starttime ) / 1000+" "+( stoptime - starttime2 ) / 1000);

