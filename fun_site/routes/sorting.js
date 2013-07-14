/*
 *	GET sorting page
 */

exports.index = function(req, res){
	res.render('sorting', {title: 'Getting Sorted'});
};