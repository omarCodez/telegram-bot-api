import express, { Express } from "express"
import TelegramBot, {
  KeyboardButton,
  Message,
  SendMessageOptions,
} from "node-telegram-bot-api"
import { prompts } from "./lib/prompt"
import dotenv from "dotenv"

type Username = {
  firstname: string
  lastname: string
}

export type PromptProps = {
  question: string
  response: {
    value: string
    text: string
  }[]
}

type UserSession = {
  currentStep: number
  data: SessionData
  responses: { value: string; text: string }[]
}

type SessionData = {
  currentPrompt?: PromptProps
}

// Response Actions
type ResponseAction = (chatId: number) => Promise<void>

const app: Express = express()

dotenv.config()

app.use(express.json())

// TODO: Install and setup `dotenv`
const PORT = process.env.PORT || 5001

const telegramBotToken =
  process.env.TELEGRAM_BOT_TOKEN ||
  `6458448932:AAHWKZiUp05ScxCM1TtRLF57aJULGuNL8ko`

const telegramBot = new TelegramBot(telegramBotToken, {
  polling: true,
})

let userName: { [chatId: number]: Username } = {}
let userResponses: { [chatId: number]: { value: string; text: string }[] } = {}
const userSession: Record<number, UserSession> = {}

// user options
let userClass
let subject
let altOpts
let pack: string = ""

const welcomeMessage = `
Instructions:
1. Read the Prompt carefully.
2. Reply with your chosen option.
3. Send 'hi' to start a conversation
4. Send '/start' to Restart From the Beginning.
5. Enjoy the conversation!
`

// ------------ Response Actions ---------------

const responseActions: Record<string, ResponseAction> = {
  Primary1: async (chatId: number) => {
    await telegramBot.sendMessage(chatId, "You selected Primary 1")
    await sendNextQuestion(chatId)
  },
  English: async (chatId: number) => {
    // Handle English option
    await telegramBot.sendMessage(chatId, "You selected English.")
  },
  Maths: async (chatId: number) => {
    // Handle Maths option
    await telegramBot.sendMessage(chatId, "You selected Maths.")
  },
  Science: async (chatId: number) => {
    // Handle Science option
    await telegramBot.sendMessage(chatId, "You selected Science.")
  },
  Biology: async (chatId: number) => {
    // Handle Biology option
    await telegramBot.sendMessage(chatId, "You selected Biology.")
  },
  // Add more response-action pairs as needed
}

// ------------ Response Actions End -----------

const sendNextQuestion = async (chatId: number): Promise<void> => {
  if (!userSession[chatId]) {
    userSession[chatId] = { currentStep: 0, data: {}, responses: [] }
  }

  const session = userSession[chatId]

  const finalMessage = `
Thanks ${userName[chatId]?.firstname},

It was really nice talking to you.

I'm glad I could be of assistance Today!
Here's the Link to your Study Pack.`

  const promptIndex = session.currentStep

  if (promptIndex < prompts.length) {
    const currentPrompt = prompts[promptIndex]

    const options = currentPrompt.response.map((resp) => [{ text: resp.text }])

    const question = `${promptIndex + 1} - ${currentPrompt.question}`

    session.currentStep++
    session.data.currentPrompt = currentPrompt

    const replyMarkup = {
      keyboard: options,
      resize_keyboard: true,
    }

    await telegramBot.sendMessage(chatId, question, {
      reply_markup: replyMarkup,
    })
  } else {
    // prompts completed
    delete userResponses[chatId] // is this correct / necessary?

    await telegramBot.sendMessage(chatId, finalMessage, {
      reply_markup: {
        keyboard: [],
        resize_keyboard: false,
        remove_keyboard: true,
      },
    })
    await sendPackLink(chatId)
  }
}

// Send study pack link
const sendPackLink = async (chatId: number): Promise<void> => {
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "Read Study Pack Online",
          url: pack,
        },
      ],
    ],
  }

  await telegramBot.sendMessage(
    chatId,
    `Click the Button  ⬇  to Download Your Pack!.`,
    {
      reply_markup: keyboard,
    }
  )
}

