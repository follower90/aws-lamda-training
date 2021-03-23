const responseSuccess = data => ({
	statusCode: 200,
	body: JSON.stringify(data)
});

module.exports = {
	responseSuccess
};