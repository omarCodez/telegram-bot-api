import type { PromptProps } from "..";

export const prompts: PromptProps[] = [
  {
    question: "What Class are you?",
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
    question: "Which subject would you like to Study?",
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
