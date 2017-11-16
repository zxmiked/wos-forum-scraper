
.PHONY: load install

load: all-threads.csv
	bin/scrape-threads.sh
    
install: threads/

all-threads.csv:
	bin/scrape-thread-list.js all-threads.csv

threads/:
	mkdir threads

