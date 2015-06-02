/*

This script is intended for Venture Evolution Study

*/

//Fixed variables
var stagePath = "stages/";
var languagePath = "language/";
var stageCurrentStage = 0;
var competitorNumber = 0;

//Storage for data
var personal = [];
var mycompanydata = [];
var relatedBusiness = [];
var pointdata = [];
var attributedata = [];
var attributedataopp = [];
var attributeOrder = [];
var attributeSequence = [];
var attributeSequenceStage5 = [];
var companySequence = [];
var finalScale = [];
var languageReplacement = [];
var comparisonData = [];
var comparisonDataPair = [];


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
	$("#nextPage").empty();
	$("#nextPage").append('<span class="glyphicon glyphicon-cog next-rotation-animate"></span> Loading');
	stageCurrentStage++;
	runStage(stages[stageCurrentStage]);
}

function checkValueNotInPointData(searchValue){
	
	//console.log("point data length: " + pointdata.length);
	
	var tempArray = [];
	
	var ArrayMaxPoint = pointdata.length;
	
	var counter = 1;
	
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
		csv += "\n";
		csv += ",Width,Height\n";
		csv += "Box Size (in pixel),400,400\n\n";
		csv += "Similar Firm name:" + "," + "Order in which User Entered:" + "," + "Color Selected:" + ",,," + "Starting X position:" + "," + "Starting Y position:" + "," + "Final X position from center:" + "," + "Final Y position from center" + "\n";
		
		//print my company
		csv += mycompanydata[0] + "," + "0" + "," + "Black" + ",,," + "0,0,0,0\n";
		//print all pointdata
		for(var t1i = 0; t1i < pointdata.length; t1i++){
			var subJ = t1i + 1;
			csv += pointdata[t1i][0] + ","+ subJ + ",\"" + pointdata[t1i][1] + "\",,," + pointdata[t1i][2][0] + "," + pointdata[t1i][2][1] + "," + pointdata[t1i][3][0] + "," + pointdata[t1i][3][1] + "\n";
		}
		
		//Add spaces
		csv += "\n\n\n";
		
		//Stage 3B data
		csv += '\"Similar firms selected as competitors of My Company (firms selected as a competitors get a 1, firms not selected get 0)\"\n';
		debug("relatedBusiness: "+relatedBusiness);
        for(var t2i = 0; t2i < relatedBusiness.length; t2i++){
			csv += relatedBusiness[t2i][0] + "," + relatedBusiness[t2i][1] + "\n";
		}
		
		//Add spaces
		csv += "\n\n\n";
		
		//Attributes order of creation
		csv += "Below the order in which first pole of likeness dimensions were created by User\n";
		for(var t3i = 0; t3i < attributedata.length; t3i++){
			var subJ = t3i + 1;
			csv += attributedata[t3i] + "," + subJ + "\n";
		}
		
		//Showing selected attributes per company
		csv += "Below the order by which the first pole of the likeness dimensions were chosen by the User (by competitor)\n";
		
		//Create the competitor company header
		for(var t4i = 0; t4i < pointdata.length; t4i++){
			if(t4i == 0){
				//First column to be blank
				csv += ",";
			}
			//Append competitor name
			csv += pointdata[t4i][0] + ",";
			
			if(t4i == (pointdata.length-1)){
				csv += "\n";
			}
		}
		//Display the attributes
		for(var t5i = 0; t5i < attributedata.length; t5i++){
            
            //Add new line
            csv += attributedata[t5i] + ",";
            
            //check if attribute exist in pointdata
            for(var t5j = 0; t5j < pointdata.length; t5j++){
                
                debug("what is t5j: "+t5j);
                debug("pointdata[t5j][4]: "+pointdata[t5j][4]);
                
                //If exist add the index
                if((pointdata[t5j][4].indexOf(attributedata[t5i]) > -1) && (pointdata[t5j][4].length > 0)){
                    //Correcting the index +1
                    var subJ = pointdata[t5j][4].indexOf(attributedata[t5i]) + 1;
                    csv += subJ;
                }else{
                    csv += '\"Pole Not Chosen\"';
                }
                
                //IMPORTANT NOTE: "Pole did not exist yet" logic not created
                
                //Add new line if its the last company, else add comma
                if(t5j == pointdata.length - 1){
                    csv += "\n";
                }else{
                    csv += ",";
                }
            }   
		}
        
        //Add new
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
		for(var t6i = 0; t6i < pointdata.length; t6i++){
			
			if(t6i == 0){
				//First column to be blank
				csv += ",";
			}
			//Append competitor name
			csv += pointdata[t6i][0] + ",";
			
			if(t6i == (pointdata.length-1)){
                csv += "Ideal Future Self";
				csv += "\n";
			}
		}
		
		//Append content
		for(var t6j = 0; t6j < attributedata.length; t6j++){
			
			//Prepare the output array
			var output = [];
			
			//Get order of attribute
			var order = attributeOrder[t6j];
			
			//(1: will be used for order Original Attribute vs Opposite Attribute, 2: will be used for order Opposite Attribute vs Original Attribute)
			if(order == 1){
				output[0] = attributedata[t6j];
				output[1] = attributedataopp[t6j];
			}else if(order == 2){
				output[0] = attributedataopp[t6j];
				output[1] = attributedata[t6j];			
			}
			
			//Build the row data
			for(var t6k = 0; t6k <= pointdata.length; t6k++){
				
				//Append the attribute on the first column
				if(t6k == 0){
					csv += output[0] + ",";
				}
				
				//Append the finalScale[] data
				csv += finalScale[t6k][t6j] + ",";
				
				debug("outputAllDataCSVFile() - t6j-t6k loop - finalScale: "+finalScale[t6k][t6j]);
				
				//Append the opposite attribute on the last column
				if(t6k == pointdata.length){
					csv += output[1] + "\n";
				}
			}
			
		}
        
        //Add new lines
        csv += "\n\n\n";
        
        //Order of company Sequence
        csv += "Order in which firms were rated by User\n";
        for(var companySequenceCounter = 0; companySequenceCounter < companySequence.length; companySequenceCounter++){
            debug("companySequence[companySequenceCounter]: " + companySequence[companySequenceCounter]);
            debug("companySequence.length: "+companySequence.length);
            //if ideal future self
            if(parseInt(companySequence[companySequenceCounter]) == companySequence.length - 1){
                csv += "Ideal Future Self" + "," + companySequenceCounter + "\n";
            }else{
                csv += pointdata[parseInt(companySequence[companySequenceCounter])][0] + "," + companySequenceCounter + "\n";
            }
        }
        
        //Add new lines
        csv += "\n\n\n";
        
        //CONTINUE!!!
		
		debug("outputAllDataCSVFile() - csv: "+csv);
		
		$link.attr("href", 'data:Application/octet-stream,' + encodeURIComponent(csv))[0].click();
	});
	
}

