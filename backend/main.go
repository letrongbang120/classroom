// package main

// import (
// 	"fmt"
// 	"sync"
// 	"time"
// )

// func producer(num int) <-chan int {
// 	out := make(chan int)
// 	go func() {
// 		defer close(out)
// 		for i := 1; i <= num; i++ {
// 			out <- i
// 		}
// 	}()
// 	return out
// }

// func square(ch <-chan int) <-chan int {
// 	out := make(chan int)
// 	go func() {
// 		defer close(out)
// 		for i := range ch {
// 			time.Sleep(1 * time.Millisecond)
// 			out <- i * i
// 		}
// 	}()
// 	return out
// }

// func merge(chs []<-chan int) <-chan int {
// 	out := make(chan int)
// 	wg := sync.WaitGroup{}
// 	collect := func(ch <-chan int) {
// 		for i := range ch {
// 			out <- i
// 		}
// 		wg.Done()
// 	}
// 	for _, ch := range chs {
// 		wg.Add(1)
// 		go collect(ch)
// 	}
// 	go func() {
// 		wg.Wait()
// 		defer close(out)
// 	}()
// 	return out
// }

// func main() {
// 	t := time.Now()
// 	in := producer(1000)

// 	// Fan out
// 	c1 := square(in)
// 	// c2 := square(in)
// 	// c3 := square(in)

// 	count := 0
// 	// consumer
// 	for ret := range merge([]<-chan int{c1}) {
// 		fmt.Printf("%v", ret)
// 		count++
// 	}
// 	fmt.Println("")
// 	fmt.Println(count)
// 	fmt.Println(time.Since(t).Seconds())
// }
package main

import (
	"fmt"
	"net/http"

	"google.golang.org/api/oauth2/v2"
)

func main() {
	token := "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ0ZTA2Y2ViMjJiMDFiZTU2YzIxM2M5ODU0MGFiNTYzYmZmNWE1OGMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNTIxMTU1MzA1MDAtZGRlcnZyM3U5cnRjc2l0ODcyMjdpNXQ0ODljYzAycjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1MjExNTUzMDUwMC1kZGVydnIzdTlydGNzaXQ4NzIyN2k1dDQ4OWNjMDJyOC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwNzIxNTMwMjAxMDAyODU1MTcyOCIsImVtYWlsIjoibGV0cm9uZ2JhbmcwMTAyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoicWE4Y2JLY2Zya25NU1kyZUotajJRdyIsIm5hbWUiOiJC4bqxbmcgTMOqIFRy4buNbmciLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2o4TmZ0UlNiU0FVVGYySmNnU3diVmpEVks0cVUwZXRWdlFnTldyPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkLhurFuZyIsImZhbWlseV9uYW1lIjoiTMOqIFRy4buNbmciLCJsb2NhbGUiOiJ2aSIsImlhdCI6MTYzNzcyNDk2MiwiZXhwIjoxNjM3NzI4NTYyLCJqdGkiOiJjYTg2MmVhZjdkYjZlZTRkNDQ1M2UwMjhkNDNkYmIyN2JiMTc5NjlmIn0.OH0HOY1t3rHzZ4q6kOZoNySsZym7su5ei_QwRjxe9oZ7IrL9Zan-yiL9xYK8XFB9hjUk7F9u6oFNJ31WZRPEGQYpFOIOjT91zv5ejkzpbjDvlvYBX8Uo1ajQANyLCsvKSJHkJLFZg-qpoC-7u_Un7VMNwtADq2MHiLH4X5xTTDl0VIdlF80UJMU3VYLuh9HFoom9leBZIRKScRoyD5UIw3wRO2cPZslKmpHUVFZIZFB_jTXii4KzTLmHbKY22j5cpGsv-X254INPWS9emYTVWmtTQAPACj8tt_nMhStIkmsxHAbsgqgB-6re8o1OWGIOQAEo28X64A4RtliEOmoNsQ"
	fmt.Println(verifyIdToken(token))
}

var httpClient = &http.Client{}

func verifyIdToken(idToken string) (*oauth2.Tokeninfo, error) {
	oauth2Service, err := oauth2.New(httpClient)
	tokenInfoCall := oauth2Service.Tokeninfo()
	tokenInfoCall.IdToken(idToken)
	tokenInfo, err := tokenInfoCall.Do()
	if err != nil {
		return nil, err
	}
	return tokenInfo, nil
}
