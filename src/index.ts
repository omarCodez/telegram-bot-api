import express from "express"
import TelegramBot, { Message } from "node-telegram-bot-api"

interface UserName {
  firstName: string
  lastName: string
}

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 5000
const baseUrl = `/api/v1/bot`

const telegramToken = `6458448932:AAHWKZiUp05ScxCM1TtRLF57aJULGuNL8ko`

const bot = new TelegramBot(telegramToken, {
  //   baseApiUrl: baseUrl,
  polling: true,
})

let userNames: { [chatId: number]: UserName } = {}

// TODO: Define /echo
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   const chatId = msg.chat.id

//   const resp = match && match[1]

//   bot.sendMessage(chatId, resp as string)
//   console.log("Message Sent Now")
// })

export const prompts = [
  {
    question: "Which Class are you in?",
    response: [
      { value: "Primary 1", text: "Primary 1" },
      { value: "Primary 2", text: "Primary 2" },
      { value: "Primary 3", text: "Primary 3" },
      { value: "Primary 4", text: "Primary 4" },
      { value: "Primary 5", text: "Primary 5" },
      { value: "Primary 6", text: "Primary 6" },
      { value: "JSS 1", text: "JSS 1" },
      { value: "JSS 2", text: "JSS 2" },
      { value: "JSS 3", text: "JSS 3" },
      { value: "SSS 1", text: "SSS 1" },
      { value: "SSS 2", text: "SSS 2" },
      { value: "SSS 3", text: "SSS 3" },
    ],
  },
  // {
  //   question: "Would you like to Access the Study Pack for Your Class?"
  // }
]

const userResponses: { [chatId: number]: string } = {}

bot.onText(/start/i, (msg) => {
  const chatId = msg.chat.id

  const welcomeMessage = `
    Hi! I am the OEQA_LAGOS_CHATBOT,
It's my Pleasure To Assist You.

What is your First and Last Name?
    `

  // bot.sendMessage(chatId, welcomeMessage)

  prompts.map((prompt) => {
    bot.sendMessage(chatId, prompt.question)
  })
})

bot.on("message", (msg: Message) => {
  const chatId = msg.chat.id
  const text = msg.text

  // TODO: Check if the user has an active session
  if (userResponses[chatId]) {
    // Find the users current prompt
    const currentUserPropmt = prompts.find(
      (prompt) => prompt.question === userResponses[chatId]
    )

    // Store the user's response.
    if (currentUserPropmt) {
      const matchedResponse = currentUserPropmt.response.find(
        (resp) => resp.text.toLowerCase() === text?.toLowerCase()
      )

      if (matchedResponse) {
        userResponses[chatId] = matchedResponse.value
        bot.sendMessage(chatId, `You Selected ${matchedResponse.text}`)
      } else {
        bot.sendMessage(chatId, "Please Select a Valid Response")
      }
    }
  } else {
    bot.sendMessage(chatId, `You Said ${text}`)
  }
})

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`)
})
