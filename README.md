There are 2 components to configure in this setup.

1) the API project - to save data into a MySQL database
2) the WEB project - to do and complete the survey

--------------------------------------------------- 
----------------- the API project -----------------
---------------------------------------------------

1) go to the API/ folder
2) change the configurations under the "Configuration parameters" comments



--------------------------------------------------- 
----------------- the WEB project -----------------
---------------------------------------------------

---- Change configurations
1) go to the WEB/JS/ folder
2) change the config.js file
3) to turn off debugging, change "debugging_enabled" to "false"
4) to turn off save to database server feature, change "turnOnSaveToVentureEvolution" to "false"
5) IMPORTANT: ensure that "serverEndpoint" is pointing to the correct URL of the "API project" above
6) IF you have made a new language file, you can change "currentLanguage" to the name of the language file you have created. Remember to exclude ".ini" as it is not necessary

---- Change language file
1) you can create a new language file or modify the contents of the language file "en-us.ini" found in the WEB/LANGUAGE/ folder


---- Stages
1) IF you wish to create new stages or modify the stages, you can find the stages in the WEB/STAGES/ folder
2) REMEMBER: after adding new stages, do add the file name into the "stages" variable in WEB/JS/config.js. ALL stages are independent and have their own JS and HTML, do follow the existing stages as a sample to create new ones.
3) IMPORTANT: ALL centralized JS variables and functions can be found in the WEB/JS/table.js file