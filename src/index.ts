import express from "express"
import TelegramBot, { KeyboardButton, Message } from "node-telegram-bot-api"

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

// const webhookURL = `https://your-vercel-deployment-url.vercel.app/${telegramToken}`

// bot.setWebHook(webhookURL)

let userNames: { [chatId: number]: UserName } = {}

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
  {
    question: "Would you like to Access the Study Pack for Your Class?",
    response: [
      { value: "Yes", text: "Yes" },
      { value: "No", text: "No" },
    ],
  },
  {
    question: "Pick a Subject",
    response: [
      {
        value: "English",
        text: "English",
      },
      { value: "Maths", text: "Maths" },
      { value: "Science", text: "Science" },
      { value: "Biology", text: "Biology" },
    ],
  },
  {
    question: "How about any of these?",
    response: [
      { value: "Waec Prep Kit", text: "Waec Prep Kit" },
      {
        value: "Tips for Virtual Education",
        text: "Tips for Virtual Education",
      },
      {
        value: "Corona Virus - A Book for Children",
        text: "Corona Virus - A Book for Children // Corona is gone though.",
      },
    ],
  },
]

const userResponses: { [chatId: number]: string[] } = {}
const userSessions: { [chatId: number]: { currentStep: number; data: {} } } = {}

// handle send next question
const handleNextQuestion = async (chatId: number): Promise<void> => {
  try {
    // set the current session
    const session = userSessions[chatId]

    // set the current Prompt Index
    const promptIndex = session ? session.currentStep : 0

    // set the current user prompt to the user's valid responses length / 0 if otherwise
    // if not 0, send the next question. not the current (I believe that question must have been answered) one.

    // check if user already answered all questions / not
    if (promptIndex < prompts.length) {
      // set current prompt index
      const currentUserPrompt = prompts[promptIndex]

      const options = currentUserPrompt.response.map((resp) => [
        { text: resp.text },
      ])

      const question = `${promptIndex + 1}. ${currentUserPrompt.question}`

      // update the session count
      session.currentStep++

      // send message to User.
      await bot.sendMessage(chatId, question, {
        reply_markup: {
          keyboard: options,
          resize_keyboard: true,
        },
      })
    } else {
      // End Session
      delete userResponses[chatId]

      await bot.sendMessage(
        chatId,
        `
      Thanks! ${userNames[chatId].firstName},
      
      It was really nice talking to you.
      
      I'm glad I could be of assistance to you Today!.
      Bye, and Have a Nice Day.
      `
      )
    }
  } catch (error: any) {
    console.log("Error Occured")
  }
}

// send welcome Message
const welcomeMessage = `
Hi! 

WELCOME TO THE LAGOS STATE OFFICE OF EDUCATION QUALITY ASSURANCE

Lagos State Office of Education Quality Assurance was establish through an executive order on September 13th, 2013 and became operational on 2nd of March, 2015. Our Vision is Excellence In Education and Our Mission is to support and enhance improvement in the quality of educational provision outcomes for learners in all school below tertiary level. Competence, Dedication, Excellence, Integrity, Professionalism, Quality are our core values

I am the OEQA_LAGOS_CHATBOT,

It's my Pleasure To Assist You Today!.

What is your First and Last Name?
`

bot.onText(/hi/i, async (msg) => {
  const chatId = msg.chat.id

  const text = msg.text

  await bot.sendMessage(chatId, welcomeMessage)

  bot.once("message", async (msg) => {
    const response = msg.text

    if (response) {
      const [firstName, lastName] = response.split(" ", 2)

      userNames[chatId] = {
        firstName: firstName,
        lastName: lastName,
      }

      await bot.sendMessage(
        chatId,
        `
      Welcome! ${userNames[chatId].firstName}. Your Name has been saved.
      
      It's nice meeting you.`
      )

      // start asking Questions
      await handleNextQuestion(chatId)
    } else {
      await bot.sendMessage(
        chatId,
        `
      You have not yet entered your Names!.
      
      Kindly Provide your Names to proceed.`
      )
    }
  })
})

// TODO: Start a New Session
bot.onText(/\/restart/i, async (msg) => {
  const chatId = msg.chat.id

  // end ongoing session, If one exists
  if (userSessions[chatId]) {
    delete userSessions[chatId]
  }

  // start a new session
  userSessions[chatId] = { currentStep: 0, data: {} }

  // send welcome message
  await bot.sendMessage(chatId, welcomeMessage)

  // send questions --- Start From the Beginning.
  await handleNextQuestion(chatId)
})

// listen to all messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id

  const response = msg.text

  if (!userResponses[chatId]) {
    userResponses[chatId] = []
  }

  userResponses[chatId].push(response as string)

  await handleNextQuestion(chatId)
})

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`)
})
