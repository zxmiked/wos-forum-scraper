#!/usr/bin/env bash

THREAD_FILE="all-threads.csv"
COUNT=0

while read LINE; do
    let COUNT++
    FIELDS=(${LINE//,/ })
    THREAD_ID=${FIELDS[0]}
    THREAD_FILE="threads/${THREAD_ID}.json"

    if [[ ! -f $THREAD_FILE ]]; then
        THREAD_URL=${FIELDS[1]}
        echo "Retrieving: $THREAD_URL"
        node bin/scrape-thread.js $THREAD_URL
    fi
done < $THREAD_FILE

echo "$COUNT lines read."

