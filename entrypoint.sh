#!/bin/sh

db_host_port=`echo $DATABASE_URL | sed 's/.*@//; s/\/.*//'`
db_host=`echo "$db_host_port" | awk -F: '{ print $1 }'`
db_port=`echo "$db_host_port" | awk -F: '{ print $2 }'`

echo "Waiting for postgres..."
while ! nc -z $db_host $db_port; do
    sleep 0.1
done
echo "PostgreSQL started"

if [ "$ENV" == "DEV" ]; then
    # ./manage.py flush --no-input
    ./manage.py migrate
    ./manage.py collectstatic --no-input --clear
fi

exec "$@"
