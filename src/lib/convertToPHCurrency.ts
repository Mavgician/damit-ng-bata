export function convertToPhCurrency(amount: number) {
  return Intl.NumberFormat('en-CA', { style: 'currency', currency: 'PHP' }).format(amount)
}