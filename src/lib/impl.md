if (
  (classSelection === "Primary 1" && selectedOption.value) ||
  (classSelection === "Primary 2" && selectedOption.value) ||
  (classSelection === "Primary 3" && selectedOption.value)
) {
  switch (selectedOption.value) {
    case "English":
      subjectLink =
        "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-1-3-English.pdf"
      break
    case "Maths":
      subjectLink =
        "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-1-3-Mathematics.pdf"
      break
    case "Science":
      subjectLink =
        "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-1-3-Science.pdf"
      break
    default:
      subjectLink = "https://google.com"
      break
  }
} else if (
  (classSelection === "Primary 4" && selectedOption.value) ||
  (classSelection === "Primary 5" && selectedOption.value) ||
  (classSelection === "Primary 6" && selectedOption.value)
) {
  switch (selectedOption.value) {
    case "English":
      subjectLink =
        "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-4-6-English.pdf"
      break
    case "Maths":
      subjectLink =
        "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-4-6-Maths.pdf"
      break
    case "Science":
      subjectLink =
        "https://oeqalagos.com/wp-content/uploads/2023/08/Pry-4-6-Science.pdf"
      break
    default:
      subjectLink = "https://google.com"
      break
  }
} else if (
  (classSelection === "JSS 1" && selectedOption.value) ||
  (classSelection === "JSS 2" && selectedOption.value) ||
  (classSelection === "JSS 3" && selectedOption.value)
) {
  switch (selectedOption.value) {
    case "English":
      subjectLink =
        "https://oeqalagos.com/wp-content/uploads/2023/08/Jss1-3-English.pdf"
      break
    case "Maths":
      subjectLink =
        "https://oeqalagos.com/wp-content/uploads/2023/08/Jss1-3-Maths.pdf"
      break
    case "Science":
      subjectLink =
        "https://oeqalagos.com/wp-content/uploads/2023/08/Jss1-3-Science.pdf"
      break
    default:
      subjectLink = "https://google.com"
      break
  }
} else if (
  (classSelection === "SSS 1" && selectedOption.value) ||
  (classSelection === "SSS 2" && selectedOption.value) ||
  (classSelection === "SSS 3" && selectedOption.value)
) {
  switch (selectedOption.value) {
    case "English":
      subjectLink =
        "https://oeqalagos.com/wp-content/uploads/2023/08/Jss1-3-English.pdf"
      break
    case "Maths":
      subjectLink =
        "https://oeqalagos.com/wp-content/uploads/2023/08/SS1-3-Maths.pdf"
      break
    case "Science":
      subjectLink =
        "https://oeqalagos.com/wp-content/uploads/2023/08/Jss1-3-Science.pdf"
      break
    default:
      subjectLink = "https://google.com"
      break
  }
} else {
  console.log("something went wrong")
}
