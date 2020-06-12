'use strict';
var _ = require('lodash');
var fs = require('fs');

var getTables = async (knex, schema) => {
	return await knex
		.select('table_schema', 'table_name')
		.from('information_schema.tables')
		.where('table_schema', schema)
		.orderBy('table_name');
}

exports.toJSON = async (connection, schema, toExport) => {
	
	var knex = require('knex')({client: 'pg', connection: connection});
	var tables = await getTables(knex, schema);
	if (toExport.length != 0 || toExport != null || toExport != undefined ) {
  	var tables = tables.filter(table => toExport.indexOf(table.table_name) != -1)
	}
	var obj = {}
	return new Promise( (resolve,reject) => {
		 tables.forEach(async (table, idx) => {
			let rows = await knex.select('*').from(table.table_name);
			console.log(table.table_name);
			obj[table.table_name] = rows
			console.log(idx);
			if (idx === tables.length - 1){ 
				console.log("HERE")
				resolve(obj);
			}
		});
	});
}
