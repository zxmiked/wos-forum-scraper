# WoS forum scraper

Considering the rapidly deteriorating situation in the Spectrum community around the World of Spectrum, it makes sense to
archive what we can in an effort to preserve the knowledge of the community. ZXDB, by Einar Saukas, preserves the catalogue
data, and can be browsed on https://spectrumcomputing.co.uk/

The WoS forums are prevented by robots.txt from being indexed in Google or archive.org. Which also means people are 
reliant on the WoS forum search to find anything, and that search has currently gone from dire to broken over the
past week.

This small project aims to preserve the content of the World of Spectrum forums, both to insure against the World of
Spectrum website being taken offline again, as well as a starting point to encourage the curation of useful material
into somewhere more publicly accessible and findable.

----

## Getting started

After cloning this repository:

    make install

And to kick off the scraper, and archive the entire forum:

    make load

Then when you want to make incremental archives of updated threads:

    make update

----

There are two scrapers. The first (`bin/scrape-thread-list.js`) scrapes the *Recent Discussion* list of threads and returns
a CSV file containing the details of each thread. The second scraper (`bin/scrape-thread.js`) scrapes an individual thread,
given it's starting URL, extracting both the orignal post and all the comments. Then there is the bash script 
`bin/scrape-threads.sh` takes the CSV generate by the first scraper and feeds them one at a time into the second scraper.
