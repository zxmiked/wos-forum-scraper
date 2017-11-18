
.PHONY: install archive update


update:
	node bin/scrape-thread-list.js var/threads-update.csv update
	bin/update-threads.sh

archive: var/threads.csv threads/
	bin/scrape-threads.sh
    
install: threads/ var/ node_modules/

var/threads.csv: var/
	node bin/scrape-thread-list.js var/threads.csv

threads/:
	mkdir threads

var/:
	mkdir var

node_modules/:
	npm install

