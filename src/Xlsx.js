const fs = require('fs');
const XlsxTemplate = require('xlsx-template');

function JSONtoXLSX(fileJSON){

    let obj = JSON.parse(fileJSON);
    let arrInterval = [];
    let jumlah = new Array(13)
    for(var j=0; j<13; j++){
        jumlah[j] = 0
    }

    for (var i=0; i<obj.data_survei.length; i++){
        var array = new Array(12);
        var total = 0
        for (j=0; j<obj.data_survei[i].data.length; j++){
            if(obj.data_survei[i].data[j].class === "sepeda_motor"){ array[0] = obj.data_survei[i].data[j].count; total = total + obj.data_survei[i].data[j].count; }
            if(obj.data_survei[i].data[j].class === "sedan_jeep_wagon"){ array[1] = obj.data_survei[i].data[j].count; total = total + obj.data_survei[i].data[j].count } 
            if(obj.data_survei[i].data[j].class === "angkutan_sedang"){ array[2] = obj.data_survei[i].data[j].count; total = total + obj.data_survei[i].data[j].count } 
            if(obj.data_survei[i].data[j].class === "pick-up_mikro_truk"){ array[3] = obj.data_survei[i].data[j].count; total = total + obj.data_survei[i].data[j].count } 
            if(obj.data_survei[i].data[j].class === "bus_kecil"){ array[4] = obj.data_survei[i].data[j].count; total = total + obj.data_survei[i].data[j].count } 
            if(obj.data_survei[i].data[j].class === "bus_besar"){ array[5] = obj.data_survei[i].data[j].count; total = total + obj.data_survei[i].data[j].count } 
            if(obj.data_survei[i].data[j].class === "truk_2_sumbu_4_roda"){ array[6] = obj.data_survei[i].data[j].count; total = total + obj.data_survei[i].data[j].count } 
            if(obj.data_survei[i].data[j].class === "truk_2_sumbu_6_roda"){ array[7] = obj.data_survei[i].data[j].count; total = total + obj.data_survei[i].data[j].count } 
            if(obj.data_survei[i].data[j].class === "truk_3_sumbu"){ array[8] = obj.data_survei[i].data[j].count; total = total + obj.data_survei[i].data[j].count } 
            if(obj.data_survei[i].data[j].class === "truk_gandeng"){ array[9] = obj.data_survei[i].data[j].count; total = total + obj.data_survei[i].data[j].count } 
            if(obj.data_survei[i].data[j].class === "truk_semitrailer"){ array[10] = obj.data_survei[i].data[j].count; total = total + obj.data_survei[i].data[j].count } 
            if(obj.data_survei[i].data[j].class === "tidak_bermotor"){ array[11] = obj.data_survei[i].data[j].count; total = total + obj.data_survei[i].data[j].count } 
        }
        for(j=0; j<12; j++){
            if(array[j] == null){ array[j] = 0 }
        }

        arrInterval.push({
            "interval": i+1,
            "data": array,
            "total": total
        })
    }

    for (i=0; i<arrInterval.length; i++){
        for(j=0; j<12; j++){
            jumlah[j] = jumlah[j] + arrInterval[i].data[j];
        }
        jumlah[12] = jumlah[12] + arrInterval[i].total
    }

    // Load an XLSX file into memory
    fs.readFile('template.xlsx', function(err, data) {

        if(err){
            throw err;
        }

        // Create a template
        var template = new XlsxTemplate(data);

        // Replacements take place on first sheet
        var sheetNumber = 1;


        // Set up some placeholder values matching the placeholders in the template
        var values = {
            obj: obj,
            data_survei: obj.data_survei,
            interval: arrInterval,
            jumlah: jumlah
        }

        // Perform substitution
        template.substitute(sheetNumber, values);


        // Get binary data
        var binaryData = template.generate();
        

        fs.writeFile("result.xlsx", binaryData, 'binary', (err) => { 
            if (err) { 
            console.log(err); 
            } 
        } );

        console.log("ok");

    })
}
export default JSONtoXLSX;