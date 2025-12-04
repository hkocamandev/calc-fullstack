package util

import (
	"fmt"
	"sync"
)

type Logger struct{}

var instance *Logger
var once sync.Once

func GetLogger() *Logger {
	once.Do(func() {
		instance = &Logger{}
	})
	return instance
}

func (l *Logger) Info(msg string) {
	fmt.Println("[INFO]", msg)
}

func (l *Logger) Error(msg string) {
	fmt.Println("[ERROR]", msg)
}
