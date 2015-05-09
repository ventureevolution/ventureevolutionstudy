/*

This script is intended for Venture Evolution Study

*/

//Fixed variables
var stagePath = "stages/";
var languagePath = "language/";
var stageCurrentStage = 0;


//Storage for data
var personal = [];
var mycompanydata = [];
var pointdata = [];
var attributedata = [];
var attributedataopp = [];
var attributeOrder = [];
var attributeSequence = [];
var companySequence = [];
var finalScale = [];
var languageReplacement = [];


//Functions

function debug(data){

	if(debugging_enabled){
		console.log(data);
	}
}

function runStage(stageSelected){
	
	var stageDetermineMax = parseInt(stages.length) - 1 - stageCurrentStage;
	
	if(stageDetermineMax <= 0){
		$.get(stagePath + stages[stages.length - 1], function(data){
		    $("#tabling").empty();
		    $("#tabling").html("<script src='js/logics.js'></script>" + data);
		});
	}else{
		$.get(stagePath + stageSelected, function(data){
		    $("#tabling").empty();
		    $("#tabling").html("<script src='js/logics.js'></script>" + data);
		});
	}

}

function stageJump(){
	stageCurrentStage++;
	runStage(stages[stageCurrentStage]);
}

function checkValueNotInPointData(searchValue){
	
	//console.log("point data length: " + pointdata.length);
	
	var tempArray = [];
	
	var ArrayMaxPoint = pointdata.length;
	
	var counter = 0;
	
	while(counter < ArrayMaxPoint){
		tempArray.push(pointdata[counter][0]);
		counter++;
	}
	
	if(tempArray.indexOf(searchValue) >= 0){
		return false;
	}else{
		return true;
	}
}

function findSmallestPointData(tempPointData){
	
	debug("findSmallestPointData() running");
	
	debug("findSmallestPointData() - tempPointData/pointdata length: "+tempPointData.length);
	
	var smallestRefID = "";
	
	var loopCounter = 0;

	while(loopCounter < tempPointData.length){
		
		debug("findSmallestPointData() - loop running - smallestRefID: "+smallestRefID);
		
		if(smallestRefID === ""){
			//Take small reference to be point 0 if there is no reference yet
			smallestRefID = loopCounter;
			
			debug("findSmallestPointData() - loop empty clause - smallestRefID: "+smallestRefID);
			
		}else{
			//compare length of the existing point reference
			
			debug("findSmallestPointData() - loop NOT empty clause");
			
			//Step 1: Loop counter's length
			var tempLengthLC = Math.sqrt(tempPointData[loopCounter][3][0]*tempPointData[loopCounter][3][0] + tempPointData[loopCounter][3][1]*tempPointData[loopCounter][3][1]);
			
			debug("findSmallestPointData() - loop tempLengthLC: "+tempLengthLC);
			
			//Step 2: Small reference's length
			var tempLengthSR = Math.sqrt(tempPointData[smallestRefID][3][0]*tempPointData[smallestRefID][3][0] + tempPointData[smallestRefID][3][1]*tempPointData[smallestRefID][3][1]);
			
			debug("findSmallestPointData() - loop tempLengthSR: "+tempLengthSR);
			
			//Step 3: Compare replace small reference ID if necessary
			if(tempLengthLC < tempLengthSR){
				smallestRefID = loopCounter;
				
				debug("findSmallestPointData() - smallrefID: "+smallestRefID);
			}
		}
		//Loop toward the end of the point data
		loopCounter++;
	}
	
	return parseInt(smallestRefID);
}

