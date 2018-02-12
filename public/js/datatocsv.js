/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Data to csv
 */
function ArraytoCsv(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }
    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';
    //Keys
    keys = Object.keys(data[0]);
    
    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
    
    data.forEach(function(item){
        ctr = 0;
        keys.forEach(function(key){
            if(ctr > 0) result += columnDelimiter;
            
            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });
    return result;
}

function downloadCSV(args){
    var data, filename, link;
    console.log(dbarray);
    var csv = ArraytoCsv({
        data: dbarray
    });
    if (csv == null) return;
    filename = args.filename || 'export.csv';
    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8, ' + csv;
    }
    data = encodeURI(csv);
    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}

