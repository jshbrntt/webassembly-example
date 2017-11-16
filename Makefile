.PHONY: build
build:
	docker-compose build --pull

.PHONY: run
run:
	docker-compose up --force-recreate

.PHONY: stop
stop:
	docker-compose stop

.PHONY: clean
clean:
	docker-compose rm -f -s -v