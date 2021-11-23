package main

import (
	"fmt"
	"sync"
	"time"
)

func producer(num int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for i := 1; i <= num; i++ {
			out <- i
		}
	}()
	return out
}

func square(ch <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for i := range ch {
			time.Sleep(1 * time.Millisecond)
			out <- i * i
		}
	}()
	return out
}

func merge(chs []<-chan int) <-chan int {
	out := make(chan int)
	wg := sync.WaitGroup{}
	collect := func(ch <-chan int) {
		for i := range ch {
			out <- i
		}
		wg.Done()
	}
	for _, ch := range chs {
		wg.Add(1)
		go collect(ch)
	}
	go func() {
		wg.Wait()
		defer close(out)
	}()
	return out
}

func main() {
	t := time.Now()
	in := producer(1000)

	// Fan out
	c1 := square(in)
	// c2 := square(in)
	// c3 := square(in)

	count := 0
	// consumer
	for ret := range merge([]<-chan int{c1}) {
		fmt.Printf("%v", ret)
		count++
	}
	fmt.Println("")
	fmt.Println(count)
	fmt.Println(time.Since(t).Seconds())
}
