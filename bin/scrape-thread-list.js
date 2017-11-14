var Crawler = require('node-crawler/Crawler');
var crawler = Crawler.Crawler();
var startUrl = "https://worldofspectrum.org/forums/discussions/p1";
var baseUrl = "https://worldofspectrum.org/forums/discussions/p";


crawler
    .startUrl(startUrl)
    .follow(function(nextUrl, fromUrl) {
        return false;
        return nextUrl.startsWith(baseUrl);
    })
    .on('page', function(link, $page) {
        $page('table.DiscussionsTable tr').each(function() {
            var $row = $page(this);
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

            console.log(url);
            console.log("Title: " + title + " (" + commentsLen + ")");
            console.log("\tCategory: " + catTitle + " (" + catUrl + ")");
            console.log("\t" + createDate + "/" + updateDate);
        });
    });