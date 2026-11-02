function assertFinitePositive(value, label) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} debe ser mayor que cero.`);
  }
}

function assertRate(value, label = "El tipo de interés") {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(`${label} debe estar entre 0 % y 100 %.`);
  }
}

function validateYears(years) {
  assertFinitePositive(years, "El plazo");
  if (years > 100) {
    throw new RangeError("El plazo no puede superar los 100 años.");
  }
}

function monthsForYears(years) {
  const months = Math.round(years * 12);
  if (months < 1 || months > 1200) {
    throw new RangeError("El plazo debe equivaler a entre 1 y 1200 meses.");
  }
  return months;
}

function parseFinancialNumber(value) {
  const normalized = String(value)
    .trim()
    .replace(/\s/g, "")
    .replace(/[.](?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  return normalized === "" ? NaN : Number(normalized);
}

function monthlyRate(annualRatePercent) {
  assertRate(annualRatePercent);
  return annualRatePercent / 100 / 12;
}

function calculateMortgagePayment(principal, annualRatePercent, years) {
  assertFinitePositive(principal, "El capital");
  validateYears(years);
  const rate = monthlyRate(annualRatePercent);
  const periods = monthsForYears(years);
  if (rate === 0) return principal / periods;
  return (principal * rate) / (1 - Math.pow(1 + rate, -periods));
}

function calculateMonthlySavings(goal, annualRatePercent, years) {
  assertFinitePositive(goal, "La meta");
  validateYears(years);
  assertRate(annualRatePercent);
  const rate = Math.pow(1 + annualRatePercent / 100, 1 / 12) - 1;
  const periods = monthsForYears(years);
  return calculateMonthlySavingsAtRate(goal, rate, periods);
}

function calculateMonthlySavingsAtRate(goal, rate, periods) {
  assertFinitePositive(goal, "La meta");
  if (!Number.isFinite(rate) || rate < 0 || rate > 0.2) {
    throw new RangeError("El tipo de interés mensual debe estar entre 0 % y 20 %.");
  }
  if (!Number.isInteger(periods) || periods <= 0 || periods > 1200) {
    throw new RangeError("El plazo debe ser de entre 1 y 1200 meses.");
  }
  if (rate === 0) return goal / periods;
  const discount = Math.pow(1 + rate, -periods);
  return (goal * rate * discount) / (1 - discount);
}

function calculateMonthlyAnnuity(principal, annualRatePercent, months) {
  assertFinitePositive(principal, "El capital");
  assertRate(annualRatePercent);
  if (!Number.isInteger(months) || months <= 0 || months > 1200) {
    throw new RangeError("El plazo debe ser de entre 1 y 1200 meses.");
  }
  const rate = Math.pow(1 + annualRatePercent / 100, 1 / 12) - 1;
  if (rate === 0) return principal / months;
  return (principal * rate) / (1 - Math.pow(1 + rate, -months));
}

function calculateEarlyRepayment({
  principal,
  annualRatePercent,
  months,
  extraPayment,
}) {
  assertFinitePositive(principal, "El capital");
  assertRate(annualRatePercent);
  if (!Number.isInteger(months) || months <= 0 || months > 1200) {
    throw new RangeError("El plazo debe ser de entre 1 y 1200 meses.");
  }
  if (
    !Number.isFinite(extraPayment) ||
    extraPayment <= 0 ||
    extraPayment >= principal
  ) {
    throw new RangeError("La amortización anticipada debe ser menor que el capital.");
  }

  const monthlyRateValue = annualRatePercent / 100 / 12;
  const originalMonthlyPayment = calculateMortgagePayment(
    principal,
    annualRatePercent,
    months / 12
  );
  const amortize = (initialBalance, paymentLimit) => {
    let balance = initialBalance;
    let totalInterest = 0;
    const rows = [];
    while (balance > 0.005 && rows.length < months) {
      const interest = balance * monthlyRateValue;
      const principalPaid = Math.min(balance, paymentLimit - interest);
      if (principalPaid <= 0) {
        throw new RangeError("La cuota no cubre los intereses mensuales.");
      }
      const payment = principalPaid + interest;
      balance = Math.max(0, balance - principalPaid);
      totalInterest += interest;
      rows.push({
        periodo: rows.length + 1,
        cuota: payment.toFixed(2),
        interes: interest.toFixed(2),
        amortizacion: principalPaid.toFixed(2),
        saldoPendiente: balance.toFixed(2),
      });
    }
    return { rows, totalInterest };
  };

  const baseline = amortize(principal, originalMonthlyPayment);
  const remainingPrincipal = principal - extraPayment;
  const reducedPaymentAmount = calculateMortgagePayment(
    remainingPrincipal,
    annualRatePercent,
    months / 12
  );
  const reducedPayment = amortize(remainingPrincipal, reducedPaymentAmount);
  const reducedTerm = amortize(remainingPrincipal, originalMonthlyPayment);

  return {
    originalMonthlyPayment,
    reducedPayment: {
      monthlyPayment: reducedPaymentAmount,
      monthlySavings: originalMonthlyPayment - reducedPaymentAmount,
      interestSaved: baseline.totalInterest - reducedPayment.totalInterest,
      rows: reducedPayment.rows,
    },
    reducedTerm: {
      months: reducedTerm.rows.length,
      monthsSaved: months - reducedTerm.rows.length,
      lastPayment: Number(
        reducedTerm.rows[reducedTerm.rows.length - 1]?.cuota || 0
      ),
      interestSaved: baseline.totalInterest - reducedTerm.totalInterest,
      rows: reducedTerm.rows,
    },
  };
}

function calculateInvestment({
  initialCapital,
  monthlyContribution,
  annualReturnPercent,
  annualInflationPercent,
  years,
}) {
  if (!Number.isFinite(initialCapital) || initialCapital < 0) {
    throw new RangeError("El capital inicial no puede ser negativo.");
  }
  if (!Number.isFinite(monthlyContribution) || monthlyContribution < 0) {
    throw new RangeError("La aportación mensual no puede ser negativa.");
  }
  validateYears(years);
  assertRate(annualReturnPercent, "La rentabilidad");
  assertRate(annualInflationPercent, "La inflación");

  const periods = monthsForYears(years);
  const monthlyReturn = Math.pow(1 + annualReturnPercent / 100, 1 / 12) - 1;
  const initialFutureValue = initialCapital * Math.pow(1 + monthlyReturn, periods);
  const contributionsFutureValue =
    monthlyReturn === 0
      ? monthlyContribution * periods
      : monthlyContribution *
        ((Math.pow(1 + monthlyReturn, periods) - 1) / monthlyReturn);
  const futureValue = initialFutureValue + contributionsFutureValue;
  const realValue = futureValue / Math.pow(1 + annualInflationPercent / 100, years);

  return {
    futureValue,
    realValue,
    totalContributions: initialCapital + monthlyContribution * periods,
  };
}

function compareMortgage({
  principal,
  years,
  annualRatePercent,
  fees,
  costs,
}) {
  for (const [label, value] of [
    ["Las comisiones", fees],
    ["Los gastos", costs],
  ]) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${label} no pueden ser negativos.`);
    }
  }
  const monthlyPayment = calculateMortgagePayment(
    principal,
    annualRatePercent,
    years
  );
  const totalInterest = Math.max(
    0,
    monthlyPayment * monthsForYears(years) - principal
  );
  return {
    monthlyPayment,
    totalInterest,
    totalCost: principal + totalInterest + fees + costs,
  };
}

module.exports = {
  calculateMortgagePayment,
  calculateMonthlySavings,
  calculateMonthlySavingsAtRate,
  calculateMonthlyAnnuity,
  calculateEarlyRepayment,
  calculateInvestment,
  compareMortgage,
  parseFinancialNumber,
};
