import express from "express"
import TelegramBot, { KeyboardButton, Message } from "node-telegram-bot-api"
import { prompts } from "./prompt"

interface UserName {
  firstName: string
  lastName: string
}

interface PromptProps {
  question: string
  response: {
    value: string
    text: string
  }[]
}

interface SessionDataProps {
  currentPrompt?: PromptProps
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

const userResponses: { [chatId: number]: string[] } = {}
const userSessions: {
  [chatId: number]: { currentStep: number; data: SessionDataProps }
} = {}



// handle send next question
const handleNextQuestion = async (chatId: number): Promise<void> => {
  // set the current session
  const session = userSessions[chatId]
    ? userSessions[chatId]
    : {
        currentStep: 0,
        data: {},
      }

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
    session.data.currentPrompt = currentUserPrompt
  } else {
    // End Session
    delete userResponses[chatId]

    await bot.sendMessage(
      chatId,
      `
      Thanks! ${userNames[chatId].firstName},
      
      \nIt was really nice talking to you.
      
      \nI'm glad I could be of assistance to you Today!.
      \nBye, and Have a Nice Day.
      `
    )
  }
}

// send welcome Message
const welcomeMessage = `
Hi! 

WELCOME TO THE LAGOS STATE OFFICE OF EDUCATION QUALITY ASSURANCE

Lagos State Office of Education Quality Assurance was establish through an executive order on September 13th, 2013 and became operational on 2nd of March, 2015. Our Vision is Excellence In Education and Our Mission is to support and enhance improvement in the quality of educational provision outcomes for learners in all school below tertiary level. Competence, Dedication, Excellence, Integrity, Professionalism, Quality are our core values

I am the OEQA_LAGOS_CHATBOT,

It's my Pleasure To Assist You Today!.

Instructions:
1. Read the question carefully.
2. Reply with your chosen option.
3. Enjoy the conversation!

But First, I need Your Names to Personalise this experience.

What is your First and Last Name?
`

bot.onText(/hi/i, async (msg) => {
  const chatId = msg.chat.id

  const text = msg.text

  await bot.sendMessage(chatId, welcomeMessage)

  // await welcomeResponse.

  const [firstName, lastName] = text!.split(" ", 2)

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

      const [firstName, lastName] = text!.split(" ", 2)

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
    }

    await bot.sendMessage(
      chatId,
      `
      Welcome! ${userNames[chatId].firstName}. Your Name has been saved.
      
      It's nice meeting you.`
    )

    await handleNextQuestion(chatId)
  })

  // await handleNextQuestion(chatId)
})

// TODO: Start a New Session
bot.onText(/\/restart/i, async (msg) => {
  const chatId = msg.chat.id

  // end ongoing session, If one exists
  if (userSessions[chatId]) {
    console.log("deleted user session : ", userSessions[chatId])
    delete userSessions[chatId]
    // start a new session
    userSessions[chatId] = { currentStep: 0, data: {} }
  } else {
    // clear all sessions
    delete userSessions[chatId]
    userSessions[chatId] = { currentStep: 0, data: {} }
  }

  // send welcome message
  await bot.sendMessage(chatId, welcomeMessage)

  // fix the name here.
  const secondMessage = `
    Welcome!. 
    \nYour Name has been saved.
      
    \nIt's nice meeting you.`

  // await handleNextQuestion(chatId)
  bot.once("message", async (resposeMsg) => {
    const response = resposeMsg.text

    if (response) {
      const [firstName, lastName] = response.split(" ")

      userNames[chatId] = {
        firstName,
        lastName,
      }
    } else {
      console.log("Names not yet provided")
    }

    await bot.sendMessage(chatId, secondMessage)

    await handleNextQuestion(chatId)
  })
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
