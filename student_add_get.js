const neo4j = require('neo4j-driver');

const uri = 'bolt://localhost:7687';  // Replace with your Neo4j URI
const username = 'neo4j';              // Replace with your Neo4j username
const password = 'password';           // Replace with your Neo4j password

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

async function saveStudent(name, mobileNumber) {
  const session = driver.session();

  try {
    const result = await session.run(
      'CREATE (s:Student {name: $name, mobileNumber: $mobileNumber}) RETURN s',
      { name, mobileNumber }
    );

    console.log('Student saved:', result.records[0].get('s').properties);
  } finally {
    session.close();
  }
}

async function getStudent(name) {
  const session = driver.session();

  try {
    const result = await session.run(
      'MATCH (s:Student {name: $name}) RETURN s',
      { name }
    );

    if (result.records.length > 0) {
      const student = result.records[0].get('s').properties;
      console.log('Retrieved student:', student);
    } else {
      console.log('Student not found.');
    }
  } finally {
    session.close();
  }
}

const name = 'John Doe';
const mobileNumber = '1234567890';

saveStudent(name, mobileNumber)
  .then(() => {
    console.log('Student saved successfully.');
    return getStudent(name);
  })
  .then(() => {
    console.log('Student retrieved successfully.');
    driver.close();
  })
  .catch((error) => {
    console.error('Error:', error);
    driver.close();
  });
