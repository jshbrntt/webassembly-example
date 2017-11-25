.PHONY: image
image:
	docker-compose build --pull image

.PHONY: build
build:
	docker-compose run build

.PHONY: run
run:
	docker-compose up --force-recreate server

.PHONY: stop
stop:
	docker-compose stop

.PHONY: clean
clean:
	docker-compose rm -f -s -v