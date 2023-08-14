"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const prompt_1 = require("./lib/prompt");
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
// TODO: Install and setup `dotenv`
const PORT = process.env.PORT || 5001;
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN ||
    `6458448932:AAHWKZiUp05ScxCM1TtRLF57aJULGuNL8ko`;
const webhookUrl = "https://telegram-bot-api-tawny.vercel.app";
const telegramBot = new node_telegram_bot_api_1.default(telegramBotToken, {
    polling: true,
});
let userName = {};
let userResponses = {};
const userSession = {};
// user options
let userClass;
let subject;
let altOpts;
let pack = "";
const welcomeMessage = `
Instructions:
1. Read the Prompt carefully.
2. Reply with your chosen option.
3. Send 'hi' to start a conversation
4. Send '/start' to Restart From the Beginning.
5. Enjoy the conversation!
`;
// ------------ Response Actions ---------------
const responseActions = {
    Primary1: async (chatId) => {
        await telegramBot.sendMessage(chatId, "You selected Primary 1");
        await sendNextQuestion(chatId);
    },
    English: async (chatId) => {
        // Handle English option
        await telegramBot.sendMessage(chatId, "You selected English.");
    },
    Maths: async (chatId) => {
        // Handle Maths option
        await telegramBot.sendMessage(chatId, "You selected Maths.");
    },
    Science: async (chatId) => {
        // Handle Science optiondelete my project
        await telegramBot.sendMessage(chatId, "You selected Science.");
    },
    Biology: async (chatId) => {
        // Handle Biology option
        await telegramBot.sendMessage(chatId, "You selected Biology.");
    },
    // Add more response-action pairs as needed
};
// ------------ Response Actions End -----------
const sendNextQuestion = async (chatId) => {
    if (!userSession[chatId]) {
        userSession[chatId] = { currentStep: 0, data: {}, responses: [] };
    }
    const session = userSession[chatId];
    const finalMessage = `
Thanks ${userName[chatId]?.firstname},

It was really nice talking to you.

I'm glad I could be of assistance Today!
Here's the Link to your Study Pack.`;
    const promptIndex = session.currentStep;
    if (promptIndex < prompt_1.prompts.length) {
        const currentPrompt = prompt_1.prompts[promptIndex];
        const options = currentPrompt.response.map((resp) => [{ text: resp.text }]);
        const question = `${promptIndex + 1} - ${currentPrompt.question}`;
        session.currentStep++;
        session.data.currentPrompt = currentPrompt;
        const replyMarkup = {
            keyboard: options,
            resize_keyboard: true,
        };
        await telegramBot.sendMessage(chatId, question, {
            reply_markup: replyMarkup,
        });
    }
    else {
        // prompts completed
        delete userResponses[chatId]; // is this correct / necessary?
        await telegramBot.sendMessage(chatId, finalMessage, {
            reply_markup: {
                keyboard: [],
                resize_keyboard: false,
                remove_keyboard: true,
            },
        });
        await sendPackLink(chatId, pack);
    }
};
// Send study pack link
const sendPackLink = async (chatId, pack) => {
    const keyboard = {
        inline_keyboard: [
            [
                {
                    text: "Read Study Pack Online",
                    url: pack,
                },
            ],
        ],
    };
    await telegramBot.sendMessage(chatId, `Click the Button  ⬇  to Download Your Pack!.`, {
        reply_markup: keyboard,
    });
};
let classSelection;
let studentClass;
let subjectLink;
telegramBot.on("message", async (message) => {
    const chatId = message.chat.id;
    const response = message.text;
    const session = userSession[chatId];
    if (session && session.data.currentPrompt) {
        const selectedOption = session.data.currentPrompt.response.find((resp) => resp.text === response);
        if (selectedOption) {
            console.log(userSession[chatId].currentStep);
            console.log(selectedOption.text);
            session.responses.push(selectedOption);
            console.log("one here..... ", classSelection);
            if (session.currentStep === 2 && selectedOption.text === "No") {
                session.currentStep += 1;
                await sendNextQuestion(chatId);
            }
            else if (session.currentStep === 3 && selectedOption.value) {
                // TODO:
                if (studentClass === "Primary 1" ||
                    studentClass === "Primary 2" ||
                    studentClass === "Primary 3") {
                    switch (selectedOption.value) {
                        case "English":
                            subjectLink =
                                "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-1-3-English.pdf";
                            break;
                        case "Maths":
                            subjectLink =
                                "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-1-3-Mathematics.pdf";
                            break;
                        case "Science":
                            subjectLink =
                                "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-1-3-Science.pdf";
                            break;
                        default:
                            subjectLink = "https://google.com";
                            break;
                    }
                }
                else if (studentClass === "Primary 4" ||
                    studentClass === "Primary 5" ||
                    studentClass === "Primary 6") {
                    switch (selectedOption.value) {
                        case "English":
                            subjectLink =
                                "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-4-6-English.pdf";
                            break;
                        case "Maths":
                            subjectLink =
                                "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-4-6-Maths.pdf";
                            break;
                        case "Science":
                            subjectLink =
                                "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-4-6-Science.pdf";
                            break;
                        default:
                            subjectLink = "https://google.com";
                            break;
                    }
                }
                else if (studentClass === "JSS 1" ||
                    studentClass === "JSS 2" ||
                    studentClass === "JSS 3") {
                    switch (selectedOption.value) {
                        case "English":
                            subjectLink =
                                "https://oeqalagos.com/wp-content/uploads/2023/08/Jss1-3-English.pdf";
                            break;
                        case "Maths":
                            subjectLink =
                                "https://oeqalagos.com/wp-content/uploads/2023/08/Jss1-3-Maths.pdf";
                            break;
                        case "Science":
                            subjectLink =
                                "https://oeqalagos.com/wp-content/uploads/2023/08/Jss1-3-Science.pdf";
                            break;
                        default:
                            subjectLink = "https://google.com";
                            break;
                    }
                }
                else if (studentClass === "SSS 1" ||
                    studentClass === "SSS 2" ||
                    studentClass === "SSS 3") {
                    switch (selectedOption.value) {
                        case "English":
                            subjectLink =
                                "https://oeqalagos.com/wp-content/uploads/2023/08/Jss1-3-English.pdf";
                            break;
                        case "Maths":
                            subjectLink =
                                "https://oeqalagos.com/wp-content/uploads/2023/08/SS1-3-Maths.pdf";
                            break;
                        case "Science":
                            subjectLink =
                                "https://oeqalagos.com/wp-content/uploads/2023/08/Jss1-3-Science.pdf";
                            break;
                        default:
                            subjectLink = "https://google.com";
                            break;
                    }
                }
                else {
                    subjectLink = "https://google.com/wrong";
                    console.log("something went wrong");
                }
                console.log("make sure > ", subjectLink);
                console.log("class selection ", classSelection);
                await sendPackLink(chatId, subjectLink);
            }
            else if (session.currentStep === 4 && selectedOption.value) {
                pack = getPackLink(selectedOption.value);
                await sendPackLink(chatId, pack);
            }
            else if (session.currentStep === 1 && selectedOption.value) {
                studentClass = selectedOption.value;
                classSelection = getPackLink(selectedOption.value);
                await sendNextQuestion(chatId);
            }
            else {
                await sendNextQuestion(chatId);
            }
        }
        else {
            await telegramBot.sendMessage(chatId, `Invalid Selection`);
            console.log(session.currentStep);
        }
    }
    // If there is a current Prompt
});
// -----
const getPackLink = (value) => {
    switch (value) {
        case "Primary 1":
            return "https://oeqalagos.com/wp-content/uploads/2020/03/Year-1-Home-Learning-Pack.pdf-min.pdf";
        case "Primary 2":
            return "https://oeqalagos.com/wp-content/uploads/2020/03/Year-2-Home-Learning-Pack.pdf-min.pdf";
        case "Primary 3":
            return "https://oeqalagos.com/wp-content/uploads/2020/03/Year-3-Home-Learning-Pack.pdf-min.pdf";
        case "Primary 4":
            return "https://oeqalagos.com/wp-content/uploads/2020/03/Year-4-Home-Learning-Pack.pdf-min.pdf";
        case "Primary 5":
            return "https://oeqalagos.com/wp-content/uploads/2020/03/Year-5-Home-Learning-Pack-.pdf-min.pdf";
        case "Primary 6":
            return "https://oeqalagos.com/wp-content/uploads/2020/03/Year-6-Home-Learning-Pack-min.pdf";
        case "Waec Prep Kit":
            return "https://oeqalagos.com/wp-content/uploads/2020/04/waec-prep-kit-min.pdf";
        case "Tips for Virtual Education":
            return "https://oeqalagos.com/wp-content/uploads/2020/04/Tips-for-Virtual-Education-min.pdf";
        default:
            return "https://oeqalagos.com/";
    }
};
const subLinks = {
    pri1to3: {
        English: "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-1-3-English.pdf",
        Mathematics: "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-1-3-Mathematics.pdf",
        Art: "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-1-3-Art.pdf",
        PhyEdu: "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-1-3-Physical-Education.pdf",
        Science: "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-1-3-Science.pdf",
        Answers: "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-1-3-Answers.pdf",
    },
    pri4to6: {
        English: "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-4-6-English.pdf",
        Mathematics: "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-4-6-Maths.pdf",
        Science: "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-4-6-Science.pdf",
        WellBeing: "https://oeqalagos.com/wp-content/uploads/2023/08/Jss1-3-Well-Being.pdf",
        WritingPrompt: "https://oeqalagos.com/wp-content/uploads/2023/08/Jss1-3-Writing-prompts.pdf",
        Answers: "https://oeqalagos.com/wp-content/uploads/2023/08/Jss1-3-Answers.pdf",
    },
    ss1to3: {
        Mathematics: "https://oeqalagos.com/wp-content/uploads/2023/08/SS1-3-Maths.pdf",
        Answers: "https://oeqalagos.com/wp-content/uploads/2023/08/SS1-3-Answers.pdf",
    },
};
const captureUserName = async (chatId) => {
    // Capture response
    await telegramBot.sendMessage(chatId, `What is your First and Last Name?`);
    telegramBot.once("message", async (responseMsg) => {
        const names = responseMsg.text;
        if (names) {
            const [firstname, lastname] = names.split(" ", 2);
            userName[chatId] = {
                firstname,
                lastname,
            };
            await telegramBot.sendMessage(chatId, `
      Welcome! ${firstname}`);
            await sendNextQuestion(chatId);
        }
        else {
            await telegramBot.sendMessage(chatId, "Enter Your Names to Proceed!.");
            captureUserName(chatId); // Re-capture user's name if not provided
        }
    });
};
// restart
telegramBot.onText(/\/start/i, async (message) => {
    const chatId = message.chat.id;
    userSession[chatId] = { currentStep: 0, data: {}, responses: [] };
    userResponses[chatId] = [];
    delete userName[chatId];
    await telegramBot.sendMessage(chatId, welcomeMessage);
    captureUserName(chatId);
});
// check api health
app.get("/", (req, res) => {
    return res.status(200).json({
        msg: "Working fine.",
    });
});
// Create a route to handle incoming Telegram updates (webhook)
// app.post(`/${telegramBotToken}`, (req: Request, res: Response) => {
//   // process incoming update from telegram
//   telegramBot.processUpdate(req.body)
//   // respond to the request
//   res.status(200)
// })
// Set the webhook for the bot
// telegramBot.setWebHook(`${webhookUrl}/${telegramBotToken}`)
// Handle errors
telegramBot.on("polling_error", (error) => {
    console.error(error);
});
// Start Server
app.listen(PORT, async () => {
    await telegramBot.setWebHook(webhookUrl);
    console.log(`Listening on PORT: ${PORT}`);
});
