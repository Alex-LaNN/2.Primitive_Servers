
This API processes http input requests from the front and returns responses in JSON format.
To store various data, it is possible to select the type of database used in the '.env' file.

Database options available for use:
- 'memory' (use of regular variables);
- 'local' (data storage in the file system);
- 'mongo' (using the 'MongoDB' database locally);
The database selection is carried out in the '.env' file by specifying the value of the selected database, for example: 'DB_TYPE = mongo'.
Possible values for the selected database type used in the application are listed above.
By default (without specifying) the 'memory' database is used.

To run an application from Docker, you must have a '.env' file with the necessary parameters in it.
When running an application from Docker using a MongoDB database, you must:
1. In the '.env' file, uncomment the value 'URL_Mongo_DB_For_Docker'.
2. In the '.env' file, specify the names of your database in MongoDB in the 'Mongo_DB_NAME' variable of type "/name".
