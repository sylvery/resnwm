var express 		=	require('express'),
		multer			= require('multer'),
		bodyParser 	= require('body-parser'),
		jimp				= require('jimp'),
		app					= express(),
		storage			= multer.diskStorage(
			{
				destination: function(req, res, callback) {
					callback(null, __dirname + '/public/tmp/')
				},
				filename: function (req, file, callback) {
					callback(null, file.originalname);
				}
			}),
		upload 			= multer({storage:storage}).single('image');//,
		// limits			= multer.limits({
		// 								fieldNameSize : 50,
		// 								fieldSize : 512,
		// 								fields : 5,
		// 								fileSize : 1024,
		// 								files : 1,
		// 								parts : 10,
		// 								headerPairs : 1000
		// 							});

var logo = new jimp('public/tmp/loop_watermark.png', function (err, img) {
	err ? console.log('logo err' + err) : console.log('logo created');
	return img.opacity(0.3);
});

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/canvas', function (req, res) {
	res.render('canvas');
});

app.post('/api/upload', function (req, res) {
	upload(req, res, function(err) {
		err ? console.log(err) :
			console.log(req.file);
			res.redirect('/api/watermark/'+req.file.originalname);
	})
});

app.get('/api/watermark/:filename', function (req, res) {
	var filename = req.params.filename;
	console.log(filename);
	jimp.read(__dirname + '/public/tmp/' + filename)
			.then(function (image) {
				image.clone()
					.resize(805,jimp.AUTO)
					.crop(0,0,805,450)
					.composite(logo, 25, 20)
					.write(__dirname + '/public/tmp/slider-01.jpg', function (err, success) { err ? console.log(err) : console.log('image resized and saved successfully\n'+success)});
			})
			.then(function() { res.redirect('/'); })
			.catch(function (err){
				console.log(err);
			});
})

app.set('views',__dirname + '/client/views');
app.set("view engine",'ejs');
app.use('/public', express.static(__dirname + '/public'))
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/ngClient', express.static(__dirname + '/client/js'))

// declarations and setup commands
app.use(bodyParser.json());
app.listen('3000');
console.log("go to localhost:3000");
exports = module.exports = app;