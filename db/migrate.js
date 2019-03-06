const db = require('./index.js');

async function init() {
    await db.sync({
        alter: true,
        force: true
    });
}

async function migrate() {
    await init();
    process.exit(0);
    console.log('finished ...');
}

migrate().catch(console.log);
