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

To create an initial archive of the forum:

    make archive

Then when you want to make incremental update of the archive:

    make update


The initial archiving of the forum will take a little over 2 days to complete, and need about 1Gb of disk space. The task is restartable, and picks up where it left off (and retries previously failed scrapes, e.g. resulting from outages/errors on the World of Spectrum website). The subsequent updates depends on the amount of posting activity since the last update/archive was done.

----

There are two scrapers. The first (`bin/scrape-thread-list.js`) scrapes the *Recent Discussion* list of threads and returns
a CSV file containing the details of each thread. The second scraper (`bin/scrape-thread.js`) scrapes an individual thread,
given it's starting URL, extracting both the orignal post and all the comments. Then there is the bash script 
`bin/scrape-threads.sh` takes the CSV generate by the first scraper and feeds them one at a time into the second scraper.
