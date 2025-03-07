const formatCurrencyToNumber = (value: string): number => {
    // Remove o "R$", espaços e pontos (separadores de milhar), depois substitui vírgula por ponto
    return parseFloat(value.replace(/[R$\s.]/g, "").replace(",", "."));
  };
  
  export default formatCurrencyToNumber;