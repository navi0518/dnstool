$(document).ready(function () {
    $('#dnsMapForm').submit(function (event) {
        event.preventDefault();
        var domain = $('#domain').val();
        $.ajax({
            type: 'POST',
            url: '/dns-map',
            data: {domain: domain},
            success: function (response) {
                displayDNSMap(response);
            },
            error: function (xhr, status, error) {
                $('#dnsMapResult').html('<p>Error fetching DNS map. Please try again.</p>');
            }
        });
    });
});

function displayDNSMap(data) {
    var dnsMapResult = $('#dnsMapResult');
    dnsMapResult.empty();
    dnsMapResult.append('<h2>DNS Map for ' + data.domain + '</h2>');
    for (var recordType in data.dns_map) {
        if (data.dns_map.hasOwnProperty(recordType)) {
            dnsMapResult.append('<h3>' + recordType + '</h3>');
            data.dns_map[recordType].forEach(record => {
                var domain = record.split(" ")[0];
                dnsMapResult.append('<p><a href="#" onclick="showServerIP(\'' + domain + '\')">' + domain + '</a></p>');
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
            throw new Error('Failed to fetch server IP address');
        }
        const data = await response.json();
        const ipAddress = data.ipAddress;

        // Display the server IP address
        alert(`The server IP address for domain ${domain} is: ${ipAddress}`);
    } catch (error) {
        console.error('Error fetching server IP address:', error);
        alert('Error fetching server IP address. Please try again.');
    }
}
