var ratesetterFields = "Date,Market,Type,Item,Amount,Capital,Interest,Fee".split(",")

function dateSwizzle(date) {
  return date.split("-").reverse().join("/");
}

function transformTransaction(transaction, ynabConfig) {
  var transactionTypes = {
    "Account open":                       false,
    "BPAY funds transfer in":             false,
    "Cancellation of order":              false,
    "Interest payment":                   "interest",
    "Lend order":                         false,
    "Lender interest margin fee":         "fee",
    "Monthly repayment":                  "repayment",
    "Next Day Money Withdrawal request":  "withdrawal"
  }
  
  if (!transaction) {
    return null;
  }

  var transactionType = transactionTypes[transaction["Type"]];

  if (!transactionType) {
    return null;
  }

  // 07/25/10,Sample Payee,,Sample Memo for an outflow,100.00,
  switch(transactionType) {
    case "interest":
      return [dateSwizzle(transaction["Date"]), ynabConfig["interestPayee"], ynabConfig["interestCategory"], "Interest " + transaction["Item"], "", transaction["Interest"]].join(",");
      break;
    case "fee":
      return [dateSwizzle(transaction["Date"]), ynabConfig["interestPayee"], ynabConfig["interestCategory"], "RateSetter Fee " + transaction["Item"], transaction["Fee"].replace("-",""), ""].join(",");
      break;
    case "repayment":
      return [dateSwizzle(transaction["Date"]), ynabConfig["loanAccount"], ynabConfig["capitalCategory"], "Repayment " + transaction["Item"], "", transaction["Capital"]].join(",");
      break;
    case "withdrawal":
      return [dateSwizzle(transaction["Date"]), ynabConfig["withdrawAccount"], "", "Withdrawal", transaction["Amount"].replace("-",""), ""].join(",");
      break;
    default:
      return null;
  }
}


$( document ).ready(
  function() {
    pageReady();
    $("#convert").click(
      function() {convert(ratesetterFields)}
    )
  }
)
