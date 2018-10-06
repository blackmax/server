module.exports = async ({data, db, socket, logger}) => {
	try {
		const payload = await db.users.findOne({
			attributes: ['id'],
			where: {token: data.token},
			include:[{
				model: db.cars,
				attributes: ["id", "class", "name"]
			}]
		});
		socket.emit("user_cars", payload.cars);
	} catch(e){
		logger.error(e.toString());
		socket.emit("error", e.toString());
	}
}