source "config"

if [ ! "$(docker network ls | grep fileshare)" ]; then
  echo "Creating fileshare network ..."
  docker network create fileshare
else
  echo "fileshare network exists."
fi

if [ ! "$(docker container ls -a | grep fileshare-mysql)" ]; then
  echo "Creating fileshare-mysql..."
  	docker create --name fileshare-mysql --network fileshare \
		-p $MYSQL_FORWARD_PORT:3306 \
		-e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
		-e MYSQL_DATABASE=$MYSQL_DATABASE \
		mysql:8.0.35-debian
	docker start fileshare-mysql
else
  echo "starting fileshare-mysql"
	docker start fileshare-mysql
fi


if [ ! "$(docker container ls -a | grep fileshare-phpmyadmin)" ]; then
  echo "Creating fileshare-phpmyadmin..."
	docker create --name fileshare-phpmyadmin --network fileshare --link fileshare-mysql:db \
	-p $PHPMYADMIN_FORWARD_PORT:80 \
	phpmyadmin:latest
	docker start fileshare-phpmyadmin
else
  echo "starting fileshare-phpmyadmin"
	docker start fileshare-phpmyadmin
fi
