.PHONY: build
build:
	docker-compose build --pull image

.PHONY: run
run:
	docker-compose up --force-recreate server

.PHONY: stop
stop:
	docker-compose stop

.PHONY: clean
clean:
	docker-compose rm -f -s -v