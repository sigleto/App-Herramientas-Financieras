const test = require("node:test");
const assert = require("node:assert/strict");
const {
  calculateMortgagePayment,
  calculateMonthlySavings,
  calculateMonthlySavingsAtRate,
  calculateMonthlyAnnuity,
  calculateEarlyRepayment,
  calculateInvestment,
  compareMortgage,
} = require("./finanzas");

test("mortgage payment handles positive and zero interest", () => {
  assert.equal(calculateMortgagePayment(12000, 0, 1), 1000);
  assert.ok(Math.abs(calculateMortgagePayment(200000, 3, 30) - 843.21) < 0.01);
});

test("monthly savings contribution reaches the goal with or without interest", () => {
  assert.equal(calculateMonthlySavings(12000, 0, 1), 1000);
  assert.equal(calculateMonthlySavingsAtRate(12000, 0, 12), 1000);
  assert.ok(calculateMonthlySavingsAtRate(12000, 0.01, 12) < 1000);
  const monthly = calculateMonthlySavings(10000, 5, 2);
  assert.ok(monthly > 0 && monthly < 10000 / 24);
});

test("monthly annuity payment handles zero and positive annual interest", () => {
  assert.equal(calculateMonthlyAnnuity(12000, 0, 12), 1000);
  assert.ok(calculateMonthlyAnnuity(12000, 5, 12) > 1000);
});

test("early repayment compares lower payments and a shorter term", () => {
  const result = calculateEarlyRepayment({
    principal: 100000,
    annualRatePercent: 5,
    months: 240,
    extraPayment: 10000,
  });
  assert.ok(result.reducedPayment.monthlyPayment < result.originalMonthlyPayment);
  assert.ok(result.reducedTerm.months < 240);
  assert.ok(result.reducedPayment.interestSaved > 0);
  assert.ok(result.reducedTerm.interestSaved > 0);
});

test("early repayment handles a zero-interest loan", () => {
  const result = calculateEarlyRepayment({
    principal: 12000,
    annualRatePercent: 0,
    months: 120,
    extraPayment: 1200,
  });
  assert.equal(result.originalMonthlyPayment, 100);
  assert.ok(result.reducedTerm.months < 120);
});

test("investment result separates nominal and inflation-adjusted values", () => {
  const result = calculateInvestment({
    initialCapital: 1000,
    monthlyContribution: 100,
    annualReturnPercent: 5,
    annualInflationPercent: 2,
    years: 10,
  });
  assert.ok(result.futureValue > result.realValue);
  assert.equal(result.totalContributions, 13000);
});

test("mortgage comparison includes fees and costs", () => {
  const result = compareMortgage({
    principal: 100000,
    years: 20,
    annualRatePercent: 2,
    fees: 500,
    costs: 1000,
  });
  assert.ok(result.totalCost > 101500);
  assert.ok(result.monthlyPayment > 0);
});

test("financial calculators reject invalid amounts and rates", () => {
  assert.throws(() => calculateMortgagePayment(-1, 2, 20), RangeError);
  assert.throws(() => calculateMortgagePayment(1000, -1, 20), RangeError);
  assert.throws(() => calculateMonthlySavings(1000, 2, 0), RangeError);
});
