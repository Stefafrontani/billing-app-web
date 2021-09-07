export interface IPayment {
  purchaseId: string,
  expirationDate: Date,
  amount: number,
  feeNumber: number,
  purchaseDescription: string,
  totalFees: number
}