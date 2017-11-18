
.PHONY: load install update


update:
	node bin/scrape-thread-list.js var/threads-update.csv update
	bin/update-threads.sh

load: var/threads.csv threads/
	bin/scrape-threads.sh
    
install: threads/ var/

var/threads.csv: var/
	node bin/scrape-thread-list.js var/threads.csv

threads/:
	mkdir threads

var/:
	mkdir var

