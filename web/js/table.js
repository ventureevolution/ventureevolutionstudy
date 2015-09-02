/*

This script is intended for Venture Evolution Study

*/

//Fixed variables
var stagePath = "stages/";
var languagePath = "language/";
var stageCurrentStage = 0;
var competitorNumber = 0;
var postRetryCounter = 5;
var postErrorHandler = '';
var postFinalOutcome = false;

//Storage for data
var sessionKey = '';
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
var stage7a1aspects = [];
var stage7a2aspects = [];
var stage7a3aspects = [];
var stage7baspects = [];
var stage7bTempMassStorage = [];
var stage7cActivities = [];
var stage7dData = [];
var stage8aData = [];
var stage8bData = [];
var stage8bTempMassStorage = [];
var stage8cData = [];

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
		    $("#tabling").html(data);
		});
	}else{
		$.get(stagePath + stageSelected, function(data){
		    $("#tabling").empty();
		    $("#tabling").html(data);
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
	
	for(var counter in pointdata){
		tempArray.push(pointdata[counter][0]);
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


//Generate random sequence array in which attributes will appear
function generateRandomSequenceArray(anArrayLength){
	
	var tempArray = new Array();
    //writing "var tempArray = [];" should be faster for code execution.
	
	debug("Stage6 - generateRandomSequenceArray: populate array");
	//Populate the array
	for(i = 0; i < anArrayLength; i++){
		tempArray.push(i);
	}
	
	debug("Stage6 - generateRandomSequenceArray shuffle array");
	for(j = anArrayLength - 1; j >= 0; j--){
		
		var tempValue, tempIndex;
		
		tempIndex = Math.floor(Math.random() * j);
		
		tempValue = tempArray[j];
		tempArray[j] = tempArray[tempIndex];
		tempArray[tempIndex] = tempValue;
		
	}
	
	debug("Stage6 - generateRandomSequenceArray shuffle array result: " + tempArray.join(","));
	
	return tempArray;
}

function createOutputCSVData(){
	
	var csv = "";
		
	//Extract personal[] data
	csv += "First Name: " + "," + '\"' + personal[0] + '\"' + "\n";
	csv += "Last Name: " + "," + '\"' + personal[1] + '\"' + "\n";
	csv += "Email: " + "," + '\"' + personal[2] + '\"' + "\n\n\n";
	
	//Extract mycompanydata[] data
	csv += "Company Name: " + "," + '\"' + mycompanydata[0] + '\"' + "\n\n\n";
	
	//Extract pointdata[] data
	//Add header for pointdata
	csv += "Below is the positioning data for each competitor: " + "\n\n";
	csv += "\n";
	csv += ",Width,Height\n";
	csv += "Box Size (in pixel),400,400\n\n";
	csv += "Similar Firm name:" + "," + "Order in which User Entered:" + "," + "Color Selected:" + ",,," + "Starting X position:" + "," + "Starting Y position:" + "," + "Final X position from center:" + "," + "Final Y position from center" + "\n";
	
	//print my company
	csv += '\"' + mycompanydata[0] + '\"' + "," + "0" + "," + "Black" + ",,," + "0,0,0,0\n";
	//print all pointdata
	for(var t1i = 0; t1i < pointdata.length; t1i++){
		var subJ = t1i + 1;
		csv += '\"' + pointdata[t1i][0] + '\"' + ",\""+ subJ + "\"," + '\"' + pointdata[t1i][1] + '\"' + ",,," + '\"' + pointdata[t1i][2][0] + '\"' + "," + '\"' + pointdata[t1i][2][1] + '\"' + "," + '\"' + pointdata[t1i][3][0] + '\"' + "," + '\"' + pointdata[t1i][3][1] + '\"' + "\n";
	}
	
	//Add spaces
	csv += "\n\n\n";
	
	//Stage 3B data
	csv += '\"Similar firms selected as competitors of My Company (firms selected as a competitors get a 1, firms not selected get 0)\"\n';
	debug("relatedBusiness: "+relatedBusiness);
    for(var t2i = 0; t2i < relatedBusiness.length; t2i++){
		csv += '\"' + relatedBusiness[t2i][0] + '\"' + "," + '\"' + relatedBusiness[t2i][1] + '\"' + "\n";
	}

	//Add spaces
	csv += "\n\n\n";
	
	//Attributes order of creation
	csv += "Below the order in which first pole of likeness dimensions were created by User\n";
	for(var t3i = 0; t3i < attributedata.length; t3i++){
		var subJ = t3i + 1;
		csv += '\"' + attributedata[t3i] + '\"' + "," + subJ + "\n";
	}
	
	//Add spaces
	csv += "\n\n\n";
	
	//Showing selected attributes per company
	csv += "Below the order by which the first pole of the likeness dimensions were chosen by the User (by competitor)\n";
	
	//Create the competitor company header
	for(var t4i = 0; t4i < pointdata.length; t4i++){
		if(t4i == 0){
			//First column to be blank
			csv += ",";
		}
		//Append competitor name
		csv += '\"' + pointdata[t4i][0] + '\"' + ",";
		
		if(t4i == (pointdata.length-1)){
			csv += "\n";
		}
	}
	//Display the attributes
	for(var t5i = 0; t5i < attributedata.length; t5i++){
        
        //Add new line
        csv += '\"' + attributedata[t5i] + '\"' + ",";
        
        //check if attribute exist in pointdata
        for(var t5j = 0; t5j < pointdata.length; t5j++){
            
            debug("what is t5j: "+t5j);
            debug("pointdata[t5j][4]: "+pointdata[t5j][4]);
            
            //If exist add the index
            if((pointdata[t5j][4].indexOf(attributedata[t5i]) > -1) && (pointdata[t5j][4].length > 0)){
                //Correcting the index +1
                var subJ = pointdata[t5j][4].indexOf(attributedata[t5i]) + 1;
                csv += '\"' + subJ + '\"';
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
	
	csv += "\"Below is the rating of the attribute polarity for each similar company (if a user selects N.A. because s/he thinks rating a company on that attribute polarity does NOT make sense, then input 9999)\"\n\n"
	
	var temppointdatalength = pointdata.length + 1;
	
	//Create the competitor company header
	for(var t6i = 0; t6i <= temppointdatalength; t6i++){
		
		if(t6i == 0){
			//First column to be blank
			csv += ",";
		}
		
		if(t6i == (temppointdatalength-1)){
            csv += '\"Ideal Future Self\",';
		}
		else if(t6i == temppointdatalength){
			csv += mycompanydata[0] + "\n";
		}
		else{
			//Append competitor name
			csv += '\"' + pointdata[t6i][0] + '\"' + ",";
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
		for(var t6k = 0; t6k <= temppointdatalength; t6k++){
			
			//Append the attribute on the first column
			if(t6k == 0){
				csv += '\"' + output[0] + '\"' + ",";
			}
			
			//Append the finalScale[] data
			csv += '\"' + finalScale[t6k][t6j] + '\"' + ",";
			
			debug("outputAllDataCSVFile() - t6j-t6k loop - finalScale: "+finalScale[t6k][t6j]);
			
			//Append the opposite attribute on the last column
			if(t6k == temppointdatalength){
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
		
		var tempprintcompanySequenceCounter = companySequenceCounter + 1;
        //if current self
        if(parseInt(companySequence[companySequenceCounter]) == companySequence.length - 1){
			debug("companySequence[companySequenceCounter]: "+companySequence[companySequenceCounter]);
            csv += mycompanydata[0] + "," + '\"' + tempprintcompanySequenceCounter + '\"' + "\n";
        }else if(parseInt(companySequence[companySequenceCounter]) == companySequence.length - 2){
			//if ideal future self
			debug("companySequence[companySequenceCounter]: "+companySequence[companySequenceCounter]);
            csv += "Ideal Future Self" + "," + '\"' + tempprintcompanySequenceCounter + '\"' + "\n";
        }else{
			debug("companySequence[companySequenceCounter]: "+companySequence[companySequenceCounter]);
            csv += '\"' + pointdata[parseInt(companySequence[companySequenceCounter])][0] + '\"' + "," + '\"' + tempprintcompanySequenceCounter + '\"' + "\n";
        }
    }
    
    //Add new lines
    csv += "\n\n\n";
    
    //Store First Set of Aspects
    csv += "First Set of Aspects in accordance to order of entry\n";
    csv += "Order,Aspect\n";
    for(var csvStage7a1Aspects in stage7a1aspects){
        debug("Storing 7a1 aspects no.: "+csvStage7a1Aspects);
        var csvStorageCounter = parseInt(csvStage7a1Aspects) + 1;
        
        csv += '\"' + csvStorageCounter + '\"' + "," + '\"' + stage7a1aspects[csvStage7a1Aspects] + '\"' + "\n";
        
    }
    
    //Add new lines
    csv += "\n\n\n";
    
    //Store Second Set of Aspects
    csv += "Second Set of Aspects in accordance to order of entry\n";
    csv += "Order,Aspect\n";
    for(var csvStage7a2Aspects in stage7a2aspects){
        debug("Storing 7a2 aspects no.: "+csvStage7a2Aspects);
        var csvStorageCounter = parseInt(csvStage7a2Aspects) + 1;
        
        csv += '\"' + csvStorageCounter + '\"' + "," + '\"' + stage7a2aspects[csvStage7a2Aspects] + '\"' + "\n";
        
    }
    
    //Add new lines
    csv += "\n\n\n";
    
    //Store Order of importance of aspects
    csv += "Order of importance of aspects according to user\n";
    csv += "Order,Aspect\n";
    for(var csvStage7a3Aspects in stage7a3aspects){
        debug("Storing 7a3 aspects no.: "+csvStage7a3Aspects);
        var csvStorageCounter = parseInt(csvStage7a3Aspects) + 1;
        
        csv += '\"' + csvStorageCounter + '\"' + "," + '\"' + stage7a3aspects[csvStage7a3Aspects] + '\"' + "\n";
        
    }
    
    //Add new lines
    csv += "\n\n\n";
    
    csv += "Differentiating Activities in accordance to aspects\n";
    csv += "Aspect,Differentiating Activities\n";
    for(var csvStage7bAspect in stage7baspects){
        debug("Storing 7b key: "+csvStage7bAspect);
        
        csv += '\"' + csvStage7bAspect + '\"' + ",";
        
        for(var csvSubCounterStage7bAspect in stage7baspects[csvStage7bAspect]){
        	if(csvSubCounterStage7bAspect == 0){
	        	csv += '\"' + stage7baspects[csvStage7bAspect][csvSubCounterStage7bAspect] + '\"' + "\n";
        	}else{
	        	csv += "," + '\"' + stage7baspects[csvStage7bAspect][csvSubCounterStage7bAspect] + '\"' + "\n";
        	}
	        
        }
    }
    
    //Add new lines
    csv += "\n\n\n";
    
    csv += "Activities selected\n";
    csv += "Activity,Selection Status\n";
    for(var csvStage7cActivities in stage7cActivities){
    
    	var csvCheckStage7cIfSelected = stage7cActivities[csvStage7cActivities][1];
    	
    	if(csvCheckStage7cIfSelected == 0){
        	csv += '\"' + stage7cActivities[csvStage7cActivities][0] + '\"' + ",Not Selected\n";
    	}else{
        	csv += '\"' + stage7cActivities[csvStage7cActivities][0] + '\"' + ",Selected\n";
    	}
    }
    
    //Add new lines
    csv += "\n\n\n";
    
    csv += "Level of certainty\n";
    csv += "Aspect,Question Number,Certainty\n";
    for(var csvStage7dCertainty in stage7dData){
        csv += '\"' + csvStage7dCertainty + '\"';
        for(csvSubCounterStage7d in stage7dData[csvStage7dCertainty]){
	        var subCounterUnit = parseInt(csvSubCounterStage7d) + 1;
		    csv += ',' + subCounterUnit + ',\"' + stage7dData[csvStage7dCertainty][csvSubCounterStage7d] + '\"\n';
        }
    }
    
    //Add new lines
    csv += "\n\n\n";
    
    csv += "Critical contributors and tasks for the company\n";
    csv += "Contributor,Task\n";
    for(var csvStage8aContributor in stage8aData){
        csv += '\"' + csvStage8aContributor + '\"';
        for(var csvSubCounterStage8aTask in stage8aData[csvStage8aContributor]){
	        csv += ',\"' + stage8aData[csvStage8aContributor][csvSubCounterStage8aTask] + '\"\n';
        }
    }
    
    
    //Add new lines
    csv += "\n\n\n";
    
    csv += "Describe overall allocation of task\n";
    csv += '\"' + stage8bData[0] + '\"\n';
    
    
    //Add new lines
    csv += "\n\n\n";
    
    csv += "Ranking of tasks\n";
    csv += "Rank,Task\n";
    for(var csvStage8cTask in stage8cData){
    
    	var csvCurrentStage8cRank = parseInt(csvStage8cTask);
    
        csv += csvCurrentStage8cRank + ',\"' + stage8cData[csvStage8cTask] + '\"\n';
    }
	
	return csv;
}

function initializeServer(){

	//If save to server is enabled, the session generator will run to retrieve a session
	if(turnOnSaveToVentureEvolution){
		$.ajax({
			async: false,
			type: 'GET',
			url: serverEndpoint + '?request=initialize',
			dataType: 'json',
			success: function(data){
				sessionKey = data.output;
			}
		});
	}
}

function postToServer(){

	//If save to server is enabled, the post to save data will be enabled
	if(turnOnSaveToVentureEvolution){
	
		//Generate CSV file
		var postCSVFileOutput = createOutputCSVData();
	
		//POST FILE
		$.ajax({
			async: false,
			type: 'POST',
			url:serverEndpoint + '?request=save',
			data: {secretKey: sessionKey, firstname: personal[0], company: mycompanydata[0], csv: postCSVFileOutput},
			dataType: 'json',
			success: function(data){
				if(data.result == "success"){
					postFinalOutcome = true;
				}else if(data.result == 'error'){
					//Retry up MAX retries if initialization fails
					if(data.code == '901'){
						if(postRetryCounter > 0){
							//try initializing again
							initializeServer();
							//try posting again
							postToServer();
							//Reduce the post retry counter
							postRetryCounter--;
						}else{
							postErrorHandler = data.output;
							debug("postToServer() error: "+ postErrorHandler);
						}
					}else{
						postErrorHandler = data.output;
						debug("postToServer() error: "+ postErrorHandler);
					}
				}
			},
			error: function(errorThrown){
				postErrorHandler = errorThrown;
				debug("postToServer() error: "+ postErrorHandler);
			}
		});
		
	}
}

function outputAllDataCSVFile(presentationDiv){
	
	debug("outputAllDataCSVFile() running");
	
	//Create the download button
	$(presentationDiv).append('<button class="btn btn-success" id="mainfeature-downloadLink">Download Results</button><a href="" id="mainfeature-dataLink" download="data.csv"></a>');
	
	var $link = $("#mainfeature-dataLink");
	
	$("#mainfeature-downloadLink").on("click", function(e) {
	
		debug("outputAllDataCSVFile() - test finalScale: "+JSON.stringify(finalScale));
		
		var OutputStream = createOutputCSVData();
                
		debug("outputAllDataCSVFile() - csv: "+OutputStream);
		
		$link.attr("href", 'data:Application/octet-stream,' + encodeURIComponent(OutputStream))[0].click();
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