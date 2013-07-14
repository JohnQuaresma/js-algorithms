/*
 *	GET algorithm page
 */

exports.index = function(req, res){
	res.render('algorithms', {title: 'ALGORITHMS FTW!'});
};