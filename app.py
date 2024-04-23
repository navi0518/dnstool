from flask import Flask, render_template, request, jsonify
import dns.resolver
import dns.rdatatype

app = Flask(__name__)

def get_dns_map(domain):
    dns_records = {}
    resolver = dns.resolver.Resolver()
    try:
        # List of common DNS record types
        record_types = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT']
        
        for record_type in record_types:
            answer = resolver.resolve(domain, record_type)
            dns_records[record_type] = [str(rdata) for rdata in answer]

    except dns.resolver.NXDOMAIN:
        raise ValueError("Domain not found")
    except dns.resolver.NoAnswer:
        # No DNS records found, return an empty dictionary
        return dns_records
    except Exception as e:
        raise e

    return dns_records

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/dns-map", methods=["POST"])
def dns_map():
    domain = request.form.get("domain")
    if not domain:
        return jsonify({"error": "Domain parameter is required"}), 400
    try:
        dns_map_data = get_dns_map(domain)
        return jsonify({"domain": domain, "dns_map": dns_map_data})
    except dns.resolver.NXDOMAIN:
        return jsonify({"error": "Domain not found"}), 404
    except dns.resolver.NoAnswer:
        return jsonify({"error": "No DNS records found for the domain"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
