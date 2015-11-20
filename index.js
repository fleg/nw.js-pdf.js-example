'use strict';

var fs = require('fs');

var pdfPath = './compressed.tracemonkey-pldi-09.pdf',
	data = new Uint8Array(fs.readFileSync(pdfPath));

document.addEventListener('DOMContentLoaded', function() {
	var pdfViewer = document.getElementById('pdf-viewer');

	PDFJS.getDocument(data).then(function (doc) {
		var numPages = doc.numPages;
		console.log('# Document Loaded');
		console.log('Number of Pages: ' + numPages);
		console.log();

		var lastPromise = Promise.resolve();
		var loadPage = function (pageNum) {
			return doc.getPage(pageNum).then(function(page) {
				console.log('# Page ' + pageNum);
				var viewport = page.getViewport(2.0);
				console.log('Size: ' + viewport.width + 'x' + viewport.height);
				console.log();

				var pageCanvas = document.createElement('canvas');
				pdfViewer.appendChild(pageCanvas);
				var context = pageCanvas.getContext('2d');
				pageCanvas.height = viewport.height;
				pageCanvas.width = viewport.width;
				page.render({
					canvasContext: context,
					viewport: viewport
				});
			});
		};

		for (var i = 1; i <= numPages; i++) {
			lastPromise = lastPromise.then(loadPage.bind(null, i));
		}
		return lastPromise;
	}).then(function () {
		console.log('# End of Document');
	}, function (err) {
		console.error('Error: ' + err);
	});
});
