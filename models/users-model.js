const db = require('../database/dbConfig.js')

module.exports = {
    getAll,
    add,
    findById,
    findBy
}

function getAll(){
    return db('users')
        .select('id', 'username', 'department')
}

async function add(user) {
    const [id] = await db('users').insert(user);
    return findById(id);
}

function findById(id) {
    return db('users')
      .select('id', 'username')
      .where({ id })
      .first();
}

function findBy(filter){
    return db('users').where(filter).first();
}