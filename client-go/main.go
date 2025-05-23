package main

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"math/rand"
	"net"
	"net/http"
	"os"
	"time"

	elizav1 "server-go/gen/connectrpc/eliza/v1"
	"server-go/gen/connectrpc/eliza/v1/elizav1connect"

	"connectrpc.com/connect"
	"golang.org/x/net/http2"
)

func main() {
	serverHost, ok := os.LookupEnv("SERVER_HOST")

	if !ok {
		serverHost = "localhost:8080"
	}

	for {
		time.Sleep(time.Duration(1) * time.Second)

		log.Println("Sending request to", serverHost)
		client := elizav1connect.NewElizaServiceClient(
			newInsecureClient(),
			fmt.Sprintf("http://%s", serverHost),
			connect.WithGRPC(),
		)

		res, err := client.Say(
			context.Background(),
			connect.NewRequest(&elizav1.SayRequest{Sentence: fmt.Sprintf("%d", rand.Int())}),
		)

		if err != nil {
			log.Println(err)
			continue
		}

		log.Println(res.Msg.Sentence)
	}
}

func newInsecureClient() *http.Client {
	return &http.Client{
		Transport: &http2.Transport{
			AllowHTTP: true,
			DialTLS: func(network, addr string, _ *tls.Config) (net.Conn, error) {
				// If you're also using this client for non-h2c traffic, you may want
				// to delegate to tls.Dial if the network isn't TCP or the addr isn't
				// in an allowlist.
				return net.Dial(network, addr)
			},
			// Don't forget timeouts!
		},
	}
}
