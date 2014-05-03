var fs = require('fs');
var csv = require('csv');

const FIRST_ROUND_LINES = 5;

function run(second_round) {
    console.log(second_round ? "===Start Second Round===" : "===Start First Round===");

    var csv_stream = fs.createReadStream('test.csv');
    
    var parser = csv().from.stream(csv_stream, {columns: true});

        parser
        .transform(function(record, index, callback){
            process.nextTick(function(){
                if(second_round) {
                    //Read whole file
                    console.log(record);
                    callback(); 
                } else {
                    //Read first 5 lines
                    if(index < FIRST_ROUND_LINES) {
                        console.log(record);
                        callback();
                    } else {
                        parser.emit("end", index);
                    }
                }
            });
        }, {parallel: 1})

        parser
        .on('end',function(count){
            console.log("End with " + count + " records.");

            //Start second round
            if(!second_round){
                run(true);
            }
        })
        .on('error', function(error) {
            console.log('csv error', error);
        });
}

run(false);
