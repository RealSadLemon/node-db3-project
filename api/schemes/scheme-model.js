const db = require('../../data/db-config');

function find() { // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */
  return db('schemes')
    .leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
    .groupBy('schemes.scheme_id')
    .select('schemes.*')
    .count('steps.step_id as number_of_steps')
}

async function findById(scheme_id) { // EXERCISE B
  const stepsArr = await db('schemes')
    .where('schemes.scheme_id', scheme_id)
    .leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
    .select('schemes.scheme_name', 'schemes.scheme_id as scheme_id', 'steps.scheme_id as scheme_id', 'steps.*')
    .orderBy('steps.step_number', 'asc')
    
    const result = {
      scheme_name: stepsArr[0].scheme_name,
      scheme_id: stepsArr[0].scheme_id || scheme_id[0],
      steps: stepsArr
        .filter(step => step.step_id != null)
        .map(step => ({ step_id: step.step_id, step_number: step.step_number, instructions: step.instructions }))
    }
    return result; 
    
  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

      {
        "scheme_id": 1,
        "scheme_name": "World Domination",
        "steps": [
          {
            "step_id": 2,
            "step_number": 1,
            "instructions": "solve prime number theory"
          },
          {
            "step_id": 1,
            "step_number": 2,
            "instructions": "crack cyber security"
          },
          // etc
        ]
      }

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */
}

function findSteps(scheme_id) { // EXERCISE C
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
  return db('schemes')
    .where('schemes.scheme_id', scheme_id)
    .innerJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
    .select('schemes.scheme_name', 'schemes.scheme_id as scheme_id', 'steps.scheme_id as scheme_id', 'steps.*')
    .orderBy('steps.step_number', 'asc')
}

async function add(scheme) { // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
  const id = await db('schemes')
    .insert(scheme)
      
  return findById(id)
          
}

async function addStep(scheme_id, step) { // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
  const stepObj = {
    ...step,
    scheme_id: +scheme_id
  }

  return db('steps')
    .insert(stepObj)
    .then(somethin => {
      return findSteps(stepObj.scheme_id)
    })
      

}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
