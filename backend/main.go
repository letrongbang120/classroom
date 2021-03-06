package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"net/http"
)

func main() {
	http.HandleFunc("/csv", ReadCSVFromHttpRequest)
	http.ListenAndServe(":8080", nil)
}

func ReadCSVFromHttpRequest(w http.ResponseWriter, req *http.Request) {
	// parse POST body as csv
	reader := csv.NewReader(req.Body)
	reader.LazyQuotes = true
	reader.FieldsPerRecord = -1
	var results [][]string
	for {
		// read one row from csv
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			fmt.Println("err:: ", err)
			return
		}

		// add record to result set
		if len(record) > 1 {
		}
		results = append(results, record)
	}
	// fmt.Println(results)
}
