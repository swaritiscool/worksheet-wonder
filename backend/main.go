package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"google.golang.org/genai"
)

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}

type ClientMessage struct {
	Prompt string `json:"fin_send_prompt"`
}

var key string

func callGenAI(prompt string) string {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file: ", err.Error())
	}
	key = os.Getenv("GENAI_API_KEY")
	ctx := context.Background()

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  key,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		print(err.Error())
		return ""
	}

	result, err := client.Models.GenerateContent(
		ctx,
		"gemini-2.0-flash-lite",
		genai.Text(prompt),
		nil,
	)
	if err != nil {
		return err.Error()
	}
	if result == nil {
		return "Error: No result received from GenAI"
	}

	return result.Text()
}

func main() {
	http.HandleFunc("/", handleConn)
	fmt.Printf("Started server at :8080\n")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Printf("Error Encountered: %v\n", err)
		return
	}
}

func handleConn(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		println("Error upgrading connection: ", err)
	}

	defer conn.Close()

	for {
		msgType, message, err := conn.ReadMessage()
		println("Recieved: " + string(message))
		if err != nil {
			println("Error While Receiving Message: ", err)
		}

		var cmsg ClientMessage
		err = json.Unmarshal(message, &cmsg)
		if err != nil {
			println("Error Parsing ClientMessage: ", err.Error())
			break
		}
		cmsg.Prompt += "\n Please keep all units in reference to Indian system unless specified otherwise. This means INR, Litres, Kg, Meters, etc."
		cmsg.Prompt += "\n If unspecified, generate worksheets based on the CBSE (India) System (Board)."
		cmsg.Prompt += "\n If the worksheet is based on some other topic other than academics, focus on the content more and figure out what is needed.."
		response := callGenAI(cmsg.Prompt)

		conn.WriteMessage(msgType, []byte(response))
	}
}
