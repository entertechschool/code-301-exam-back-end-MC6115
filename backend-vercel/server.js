const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB, disconnectDB } = require("./db");
const ItemModel = require('./models/item-model.js');

const express = require('express');
const cors = require('cors');
// const Data = require('./data');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/items', async (req, res) => {
	const items = await ItemModel.find({});
	res.status(200).json(items);
});
app.get('/items/:id', async (req, res) => {
	const id = req.params.id;
	const items = await ItemModel.find({ _id: id });
	res.status(200).json(items[0]);
});
app.post('/items', async (req, res, next) => {
	try {
		const data = req.body;
		const item = new ItemModel(data);
		await item.save();
		res.status(200).json(item);
	} catch (e) { next(e.message); }
});
app.delete('/items/:id', async (req, res) => {
	const id = req.params.id;
	await ItemModel.deleteOne({ _id: id });
	res.status(200).json('item deleted successfully' + id)
})

app.use('*', (req, res) => {
	res.status(404).send('These are not the droids you are looking for.');
});

app.use((error, req, res, next) => {
	res.status(500).send(`My Bad ... ${error.message}`);
});

connectDB();
process.on("SIGINT", async () => {
	await disconnectDB();
	process.exit(0);
});

module.exports = app;