function outputAllDataCSVFile(presentationDiv){
	
	debug("outputAllDataCSVFile() running");
	
	//Create the download button
	$(presentationDiv).append('<button class="btn btn-success" id="mainfeature-downloadLink">Download Results</button><a href="" id="mainfeature-dataLink" download="data.csv"></a>');
	
	var $link = $("#mainfeature-dataLink");
	
	$("#mainfeature-downloadLink").on("click", function(e) {
	
		debug("outputAllDataCSVFile() - test finalScale: "+JSON.stringify(finalScale));
		
		var csv = "";
		
		//Extract personal[] data
		csv += "First Name: " + "," + personal[0] + "\n";
		csv += "Last Name: " + "," + personal[1] + "\n";
		csv += "Email: " + "," + personal[2] + "\n\n\n";
		
		//Extract mycompanydata[] data
		csv += "Company Name: " + "," + mycompanydata[0] + "\n\n\n";
		
		//Extract pointdata[] data
		//Add header for pointdata
		csv += "Below is the positioning data for each competitor: " + "\n\n";
		csv += "Competitor name:" + "," + "Color Selected:" + "," + "Starting X position:" + "," + "Starting Y position:" + "," + "Final X position from center:" + "," + "Final Y position from center" + "\n";
		//print all pointdata
		for(var i = 0; i < pointdata.length; i++){
			csv += pointdata[i][0] + "," + pointdata[i][1] + "," + pointdata[i][2][0] + "," + pointdata[i][2][1] + "," + pointdata[i][3][0] + "," + pointdata[i][3][1] + "\n";
		}
		
		//Add spaces
		csv += "\n\n\n";
		
		//Extract attributedata[], attributedataopp[], attributeOrder[], finalScale[]
		//Expected layout/ outcome:
		//
		//
		//			company1	company2	company3
		//			+-----------------------------------+
		//	attr1	|			|			|			|	oppositeAttribute1
		//	attr2	|			|			|			|	oppositeAttribute2
		//	attr3	|			|			|			|	oppositeAttribute3
		//
		
		csv += "Below is the rating of the attribute polarity for each competitor company\n\n"
		
		//Create the competitor company header
		for(var i = 0; i < pointdata.length; i++){
			
			if(i == 0){
				//First column to be blank
				csv += ",";
			}
			//Append competitor name
			csv += pointdata[i][0] + ",";
			
			if(i == (pointdata.length-1)){
				csv += "\n";
			}
		}
		
		//Append content
		for(var j = 0; j < attributedata.length; j++){
			
			//Prepare the output array
			var output = [];
			
			//Get order of attribute
			var order = attributeOrder[j];
			
			//(1: will be used for order Original Attribute vs Opposite Attribute, 2: will be used for order Opposite Attribute vs Original Attribute)
			if(order == 1){
				output[0] = attributedata[j];
				output[1] = attributedataopp[j];
			}else if(order == 2){
				output[0] = attributedataopp[j];
				output[1] = attributedata[j];			
			}
			
			//Build the row data
			for(var k = 0; k < pointdata.length; k++){
				
				//Append the attribute on the first column
				if(k == 0){
					csv += output[0] + ",";
				}
				
				//Append the finalScale[] data
				csv += finalScale[k][j] + ",";
				
				debug("outputAllDataCSVFile() - j-k loop - finalScale: "+finalScale[k][j]);
				
				//Append the opposite attribute on the last column
				if(k == (pointdata.length -1)){
					csv += output[1] + "\n";
				}
			}
			
		}
		
		debug("outputAllDataCSVFile() - csv: "+csv);
		
		$link.attr("href", 'data:Application/octet-stream,' + encodeURIComponent(csv))[0].click();
	});
	
}

function languageLoad(){

	debug("Language file loading..");
	$.ajax({
		url: languagePath + currentLanguage + ".ini",
		success: function(data){
		
					tempReplacementLoader = $.csv.toArrays(data);
					
					//alert(tempReplacementLoader);
					
					for(var i = 0; i < tempReplacementLoader.length; i++){
						
						var tempReplacePointer = tempReplacementLoader[i][0];
						var tempReplaceValue = tempReplacementLoader[i][1];
						
						languageReplacement[tempReplacePointer] = tempReplaceValue;
						
					}
					
					//debug("languageLoad() Sample value S1P3: " + languageReplacement['S1P3']);
					
					debug(languageReplacement);
				},
		async: false
	});
}

function languageReplace(){
	
	var tempClassArray = document.getElementsByClassName('textreplace');
	
	var tempfillClassArray = [];
	
	var tempCounterLength = tempClassArray.length;
	
	for(var tempcounterI = 0; tempcounterI < tempCounterLength; tempcounterI++){
		
		tempfillClassArray.push(tempClassArray[tempcounterI].id);
		
	}
	
	for(var tempcounterJ = 0; tempcounterJ < tempCounterLength; tempcounterJ++){
		
		var tempIDholder = tempfillClassArray[tempcounterJ];
		
		debug("languageReplace() Temp counter ID: " + tempIDholder);
				
		if(languageReplacement[tempIDholder]){
			//Replace the div
			var tempReplaceString = languageReplacement[tempIDholder];
			var tempID = "#" + tempIDholder;
			
			debug("tempReplaceString: "+tempReplaceString);
			debug("tempID: "+tempID);
			
			$(tempID).replaceWith(tempReplaceString);

			debug("tempcounterI:" + tempcounterJ);
			debug("tempCounterLength:" + tempCounterLength);
		}
	}
}

//Initialisation
languageLoad();
window.onbeforeunload = function() { return languageReplacement['SYS1']; };
runStage(stages[stageCurrentStage]);