# MongoDB Export Large Reports (Node.js Library)

This Node.js library is designed to export millions of records from a MongoDB database. The library follows a multi-step process, starting with creating and inserting documents into the MongoDB database and then capturing the documents as a MongoDB stream, ultimately exporting them to a CSV file.

## Installation

To use this library, follow these steps:

1. Clone the repository to your local machine.

2. Install the required dependencies by running the following command:
   ```bash
   pnpm install
   ```
3. Run following commands
    ```bash
    npm run compile  
    npm run seed  // to create dummy csv file for demo purpose (optional)
    npm start // to insert records in db in batches
    ```

Set up your environment by creating a .env file with the necessary MongoDB connection URI. Make sure to define the DB_URI environment variable in this file.

## Usage
### Configuration
Before using the library, make sure to configure it properly:

- **\`FILE_NAME\`**: The name of the CSV file to which the data will be exported.
- **\`BATCH_SIZE\`**: The number of records to be inserted into MongoDB at once.

## Code Structure
The library uses the [**MongoDB Node.js driver**](https://mongodb.github.io/node-mongodb-native/) to connect to the MongoDB database.

The CSV data is read from the **FILE_NAME** file and transformed using a **CSVTOJSON** transformation stream. A very important transformation to read and tranform stream.

The transformed data is batched and inserted into the MongoDB collection 'users' within the 'mydb1' database. You can change the db and collection name according to the needs.

The library provides detailed logging of the data transformation and insertion process.

**seed.ts** file use to export the file into csv in order to insert into mongodb.

## License
This library is provided under the MIT License. Feel free to modify and use it according to your requirements.

## Author
This library is created and maintained by [**Neeraj Kumar**](https://github.com/neerajkumar161). For any questions or issues, please contact on email **ennkay161@gmail.com**.

## Acknowledgments
Special thanks to the [**MongoDB Node.js driver**](https://mongodb.github.io/node-mongodb-native/) and other libraries used in this project.