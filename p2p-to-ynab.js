var ynabFields = "Date,Payee,Category,Memo,Outflow,Inflow".split(",")

function pageReady() {
  fileSupport();
  $("button.nextTab").click(nextTab);
  $("button.prevTab").click(prevTab);
  $("#inputFile").on("change", handleFileSelect);
  $("#toggleCsvInput").click(function() { $("#csvInput").slideToggle(); });
  $("#toggleCsvOutput").click(function() { $("#csvOutput").slideToggle(); });
  $("#toggleIgnoredOutput").click(function() { $("#ignoredOutput").slideToggle(); });
  $("#csvInput").on("change keyup paste", function() { $("#convert").prop("disabled", $(this).val().length == 0);} );
  $("#csvOutput").on("change keyup paste", function() { $("#save").prop("disabled", $(this).val().length == 0);})
    $("#save").click(handleFileSave);
}

function nextTab() {
  $('.nav-tabs > .active').next('li').find('a').trigger('click');
}

function prevTab() {
  $('.nav-tabs > .active').prev('li').find('a').trigger('click');
}

function fileSupport() {
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    $('.fileSupport').remove();
  } else {
    $(".advanced-field").hide();
  }
}

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  $.each(
    files,
    function(index, file) {
      var reader = new FileReader();
      reader.onload = (function(aTextArea, alertsDiv){
        return function (e) {
          $(aTextArea).val(e.target.result)
          $(aTextArea).trigger("change")

          $(alertsDiv).append('<div id="loadAlert" class="alert alert-info" role="alert">Loaded ' + e.target.result.split("\n").length + ' lines</div>');
          $("#loadAlert").delay(5000).fadeOut(300);
        };
      })("#csvInput", "#alerts");
      reader.readAsText(file);
    }
  )
}

function handleFileSave() {
  var fileName="Import to YNAB.csv"
  var text = $("#csvOutput").val();

    var downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    downloadLink.setAttribute('download', fileName);

    if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      downloadLink.dispatchEvent(event);
    } else {
      downloadLink.click();
    }

    console.log("deed it");
}

function csvLineToTransaction(line, p2pFields) {
  transaction = {}

  $.each(
    Papa.parse(line).data,
    function(index, dataValue) {
      $.each(
        dataValue,
        function(index, lineValue) {
          transaction[p2pFields[index]] = lineValue;
      });
  });
  
  return Object.keys(transaction).length == p2pFields.length ? transaction : null;
}

function convert(p2pFields) {
  var ynabConfig = {
    "interestPayee":     $("#interestPayee").val(),
    "loanAccount":       "Transfer: " + $("#loanAccount").val(),
    "withdrawAccount":   "Transfer: " + $("#withdrawAccount").val(),
    "capitalCategory":   $("#capitalCategory").val(),
    "interestCategory":  $("#interestCategory").val()
  }

  var outCSV = ynabFields;

  var outIgnored = "";
  $.each(
      $("#csvInput").val().split("\n"),
      function(index, line) {
        out = transformTransaction(csvLineToTransaction(line, p2pFields), ynabConfig);
        if (out) {
          outCSV += "\n" + out;
        } else {
          // didn't process line
          if (
            line.length > 0 && 
            line != p2pFields.join(",")
            ) {
              outIgnored += line + "\n";
            }
        }
      }
      )

  $("#csvOutput").val(outCSV);
  $("#csvOutput").trigger("change");
  $("#ignoredOutput").val(outIgnored);

  var numConverted = outCSV.split("\n").length - 1
  var numIgnored = outIgnored.split("\n").length - 1

  $("#alerts").append('<div id="convertAlert" class="alert alert-info" role="alert">Converted ' + numConverted + ' entries and ignored ' + numIgnored + ' entries.</div>');
  $("#convertAlert").delay(5000).fadeOut(300);

  $("#convertedEntries").text("(" + numConverted + ")");
  $("#ignoredEntries").text("(" + numIgnored + ")");

  nextTab();
}
