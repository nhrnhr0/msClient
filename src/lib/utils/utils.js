/*import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);*/

export function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
export const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);


export function dateCellFormatter(cell, formatterParams, onRendered){
    // input: 2022-05-19T16:18:38.644219+03:00
    // output: 19/05/2022 16:18:38
    let date = new Date(cell.getValue()).toLocaleString('he-IL');
    return date;
}


export function fastpivot(arr){ 
	"use strict";
	var obj={};
	if(typeof arr!="string" && arr.length>0){

		//get columns
		var thekeys = Object.keys(arr[0]);

		var temp={};

		//loop through columns
		thekeys.forEach(function(f){ 
			temp[f]={}; 
			temp[f]["_labels"]=[];
			temp[f]["_labelsdata"]=[]; 
			temp[f]["_data"]={}; 
		});

		//loop all rows and for each column, store values
		arr.forEach(function(f,i){
		    thekeys.forEach(function(a){
		        var value=f[a];
		        temp[a]["_data"][value]=(temp[a]["_data"][value] || 0)+1;
		        temp[a]["_labels"][value]=null;
		    });
		});

		//now reloop the columns to store unique values
		thekeys.forEach(function(f){
			for(var i in temp[f]["_data"]){
				temp[f]["_labelsdata"].push(temp[f]["_data"][i]);
			}
			temp[f]["_labels"]=Object.keys(temp[f]["_labels"]);
		});

		obj=temp;
	}
	return obj;
}
