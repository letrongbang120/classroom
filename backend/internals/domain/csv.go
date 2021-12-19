package domain

import (
	"encoding/csv"
	"fmt"
	"io"
)

type Csv interface {
	ReadData(r io.Reader) ([][]string, error)
}

type csvDomain struct{}

func NewCsvDomain() Csv {
	return &csvDomain{}
}

func (c *csvDomain) ReadData(r io.Reader) ([][]string, error) {
	// parse POST body as csv
	reader := csv.NewReader(r)
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
			return [][]string{}, err
		}

		// add record to result set
		if len(record) > 1 {
			results = append(results, record)
		}
	}
	return results, nil
}
