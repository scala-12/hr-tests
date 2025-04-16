import knex from 'knex';
import config from '../../knexfile';

const knexLib = knex(config.development);

export default knexLib;
