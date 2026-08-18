import { TransactionStatus, TransactionType } from '../enums/finance.enum';

export interface TransactionDraft {
  type: TransactionType;
  amountInCents: number;
  accountId: string;
  destinationAccountId?: string | null;
  categoryId?: string | null;
}

export interface BalanceMovement {
  type: TransactionType;
  status: TransactionStatus;
  amountInCents: number;
  accountId: string;
  destinationAccountId?: string | null;
}

export interface DomainValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTransactionDraft(
  transaction: TransactionDraft,
): DomainValidationResult {
  const errors: string[] = [];

  if (
    !Number.isInteger(transaction.amountInCents) ||
    transaction.amountInCents <= 0
  ) {
    errors.push(
      'O valor deve ser um número inteiro de centavos maior que zero.',
    );
  }

  if (transaction.type === TransactionType.TRANSFER) {
    if (!transaction.destinationAccountId) {
      errors.push('Uma transferência deve possuir uma conta de destino.');
    }

    if (transaction.destinationAccountId === transaction.accountId) {
      errors.push('As contas de origem e destino devem ser diferentes.');
    }

    if (transaction.categoryId) {
      errors.push(
        'Transferências não utilizam categorias de receita ou despesa.',
      );
    }
  } else {
    if (!transaction.categoryId) {
      errors.push('Receitas e despesas devem possuir uma categoria.');
    }

    if (transaction.destinationAccountId) {
      errors.push('Somente transferências podem possuir uma conta de destino.');
    }
  }

  return { valid: errors.length === 0, errors };
}

export function calculateAccountBalance(
  accountId: string,
  initialBalanceInCents: number,
  movements: BalanceMovement[],
): number {
  return movements.reduce((balance, movement) => {
    if (movement.status !== TransactionStatus.COMPLETED) {
      return balance;
    }

    if (
      movement.type === TransactionType.INCOME &&
      movement.accountId === accountId
    ) {
      return balance + movement.amountInCents;
    }

    if (
      movement.type === TransactionType.EXPENSE &&
      movement.accountId === accountId
    ) {
      return balance - movement.amountInCents;
    }

    if (movement.type === TransactionType.TRANSFER) {
      if (movement.accountId === accountId) {
        return balance - movement.amountInCents;
      }

      if (movement.destinationAccountId === accountId) {
        return balance + movement.amountInCents;
      }
    }

    return balance;
  }, initialBalanceInCents);
}
