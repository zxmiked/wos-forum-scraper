var Crawler = require('node-crawler/Crawler');
var crawler = Crawler.Crawler();

var threadUrl = "https://worldofspectrum.org/forums/discussion/52892/had-enough";
var nextPage = 1;
var thread;


crawler
    .startUrl(threadUrl)
    .follow(function(nextUrl, fromUrl) {
        return false;
        var pageNum;
        var followThis = false;

        if (nextUrl.startsWith(threadUrl + "/p")) {
            pageNum = parseInt(nextUrl.substring(threadUrl.length + 2), 10);
            if (pageNum == nextPage + 1) {
                followThis = true;
                nextPage++;
            }
        }

        return followThis;
    })
    .on('page', function(link, $page) {
        $page('div.ItemDiscussion').each(function() {
            var $discussion = $page(this);
            var title = $page('div.PageTitle h1').text().trim();
            var id = $discussion.attr('id').substring(11);

            var $authorLink = $page('span.Author a.PhotoWrap', $discussion);
            var authorName = $authorLink.attr('title');
            var authorUrl = crawler.normaliseUrl($authorLink.attr('href'), link.href);
            var $authorImg = $page('img', $authorLink);
            var authorImg = $authorImg.attr('src');

            var $meta = $page('div.DiscussionMeta', $discussion);
            var $createDate = $page('span.DateCreated time', $meta);
            var createDate = $createDate.attr('datetime');
            var $catLink = $page('span.Category a', $meta);
            var catUrl = $catLink.attr('href');
            var catTitle = $catLink.text();

            var $body = $page('div.Item-Body div.Message', $discussion);
            var body = $body.html().trim();
            var $signature = $page('div.Item-Body div.UserSignature', $discussion);
            var signature = $signature.html().trim();

            var post = {
                'dateCreated': createDate,
                'author': {
                    'name': authorName,
                    'profile': authorUrl,
                    'image': authorImg
                },
                'message': body,
                'signature': signature
            };

            thread = {
                'id': id,
                'title': title,
                'post': post,
                'category': {
                    'name': catTitle,
                    'link': catUrl
                },
                'comments': []
            };

            console.log(thread);
        });
    });

