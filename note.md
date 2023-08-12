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