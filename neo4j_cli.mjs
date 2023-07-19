import neo4j from 'neo4j-driver';
import inquirer from 'inquirer';

const uri = 'bolt://localhost:7687';  // Replace with your Neo4j URI
const username = 'neo4j';              // Replace with your Neo4j username
const password = 'password';           // Replace with your Neo4j password

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

// Function to create a graph database
async function createDatabase(databaseName) {
  const session = driver.session();

  try {
    await session.run(`CREATE DATABASE ${databaseName}`);
    console.log(`Database '${databaseName}' created successfully.`);
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    session.close();
  }
}

// Function to list all graph databases
async function listDatabases() {
  const session = driver.session();

  try {
    const result = await session.run('SHOW DATABASES');
    const databases = result.records.map((record) => record.get('name'));

    console.log('Existing databases:');
    databases.forEach((database) => console.log(database));
  } catch (error) {
    console.error('Error listing databases:', error);
  } finally {
    session.close();
  }
}

// Function to switch to a different graph database
async function switchDatabase(databaseName) {
  const session = driver.session();

  try {
    await session.run(`USE ${databaseName}`);
    console.log(`Switched to database '${databaseName}'.`);
  } catch (error) {
    console.error('Error switching database:', error);
  } finally {
    session.close();
  }
}

// Function to run a Cypher query and display the result
async function runCypherQuery(query) {
  const session = driver.session();

  try {
    const result = await session.run(query);
    const records = result.records;

    if (records.length > 0) {
      console.log('Query result:');
      records.forEach((record) => console.log(record));
    } else {
      console.log('No results.');
    }
  } catch (error) {
    console.error('Error running query:', error);
  } finally {
    session.close();
  }
}

// Prompt user for CLI actions
function promptActions() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Select an action:',
        choices: ['Create Database', 'List Databases', 'Switch Database', 'Run Cypher Query', 'Exit'],
      },
    ])
    .then((answers) => {
      const selectedAction = answers.action;

      switch (selectedAction) {
        case 'Create Database':
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'databaseName',
                message: 'Enter the name for the new graph database:',
              },
            ])
            .then((answers) => {
              createDatabase(answers.databaseName)
                .then(() => {
                  promptActions();
                })
                .catch(() => {
                  promptActions();
                });
            });
          break;
        case 'List Databases':
          listDatabases()
            .then(() => {
              promptActions();
            })
            .catch(() => {
              promptActions();
            });
          break;
        case 'Switch Database':
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'databaseName',
                message: 'Enter the name of the database to switch to:',
              },
            ])
            .then((answers) => {
              switchDatabase(answers.databaseName)
                .then(() => {
                  promptActions();
                })
                .catch(() => {
                  promptActions();
                });
            });
          break;
        case 'Run Cypher Query':
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'query',
                message: 'Enter the Cypher query to run:',
              },
            ])
            .then((answers) => {
              runCypherQuery(answers.query)
                .then(() => {
                  promptActions();
                })
                .catch(() => {
                  promptActions();
                });
            });
          break;
        case 'Exit':
          console.log('Exiting CLI.');
          driver.close();
          break;
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      driver.close();
    });
}

// Start the CLI
promptActions();
