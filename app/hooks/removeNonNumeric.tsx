const removeNonNumeric = (str: string): string => {
  return str.replace(/\D/g, ""); // \D significa "qualquer coisa que NÃO seja número"
};

export default removeNonNumeric;
