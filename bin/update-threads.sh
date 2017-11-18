#!/usr/bin/env bash

THREAD_LIST="var/threads-update.csv"
COUNT=0

while read LINE; do
    let COUNT++
    FIELDS=(${LINE//,/ })
    THREAD_ID=${FIELDS[0]}
    THREAD_FILE="threads/${THREAD_ID}.json"

    THREAD_URL=${FIELDS[1]}
    echo "Retrieving: $THREAD_URL"
    node bin/scrape-thread.js $THREAD_URL $THREAD_FILE
done < $THREAD_LIST

echo "$COUNT threads updated."

