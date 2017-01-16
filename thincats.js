var thincatsFields = "Date,Description,Credits,Debits,Balances".split(",")

function transformTransaction(transaction, ynabConfig) {
  var transactionTypes = {
    "Total:":                   "skip",
    "Funds added":              false,
    "Loan to ...":              false,
    "Interest on balances ":    "balance_interest",
    "Interest payment":         "interest",
    "Capital repayment":        "repayment",
    "Funds withdrawal":         "withdrawal"
  }
  
  if (!transaction) {
    return null;
  }

  var activity = null;
  var item = null;

  var description = $.trim(transaction["Description"].replace(/"/g, ""));
  var description_split = description.split("  from  ");

  if (description_split.length > 1) {
    activity = description_split[0];
    item = description_split[1];
  } else {
    activity = description
    item = null;
  }

  var transactionType = transactionTypes[activity];

  if (!transactionType) {
    return null;
  }

  // 07/25/10,Sample Payee,,Sample Memo for an outflow,100.00,
  switch(transactionType) {
    case "interest":
      return [transaction["Date"], ynabConfig["interestPayee"], ynabConfig["interestCategory"], "Interest payment from " + item, "", transaction["Credits"]].join(",");
      break;
    case "balance_interest":
      return [transaction["Date"], ynabConfig["interestPayee"], ynabConfig["interestCategory"], "Balance interest", "", transaction["Credits"]].join(",");
      break;
    case "repayment":
      return [transaction["Date"], ynabConfig["loanAccount"], ynabConfig["capitalCategory"], "Capital repayment from " + item, "", transaction["Credits"]].join(",");
      break;
    case "withdrawal":
      return [transaction["Date"], ynabConfig["withdrawAccount"], "", "Withdrawal", transaction["Debits"].replace("-",""), ""].join(",");
      break;
    default:
      return null;
  }
}


$( document ).ready(
  function() {
    pageReady();
    $("#convert").click(
      function() {convert(thincatsFields)}
    )
  }
)

