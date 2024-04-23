$(document).ready(function () {
  // Function to handle form submission
  function submitForm(event) {
    event.preventDefault();
    var domain = $("#domain").val();
    $.ajax({
      type: "POST",
      url: "/dns-map",
      data: { domain: domain },
      success: function (response) {
        displayDNSMap(response);
      },
      error: function (xhr, status, error) {
        $("#dnsMapResult").html("<p>" + xhr.responseJSON.error + "</p>");
      },
    });
  }

  // Submit the form when Enter key is pressed
  $("#domain").keypress(function (event) {
    if (event.which === 13) {
      // 13 is the keycode for Enter key
      submitForm(event);
    }
  });

  // Submit the form when the form is submitted
  $("#dnsMapForm").submit(submitForm);
});

// Function to display DNS map data
function displayDNSMap(data) {
  var dnsMapResult = $("#dnsMapResult");
  dnsMapResult.empty();
  dnsMapResult.append("<h2>DNS Map for " + data.domain + "</h2>");
  for (var recordType in data.dns_map) {
    if (data.dns_map.hasOwnProperty(recordType)) {
      dnsMapResult.append("<h3>" + recordType + "</h3>");
      data.dns_map[recordType].forEach((record) => {
        dnsMapResult.append("<p>" + record + "</p>");
      });
    }
  }
}

// Function to show the server IP address when a domain link is clicked
async function showServerIP(domain) {
  try {
    // Make an HTTP GET request to fetch the server IP address from the API
    const response = await fetch(`/get-ip?domain=${domain}`);
    if (!response.ok) {
      throw new Error("Failed to fetch server IP address");
    }
    const data = await response.json();
    const ipAddress = data.ipAddress;

    // Display the server IP address
    alert(`The server IP address for domain ${domain} is: ${ipAddress}`);
  } catch (error) {
    console.error("Error fetching server IP address:", error);
    alert("Error fetching server IP address. Please try again.");
  }
}
