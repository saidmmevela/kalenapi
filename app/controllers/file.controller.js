const uploadFolder = __basedir + '/uploads/';
const fs = require('fs');

exports.uploadFile = (req, res) => {
	console.log("uploadFile");
	//res.set('Access-Control-Allow-Origin','*'); 
	res.send("Service has been Inserted..!!");
}

exports.listAllFiles = (req, res) => {
	fs.readdir(uploadFolder, (err, files) => {
		res.send(files);
	})
}

exports.downloadFile = (req, res) => {
	var filename = req.params.filename;
	res.download(uploadFolder + filename); 
}

exports.readFiles = (req, res) => {
	var filename = uploadFolder + req.params.filename;
	fs.readFile(filename, (err, content) => {
		res.end(content);
	})
}
