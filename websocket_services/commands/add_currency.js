module.exports = async ({services, socket, data}) => {
   services.user.addCurrency(data.type, data.amount);

   await services.user.save();

   socket.emit("profile", "CURRENCY_ADDED");
};