telegramBot.on("message", async (message) => {
  const chatId = message.chat.id
  const response = message.text

  const session = userSession[chatId]

  if (session && session.data.currentPrompt) {
    const selectedOption = session.data.currentPrompt.response.find(
      (resp) => resp.text === response
    )

    if (selectedOption) {
      console.log(userSession[chatId].currentStep)
      console.log(selectedOption)
      session.responses.push(selectedOption)

      // switch statements
      switch (session.currentStep === 1 && selectedOption.value) {
        case "Primary 1":
          pack =
            "https://oeqalagos.com/wp-content/uploads/2020/03/Year-1-Home-Learning-Pack.pdf-min.pdf"
          break
        case "Primary 2":
          pack =
            "https://oeqalagos.com/wp-content/uploads/2020/03/Year-2-Home-Learning-Pack.pdf-min.pdf"
          break
        case "Primary 3":
          pack =
            "https://oeqalagos.com/wp-content/uploads/2020/03/Year-3-Home-Learning-Pack.pdf-min.pdf"
          break
        case "Primary 4":
          pack =
            "https://oeqalagos.com/wp-content/uploads/2020/03/Year-4-Home-Learning-Pack.pdf-min.pdf"
          break
        case "Primary 5":
          pack =
            "https://oeqalagos.com/wp-content/uploads/2020/03/Year-5-Home-Learning-Pack-.pdf-min.pdf"
          break
        case "Primary 6":
          pack =
            "https://oeqalagos.com/wp-content/uploads/2020/03/Year-6-Home-Learning-Pack-min.pdf"
          break
        default:
          pack = "https://oeqalagos.com/"
      }

      switch (session.currentStep === 4 && selectedOption.value) {
        case "Waec Prep Kit":
          pack =
            "https://oeqalagos.com/wp-content/uploads/2020/04/waec-prep-kit-min.pdf"
          break
        case "Tips for Virtual Education":
          pack =
            "https://oeqalagos.com/wp-content/uploads/2020/04/Tips-for-Virtual-Education-min.pdf"
          break
        default:
          pack = "https://oeqalagos.com/"
      }

      if (session.currentStep === 2 && selectedOption.text === "No") {
        session.currentStep += 1

        const currentPrompt = prompts[session.currentStep]
        
        const options = currentPrompt.response.map((resp) => [{ text: resp.text }])
        
        const question = `${session.currentStep + 1} - ${currentPrompt.question}`

        const replyMarkup = {
          keyboard: options,
          resize_keyboard: true,
        }

        await telegramBot.sendMessage(chatId, question, {
          reply_markup: replyMarkup,
        })

        // await sendNextQuestion(chatId)
      } else {
        await sendNextQuestion(chatId)
      }
    } else {
      await telegramBot.sendMessage(
        chatId,
        `
      Invalid Response.
      
      Please select a valid response.`
      )
    }
  }

  // If there is a current Prompt
})

const captureUserName = async (chatId: number) => {
  // Capture response
  await telegramBot.sendMessage(chatId, `What is your First and Last Name?`)
  telegramBot.once("message", async (responseMsg) => {
    const names = responseMsg.text

    if (names) {
      const [firstname, lastname] = names.split(" ", 2)

      userName[chatId] = {
        firstname,
        lastname,
      }

      await telegramBot.sendMessage(
        chatId,
        `
      Welcome! ${firstname}`
      )

      await sendNextQuestion(chatId)
    } else {
      await telegramBot.sendMessage(chatId, "Enter Your Names to Proceed!.")
      captureUserName(chatId) // Re-capture user's name if not provided
    }
  })
}

// restart
telegramBot.onText(/\/start/i, async (message) => {
  const chatId = message.chat.id

  userSession[chatId] = { currentStep: 0, data: {}, responses: [] }
  userResponses[chatId] = []
  delete userName[chatId]

  await telegramBot.sendMessage(chatId, welcomeMessage)

  captureUserName(chatId)
})

// Start Server
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`)
})
