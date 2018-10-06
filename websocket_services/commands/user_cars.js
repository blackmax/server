module.exports = async ({data, db, socket, logger}) => {
	try {
		const payload = await db.users.findAll({
			attributes: ['id'],
			where: {token: data.token},
			include:[{
				model: db.cars
			}]
		});
		socket.emit("user_cars", payload.cars);
	} catch(e){
		logger.error(e.toString());
		socket.emit("error", e.toString());
	}
}