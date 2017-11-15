var Crawler = require('node-crawler/Crawler');
var csvWriter = require('csv-write-stream');
var fs = require('fs');

var crawler = Crawler.Crawler();

var startUrl = "https://worldofspectrum.org/forums/discussions/p1";
var baseUrl = "https://worldofspectrum.org/forums/discussions/p";

var args = process.argv.slice(2);
var csvFile = (args.length) ? args[0] : '../threads.csv';
var threadData = [];

crawler
    .startUrl(startUrl)
    .follow(function(nextUrl, fromUrl) {
        return false;
        return nextUrl.startsWith(baseUrl);
    })
    .on('page', function(link, $page) {
        $page('table.DiscussionsTable tr.ItemDiscussion').each(function() {
            var $row = $page(this);
            var id = $row.attr('id').substring(11);
            var $link = $page('td.DiscussionName a.Title', $row);
            var url = $link.attr('href');
            var title = $link.text();
            var $catLink = $page('td.DiscussionName span.Category a', $row);
            var catTitle = $catLink.text();
            var catUrl = "https:" + $catLink.attr('href');
            var $startTime = $page('td.FirstUser a.CommentDate time', $row);
            var createDate = $startTime.attr('datetime');
            var commentsLen = $page('td.CountComments span.Number', $row).text();
            var $endTime = $page('td.LastUser a.CommentDate time', $row);
            var updateDate = $endTime.attr('datetime');

            //console.log(url);
            //console.log("Title: " + title + " (" + commentsLen + ")");
            //console.log("\tCategory: " + catTitle + " (" + catUrl + ")");
            //console.log("\t" + createDate + "/" + updateDate);

            if (url) {
                var rowData = {
                    'id': parseInt(id, 10),
                    'link': url,
                    'title': title,
                    'category': catTitle,
                    'categoryLink': catUrl,
                    'createDate': createDate,
                    'updateDate': updateDate,
                    'comments': commentsLen
                };

                threadData.push(rowData);
            }
        });
    })
    .on('end', function() {
        var writer = csvWriter({sendHeaders: false});
        writer.pipe(fs.createWriteStream(csvFile));
        threadData.forEach(function(row) {
            writer.write(row);
        });
        writer.end();
    });
