FROM golang:1.20 as builder

WORKDIR /app
ENV GOPROXY=https://goproxy.cn,direct
ENV CGO_ENABLED=0
COPY go.mod /app
COPY go.sum /app
RUN go mod download
RUN go install github.com/google/wire/cmd/wire@latest
COPY . /app

RUN wire gen ./app
RUN CGO_ENABLED=1 go build -ldflags "-s -w" -o /app/bin/app /app/app/cmd

FROM debian:12 as production
COPY --from=builder /app/bin/app /
CMD [ "/app" ]