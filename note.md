/api/v1/bot/ - 1

<!-- code -->
const sendNextQuestion = async (chatId: number): Promise<void> => {
  if (!userSession[chatId]) {
    userSession[chatId] = { currentStep: 0, data: {} }
  }

  const session = userSession[chatId]

  const finalMessage = `
Thanks ${userName[chatId]!.firstname},

It was really nice talking to you.

I'm glad I could be of assistance Today!
Here's the Link to your Study Pack.`

  const promptIndex = session.currentStep

  if (promptIndex < prompts.length) {
    const currentPrompt = prompts[promptIndex]

    const options = currentPrompt.response.map((resp) => [{ text: resp.text }])

    const question = `${promptIndex + 1} - ${currentPrompt.question}`

    

    // session.currentStep++

    const replyMarkup = {
      keyboard: options,
      resize_keyboard: true,
    }

    await telegramBot.sendMessage(chatId, question, {
      reply_markup: replyMarkup,
    })

    // session.data.currentPrompt = currentPrompt

    if (
      promptIndex === 1 &&
      session.data.currentPrompt!.response[0].text === "No"
    ) {
      // If the response to the second prompt is "No", skip the next prompt
      session.currentStep += 2 // Skip the next prompt
    } else {
      session.currentStep++ // Otherwise, proceed to the next prompt
      // session.data.currentPrompt = currentPrompt
    }
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


<!-- --- -->

if (
      promptIndex === 2 &&
      userResponses[chatId][1]?.text === "No"
    ) {
      session.currentStep = +2

      // await sendNextQuestion(chatId)
      const options = currentPrompt.response.map((resp) => [
        { text: resp.text },
      ])

      const question = `${promptIndex + 1} - ${currentPrompt.question}`

      // session.currentStep++
      session.data.currentPrompt = currentPrompt

      const replyMarkup = {
        keyboard: options,
        resize_keyboard: true,
      }

      await telegramBot.sendMessage(chatId, question, {
        reply_markup: replyMarkup,
      })
    } else {
      const options = currentPrompt.response.map((resp) => [
        { text: resp.text },
      ])

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
    }

    <!-- new  -->
    if (session.currentStep === 2 && selectedOption.value === "No") {
      //   session.currentStep += 2

      //   const currentPrompt = prompts[session.currentStep]

      //   const options = currentPrompt?.response.map((resp) => [
      //     { text: resp.text },
      //   ])

      //   const question = `${session.currentStep + 1} - ${
      //     currentPrompt?.question
      //   }`

      //   const replyMarkup = {
      //     keyboard: options,
      //     resize_keyboard: true,
      //   }

      //   await telegramBot.sendMessage(chatId, question, {
      //     reply_markup: replyMarkup,
      //   })

      //   // await sendPackLink(chatId)

      //   // await sendNextQuestion(chatId)
      // } else if (session.currentStep === 4 && selectedOption.value) {
      //   console.log("called No 4")
      //   await sendNextQuestion(chatId)
      //   // await sendPackLink(chatId)
      // } else if (session.currentStep === 1 && selectedOption.value) {
      //   sendNextQuestion(chatId)
      // } 

      <!-- newest -->
      if (session.currentStep === 2 && selectedOption.text === "No") {
        session.currentStep += 1
        const currentPrompt = prompts[session.currentStep]

        const options = currentPrompt?.response.map((resp) => [
          { text: resp.text },
        ])

        const question = `${session.currentStep + 1} - ${
          currentPrompt?.question
        }`

        const replyMarkup = {
          keyboard: options,
          resize_keyboard: true,
        }

        await telegramBot.sendMessage(chatId, question, {
          reply_markup: replyMarkup,
        })

        console.log("No selected", currentPrompt, session.currentStep)
      } else if (session.currentStep === 4 && selectedOption.value) {
        await sendNextQuestion(chatId)
        await sendPackLink(chatId)
      } else if (session.currentStep === 3) {
        await sendPackLink(chatId)
      } else {
        await sendNextQuestion(chatId)
      }