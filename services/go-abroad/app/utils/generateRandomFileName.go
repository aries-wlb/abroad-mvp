package utils

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

func GenerateRandomFileName() string {
	id := uuid.New()
	timestamp := time.Now().UnixNano()
	fileName := fmt.Sprintf("%s-%d", id.String(), timestamp)
	return fileName
}