function languageLoad(){

	debug("Language file loading..");
	debug("Generate URL..");
	var CurrentPageLocationURL = window.location.href;
	
	debug(CurrentPageLocationURL.substring(0, CurrentPageLocationURL.lastIndexOf("/") + 1) + languagePath + currentLanguage + ".ini");
	$.ajax({
		url: CurrentPageLocationURL.substring(0, CurrentPageLocationURL.lastIndexOf("/") + 1) + languagePath + currentLanguage + ".ini",
		dataType: "html",
		success: function(data){
		
					debug("Language file loaded");
					debug(data);
					tempReplacementLoader = $.csv.toArrays(data);
					
					debug("Language file pushed to array and loading to languageReplacement");
					//alert(tempReplacementLoader);
					
					for(var i = 0; i < tempReplacementLoader.length; i++){
						
						var tempReplacePointer = tempReplacementLoader[i][0];
						var tempReplaceValue = tempReplacementLoader[i][1];
						
						languageReplacement[tempReplacePointer] = tempReplaceValue;
						
					}
					
					//debug("languageLoad() Sample value S1P3: " + languageReplacement['S1P3']);
					
					debug(languageReplacement);
				},
		fail: function(){
					debug("Retrieval failed");
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
debug('Is language loading ok?');
window.onbeforeunload = function() { return languageReplacement['SYS1']; };
runStage(stages[stageCurrentStage]);