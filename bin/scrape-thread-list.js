var Crawler = require('node-crawler/Crawler');
var csvWriter = require('csv-write-stream');
var fs = require('fs');

var crawler = Crawler.Crawler();

var startUrl = "https://worldofspectrum.org/forums/discussions/p1";
var baseUrl = "https://worldofspectrum.org/forums/discussions/p";
var nextPage = 1;

var args = process.argv.slice(2);
var csvFile = (args.length) ? args[0] : 'threads.csv';

var latestUpdate = '';
var lastUpdateFile = 'var/lastUpdate.txt';
var isUpdateMode = (args.length > 1 && args[1] == 'update') ? true : false;
var sinceDate = '';

var threadData = [];

if (isUpdateMode) {
    sinceDate = fs.readFileSync(lastUpdateFile, 'utf8');
    console.log("Threads updated since: ", sinceDate);
}


crawler
    .startUrl(startUrl)
    .follow(function(nextUrl, fromUrl) {
        var pageNum;
        var followThis = false;
        if (nextUrl.startsWith(baseUrl)) {
            pageNum = parseInt(nextUrl.substring(baseUrl.length), 10);
            if (pageNum == nextPage + 1) {
                followThis = true;
                nextPage++;
            }
        }

        return followThis;
    })
    .on('page', function(link, $page) {
        var hasUpdates = false;

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

            //console.log(id, url);
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

				if (!isUpdateMode || updateDate > sinceDate) {
					threadData.push(rowData);
				}

                if (updateDate > latestUpdate) {
                    latestUpdate = updateDate;
                }

                if (updateDate > sinceDate) {
                    hasUpdates = true;
                }

            }

        });

        if (isUpdateMode && !hasUpdates && nextPage > 2) {
            console.log("Found all recent updates. STOPPING NOW.");
            crawler.stop();
        }
    })
    .on('end', function() {
        // Save the thread list file
        var writer = csvWriter({sendHeaders: false});
        writer.pipe(fs.createWriteStream(csvFile));
        threadData.forEach(function(row) {
            writer.write(row);
        });
        writer.end();

        // Save the lastUpdate
        fs.writeFile(lastUpdateFile, latestUpdate, function(err) {
            if (err) {
                return console.log(err);
            }

            console.log("Latest update: ", latestUpdate);
        });
    });
