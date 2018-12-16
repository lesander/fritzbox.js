const options = {
	"protocol": process.env.PROTOCOL,
	"server": process.env.FRITZ_HOSTNAME,
	"username": process.env.FRITZ_USERNAME,
	"password": process.env.FRITZ_PASSWORD,
	"callmonitorport": process.env.CALLMONITOR_PORT,
	"debug": process.env.FRITZ_DEBUG
}
module.exports = options
